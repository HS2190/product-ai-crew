#!/usr/bin/env python3
"""크루 프로젝트 상태판 — 모든 [프로젝트]/session*.md를 한 표로 보여 준다.

    python3 scripts/status.py [--all]

- 기본: 끝나지 않은 세션(in_progress · paused)만. --all이면 complete · handed_off까지.
- 작업물 위치는 crew.config.md의 projects_root (하위 폴더 한 단계까지 찾음: 예 drsolution/admin).
"""
import glob, os, re, sys

CREW = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def projects_root():
    try:
        m = re.search(r"^projects_root:\s*(\S+)", open(os.path.join(CREW, "crew.config.md"), encoding="utf-8").read(), re.M)
        root = m.group(1) if m else "workspace"
    except OSError:
        root = "workspace"
    return os.path.normpath(os.path.join(CREW, root))


def field(text, key):
    m = re.search(rf"^{key}:\s*(.*)$", text, re.M)
    return m.group(1).strip() if m else ""


def main():
    show_all = "--all" in sys.argv
    root = projects_root()
    files = sorted(set(glob.glob(os.path.join(root, "*", "session*.md")) + glob.glob(os.path.join(root, "*", "*", "session*.md"))))
    rows = []
    for f in files:
        if "_memory" in f or os.path.basename(f).startswith("session-template"):
            continue
        t = open(f, encoding="utf-8").read()
        status_full = field(t, "status")
        status = status_full.split()[0] if status_full else "?"
        if not show_all and status in ("complete", "handed_off"):
            continue
        reason = status_full.split("#", 1)[1].strip() if "#" in status_full else ""
        rows.append((
            os.path.relpath(f, root), field(t, "feature") or "-", field(t, "mode") or "-", status,
            field(t, "updated_at") or "-",
            (field(t, "next_step") + " " + field(t, "next_agent")).strip() or "-",
            field(t, "waiting_for") or reason or "-",
        ))
    print(f"작업물 위치: {root}")
    if not rows:
        print("진행 중인 세션 없음" + ("" if show_all else " (끝난 것까지 보려면 --all)"))
        return
    head = ("세션 파일", "기능", "모드", "상태", "갱신", "다음", "기다리는 것 · 사유")
    print("| " + " | ".join(head) + " |")
    print("|" + "|".join("---" for _ in head) + "|")
    for r in rows:
        print("| " + " | ".join(c.replace("|", "/")[:60] for c in r) + " |")


if __name__ == "__main__":
    main()
