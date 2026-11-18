#!/usr/bin/env python3
"""단계 산출물 검수 — 메인 세션이 직접 실행한다 (서브에이전트를 거치지 않음).

    python3 scripts/review.py --project <[프로젝트] 폴더> --stage <단계> \
        --target <검수할 파일> [--target ...] \
        [--ref <근거 자료: persona · PRD · 상류 산출물 · 회사 conventions>] [--ref ...] \
        [--image <화면 PNG>] [--image ...] \
        [--revision N] [--rollbacks researcher=1,pm=0] [--prev <이전 검수 파일>] [--note "추가 지시"]

- 단계: researcher | pm | planner | ux-writer | designer | engineer | qa
- --target · --ref · --image는 여러 파일을 한 번에 받는다 (예: --image shots/*.png)
- 결과 파일: [프로젝트]/reviews/<단계>-<NN>.md (NN은 자동 증가, 먼저 자리를 잡아 덮어쓰지 않음)
- 표준 출력 마지막 줄 = JSON {"verdict", "review_file", "model", "rollback_to", "capped", "format_ok"}
- 종료 코드: 0 정상 · 2 인자 오류 · 없는 파일(→ 고쳐서 다시) · 3 Codex를 안 씀(미설치 또는 crew.config.md reviewer: claude → 메인 세션이 Claude로 검수하고 '같은 모델 검수' 표시)
            4 Codex 실패(→ 1회 재실행, 또 실패하면 escalate) · 5 답 형식 깨짐(→ 1회 재실행, 또 깨지면 원문 첨부해 escalate)
- 한 번 실행 제한 540초. Bash 도구로 부를 때 timeout 600000을 준다.
"""
import argparse, glob, json, os, re, shutil, subprocess, sys

CREW = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STAGES = ["researcher", "pm", "planner", "ux-writer", "designer", "engineer", "qa"]
# agents/reviewer/CLAUDE.md의 단계별 절 제목
HEADINGS = {"researcher": "Researcher 검수", "pm": "PM PRD 검수", "planner": "기획자 검수", "ux-writer": "UX라이터 검수",
            "designer": "디자이너 검수", "engineer": "Engineer 검수", "qa": "QA 검수"}
LIMIT = 540
CAP = 2


def reserve_path(reviews, stage):
    """다음 번호 파일을 O_EXCL로 먼저 만들어 자리를 잡는다 (동시 실행이 같은 번호를 잡지 않게)."""
    nums = [int(m.group(1)) for f in glob.glob(os.path.join(reviews, f"{stage}-*.md"))
            if (m := re.search(rf"{re.escape(stage)}-(\d+)\.md$", f))]
    n = (max(nums) + 1) if nums else 1
    while True:
        path = os.path.join(reviews, f"{stage}-{n:02d}.md")
        try:
            os.close(os.open(path, os.O_CREAT | os.O_EXCL | os.O_WRONLY)); return path
        except FileExistsError:
            n += 1


def config_reviewer():
    try:
        m = re.search(r"^reviewer:\s*(\w+)", open(os.path.join(CREW, "crew.config.md"), encoding="utf-8").read(), re.M)
        return m.group(1).lower() if m else "codex"
    except OSError:
        return "codex"


def emit(**kw):
    print(json.dumps(kw, ensure_ascii=False))


def parse_rollbacks(text):
    out = {}
    for part in filter(None, (text or "").split(",")):
        k, _, v = part.partition("=")
        out[k.strip()] = int(v or 0)
    return out


