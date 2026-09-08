#!/usr/bin/env python3
"""skills/ · plugins/ 를 훑어 skills/INDEX.md 를 생성한다.

CLAUDE.md는 스킬 본문 전체(1.2MB)를 스캔하는 대신 이 인덱스만 읽는다.
스킬을 추가·삭제한 뒤 다시 실행하면 인덱스가 갱신된다.

    python3 scripts/build-skill-index.py
"""
import io, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "skills", "INDEX.md")

# 카테고리: (표시명, 경로 접두사 또는 None=최상위)
GROUPS = [
    ("웹 디자인 스타일", "skills/web-design/"),
    ("UI · 프론트엔드", "skills/ui/"),
    ("최상위", None),
    ("다른 스킬에 포함된 하위 스킬", "NESTED"),
]


def read_front(path):
    """SKILL.md의 name·description을 뽑는다. 실패하면 (None, '')."""
    try:
        txt = io.open(path, encoding="utf-8", errors="replace").read(8000)
    except OSError:
        return None, ""
    m = re.match(r"^---\s*\n(.*?)\n---", txt, re.S)
    if not m:
        return None, ""
    fm = m.group(1)
    nm = re.search(r"^name:\s*(.+)$", fm, re.M)
    ds = re.search(r"^description:\s*(.+?)(?=\n[a-z_-]+:|\Z)", fm, re.M | re.S)
    name = nm.group(1).strip().strip("\"'") if nm else None
    desc = " ".join(ds.group(1).split()) if ds else ""
    return name, desc


def one_line(desc, limit=160):
    """인덱스용으로 한 줄로 줄인다. 첫 문장 우선, 넘치면 자른다."""
    desc = desc.strip().strip("|")
    first = re.split(r"(?<=[.。])\s+", desc)[0] if desc else ""
    s = first if 0 < len(first) <= limit else desc
    return (s[: limit - 1] + "…") if len(s) > limit else s


def find_skills(top):
    """top 아래의 모든 SKILL.md 경로(저장소 상대)를 찾는다.

    glob의 `**`는 숨김 디렉터리(.claude 등)를 건너뛴다 — 그래서 os.walk를 쓴다.
    node_modules와 .git만 명시적으로 제외한다.
    """
    out = []
    for dirpath, dirnames, filenames in os.walk(os.path.join(ROOT, top)):
        dirnames[:] = [d for d in dirnames if d not in ("node_modules", ".git")]
        if "SKILL.md" in filenames:
            out.append(os.path.relpath(os.path.join(dirpath, "SKILL.md"), ROOT))
    return sorted(out)


def collect():
    rows = []
    for rel in find_skills("skills"):
        d = os.path.dirname(rel)
        folder = os.path.basename(d)
        name, desc = read_front(os.path.join(ROOT, rel))
        # 다른 스킬 패키지 안에 중첩된 스킬은 부모를 표시한다
        parts = d.split(os.sep)
        nested = parts[1] if ".claude" in parts else None
        rows.append({"folder": folder, "name": name or folder,
                     "desc": one_line(desc), "path": d, "nested": nested,
                     "mismatch": bool(name and name != folder)})
    for rel in find_skills("plugins"):
        d = os.path.dirname(rel)
        name, desc = read_front(os.path.join(ROOT, rel))
        rows.append({"folder": os.path.basename(d), "name": name or os.path.basename(d),
                     "desc": one_line(desc), "path": d,
                     "plugin": rel.split(os.sep)[1], "mismatch": False})
    return rows


def registered():
    """~/.claude/skills 에 등록되어 자동 로드되는 이름 집합."""
    p = os.path.expanduser("~/.claude/skills")
    try:
        return {n for n in os.listdir(p) if not n.startswith(".")}
    except OSError:
        return set()


def main():
    rows = collect()
    reg = registered()
    skills = [r for r in rows if "plugin" not in r]
    plugins = [r for r in rows if "plugin" in r]

    buf = []
    w = buf.append
    w("# 스킬 인덱스\n")
    w("> 이 파일은 `scripts/build-skill-index.py`가 생성한다. 직접 수정하지 말 것.\n")
    w(f"> 스킬 {len(skills)}개 · 플러그인 스킬 {len(plugins)}개\n")
    w("\n스킬을 고를 때는 이 인덱스에서 후보를 좁힌 뒤 **선택한 스킬의 SKILL.md만** 연다.\n")
    w("`자동`은 `~/.claude/skills`에 등록되어 설명 매칭으로 저절로 뜨는 스킬이다. "
      "나머지는 경로를 열어 직접 적용한다.\n")

    for title, prefix in GROUPS:
        if prefix == "NESTED":
            group = [r for r in skills if r.get("nested")]
        elif prefix is None:
            group = [r for r in skills
                     if r["path"].count("/") == 1 and not r.get("nested")]
        else:
            group = [r for r in skills
                     if r["path"].startswith(prefix) and not r.get("nested")]
        if not group:
            continue
        w(f"\n## {title} ({len(group)}개)\n")
        if prefix == "NESTED":
            w("> 다른 스킬 패키지 안에 들어 있어 단독으로 등록되지 않는다. "
              "부모 스킬을 통해 쓰거나 경로를 직접 연다.\n")
            w("| 스킬 | 부모 | 설명 | 경로 |")
            w("|---|---|---|---|")
            for r in sorted(group, key=lambda x: (x["nested"], x["folder"])):
                w(f"| **{r['folder']}** | `{r['nested']}` | {r['desc']} | `{r['path']}` |")
            continue
        w("| 스킬 | 설명 | 자동 | 경로 |")
        w("|---|---|:--:|---|")
        for r in sorted(group, key=lambda x: x["folder"]):
            auto = "●" if r["folder"] in reg else ""
            note = f" ⚠️`name: {r['name']}`" if r["mismatch"] else ""
            w(f"| **{r['folder']}**{note} | {r['desc']} | {auto} | `{r['path']}` |")

    if plugins:
        w(f"\n## 플러그인 스킬 ({len(plugins)}개)\n")
        w("| 스킬 | 플러그인 | 설명 |")
        w("|---|---|---|")
        for r in sorted(plugins, key=lambda x: (x["plugin"], x["folder"])):
            w(f"| **{r['folder']}** | `{r['plugin']}` | {r['desc']} |")

    new = "\n".join(buf) + "\n"
    try:
        old = io.open(OUT, encoding="utf-8").read()
    except OSError:
        old = None
    quiet = "--quiet" in sys.argv
    if old == new:
        if not quiet:
            print(f"변경 없음: {os.path.relpath(OUT, ROOT)}")
        return
    io.open(OUT, "w", encoding="utf-8").write(new)
    auto = sum(1 for r in skills if r["folder"] in reg)
    print(f"인덱스 갱신: 스킬 {len(skills)}개(자동 {auto}) · 플러그인 {len(plugins)}개")


if __name__ == "__main__":
    main()