def build_prompt(a, rollbacks):
    lines = [
        "너는 Product AI Crew의 Reviewer다. 산출물을 고치지 말고 비평만 한다. 답은 한국어.",
        f"기준: {os.path.join(CREW, 'agents/reviewer/CLAUDE.md')}의 「공통 비평 원칙」과 「{HEADINGS[a.stage]}」 절을 읽고 통과 기준(DoD) 체크리스트로 써라.",
        "", "검수 대상:", *[f"- {os.path.abspath(t)}" for t in a.target],
    ]
    if a.ref:
        lines += ["", "근거 자료 (주장 · 결정이 이것과 맞는지 대조):", *[f"- {os.path.abspath(r)}" for r in a.ref]]
    if a.image:
        lines += ["", f"첨부 이미지 {len(a.image)}장 = 실제 화면 캡처. 스펙과 화면이 다른 곳을 짚어라."]
    lines += ["", f"회차: revision_count={a.revision}, 상류별 rollback 횟수={rollbacks or '없음'} (상한 각 {CAP}회)"]
    if a.prev:
        lines += [f"이전 검수: {os.path.abspath(a.prev)} — 지적한 것이 고쳐졌는지 먼저 확인하라."]
    if a.note:
        lines += ["", f"추가 지시: {a.note}"]
    lines += ["", "답 형식 (이 형식 그대로, 첫 줄은 verdict):", "```",
              "verdict: pass | revise | rollback | escalate",
              "review_notes:",
              "  - 잘된 점:",
              "  - 미달 기준: [기준 항목] — 무엇이 왜 약한지 — 어떻게 고칠지 (항목 단위)",
              "  - 남은 약점 (pass일 때):",
              "revise_target: (revise일 때)",
              "rollback_to: (rollback일 때만, 다음 중 하나: " + " | ".join(STAGES) + ")",
              "rollback_reason: (rollback일 때)",
              "escalate_reason: (escalate일 때)", "```"]
    return "\n".join(lines)


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--project", required=True)
    p.add_argument("--stage", required=True, choices=STAGES)
    p.add_argument("--target", action="extend", nargs="+", required=True)
    p.add_argument("--ref", action="extend", nargs="+", default=[])
    p.add_argument("--image", action="extend", nargs="+", default=[])
    p.add_argument("--revision", type=int, default=0)
    p.add_argument("--rollbacks", default="")
    p.add_argument("--prev")
    p.add_argument("--note")
    p.add_argument("--dry-run", action="store_true", help="Codex를 부르지 않고 프롬프트만 출력")
    a = p.parse_args()

    missing = [f for f in a.target + a.ref + a.image + ([a.prev] if a.prev else []) if not os.path.exists(f)]
    if missing:
        print("없는 파일: " + ", ".join(missing), file=sys.stderr); sys.exit(2)

    project = os.path.abspath(a.project)
    reviews = os.path.join(project, "reviews")
    rollbacks = parse_rollbacks(a.rollbacks)
    prompt = build_prompt(a, rollbacks)
    if a.dry_run:
        print(prompt); emit(review_file=None, dry_run=True); return

    home_codex = os.path.expanduser("~/.local/bin/codex")
    codex = shutil.which("codex") or (home_codex if os.path.exists(home_codex) else None)
    if config_reviewer() == "claude" or not codex:
        emit(verdict=None, review_file=None, model=None,
             error="crew.config.md reviewer: claude" if codex else "codex 미설치"); sys.exit(3)

    os.makedirs(reviews, exist_ok=True)
    out = reserve_path(reviews, a.stage)
    cmd = [codex, "exec", "-s", "read-only", "--skip-git-repo-check", "--ephemeral", "-C", project, "-o", out]
    for img in a.image:
        cmd += ["-i", os.path.abspath(img)]
    cmd.append(prompt)
    try:
        r = subprocess.run(cmd, capture_output=True, text=True, timeout=LIMIT, stdin=subprocess.DEVNULL)
        err = None if r.returncode == 0 else " / ".join((r.stderr or r.stdout).strip().splitlines()[-3:])
    except subprocess.TimeoutExpired:
        err = f"{LIMIT}초 초과"
    body = open(out, encoding="utf-8").read() if os.path.exists(out) else ""
    if err or not body.strip():
        if os.path.exists(out) and not body.strip():
            os.remove(out)  # 빈 자리는 지워 번호를 비워 둔다
        emit(verdict=None, review_file=None, model="codex", error=err or "빈 응답"); sys.exit(4)

    m = re.search(r"verdict:\s*\**\s*(pass|revise|rollback|escalate)\b", body, re.I)
    verdict = m.group(1).lower() if m else None
    format_ok = m is not None
    rollback_to = None
    if verdict == "rollback":
        t = re.search(r"^\s*rollback_to:[ \t]*`?([a-z-]+)`?[ \t]*$", body, re.M)
        rollback_to = t.group(1) if t and t.group(1) in STAGES else None
        if not rollback_to:
            format_ok = False  # 대상이 없거나 잘못되면 상한을 셀 수 없으니 형식 깨짐으로 본다

    capped = None
    if verdict == "revise" and a.revision >= CAP:
        capped = f"revise {a.revision}회 → 상한 {CAP}회라 escalate로 바꿈"
    elif verdict == "rollback" and rollback_to and rollbacks.get(rollback_to, 0) >= CAP:
        capped = f"{rollback_to}로 rollback {rollbacks[rollback_to]}회 → 상한 {CAP}회라 escalate로 바꿈"
    if capped:
        verdict = "escalate"

    head = [f"> 검수 모델: Codex · 단계: {a.stage} · revision_count={a.revision} · 대상: " + ", ".join(os.path.basename(t) for t in a.target)]
    if capped:
        head.append(f"> 상한 적용: {capped}")
    if not format_ok:
        head.append("> 형식 깨짐: verdict 또는 rollback_to를 읽지 못함")
    open(out, "w", encoding="utf-8").write("\n".join(head) + "\n\n" + body)

    emit(verdict=verdict if format_ok else None, review_file=out, model="codex",
         rollback_to=rollback_to, capped=capped, format_ok=format_ok)
    if not format_ok:
        sys.exit(5)


if __name__ == "__main__":
    main()
