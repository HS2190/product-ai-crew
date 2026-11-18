#!/usr/bin/env python3
"""회사(팀)판 ← 범용 코어 받아 오기. 회사판 레포 루트에서 실행한다.

    python3 scripts/sync-core.py <코어 레포 clone> [--dry-run] [--prev-rev <코어 커밋>]

- 코어(공개판)가 원본이다. 회사판은 코어 + 회사 전용 파일이다.
- 코어에서 git이 추적하는 파일을 회사판에 복사한다. 단 `crew.overlay`에 적힌 경로(회사 전용)는 건드리지 않는다.
- 코어에서 지워진 파일은 회사판에서도 지운다. 무엇이 코어 파일이었는지는 `.core-manifest`(지난번 받아 온 목록)로 판단한다.
  회사에만 있는 파일(회사 스킬 · 외부 스킬 등)은 목록에 없으므로 그대로 남는다.
- 처음 받을 때 `.core-manifest`가 없으면 `--prev-rev`(예전 코어 커밋)의 파일 목록을 지난번 목록으로 쓴다. 둘 다 없으면 지우기를 하지 않는다.
- 끝나면 스킬 인덱스 · 합본 instructions를 회사판 기준으로 다시 만든다.
"""
import fnmatch, os, shutil, subprocess, sys

DST = os.getcwd()
MANIFEST = os.path.join(DST, ".core-manifest")
OVERLAY = os.path.join(DST, "crew.overlay")
ALWAYS_KEEP = ["crew.overlay", ".core-manifest", ".git/*"]
GENERATED = ["skills/INDEX.md", "product-ai-crew-instructions.md"]  # 회사판 기준으로 다시 만든다


def git_files(repo, rev="HEAD"):
    out = subprocess.run(["git", "-C", repo, "ls-tree", "-r", "-z", "--name-only", rev], capture_output=True, check=True).stdout
    return set(filter(None, out.decode("utf-8").split("\0")))  # -z: 한글 · 중국어 파일 이름을 따옴표 없이 그대로


def overlay_patterns():
    pats = list(ALWAYS_KEEP)
    if os.path.exists(OVERLAY):
        for line in open(OVERLAY, encoding="utf-8"):
            line = line.split("#", 1)[0].strip()
            if line:
                pats.append(line)
    return pats


def kept(path, pats):
    """패턴: 'a/b/' · 'a/b/*' · 'a/b/**' = 그 폴더 아래 전부, 그 밖은 fnmatch (예: crew.config.md, skills/tlc-*)."""
    for p in pats:
        if p.endswith(("/", "/*", "/**")):
            base = p.rstrip("*").rstrip("/")
            if path == base or path.startswith(base + "/"):
                return True
            parts = path.split("/")  # 폴더 이름에 와일드카드가 있는 경우 (예: skills/tlc-*/)
            if fnmatch.fnmatch("/".join(parts[:base.count("/") + 1]), base):
                return True
        elif fnmatch.fnmatch(path, p):
            return True
    return False


def main():
    args = sys.argv[1:]
    if not args or args[0].startswith("-"):
        print(__doc__); sys.exit(2)
    core = os.path.abspath(args[0]); dry = "--dry-run" in args
    prev_rev = args[args.index("--prev-rev") + 1] if "--prev-rev" in args else None
    if not os.path.isdir(os.path.join(core, ".git")):
        sys.exit(f"코어 clone이 아님: {core}")
    if os.path.abspath(core) == DST:
        sys.exit("코어 폴더 안에서 실행했다. 회사판 레포 루트에서 실행할 것")

    pats = overlay_patterns()
    new = {f for f in git_files(core) if not kept(f, pats) and f not in GENERATED}
    if os.path.exists(MANIFEST):
        prev = set(filter(None, open(MANIFEST, encoding="utf-8").read().splitlines()))
    elif prev_rev:
        prev = git_files(core, prev_rev)
    else:
        prev = set()
    remove = sorted(f for f in prev - new if not kept(f, pats) and f not in GENERATED and os.path.lexists(os.path.join(DST, f)))

    changed, added = [], []
    for f in sorted(new):
        src, dst = os.path.join(core, f), os.path.join(DST, f)
        if os.path.islink(src):
            continue
        if os.path.exists(dst):
            if open(src, "rb").read() == open(dst, "rb").read():
                continue
            changed.append(f)
        else:
            added.append(f)
        if not dry:
            os.makedirs(os.path.dirname(dst) or ".", exist_ok=True)
            shutil.copy2(src, dst)
    if not dry:
        for f in remove:
            os.remove(os.path.join(DST, f))
        open(MANIFEST, "w", encoding="utf-8").write("\n".join(sorted(new)) + "\n")
        for script in ("scripts/build-skill-index.py", "scripts/build-instructions.py"):
            if os.path.exists(os.path.join(DST, script)):
                subprocess.run([sys.executable, script], cwd=DST, check=False)

    core_rev = subprocess.run(["git", "-C", core, "rev-parse", "--short", "HEAD"], capture_output=True, text=True).stdout.strip()
    print(f"{'(미리보기) ' if dry else ''}코어 {core_rev} → {DST}")
    print(f"  바뀜 {len(changed)} · 새로 {len(added)} · 지움 {len(remove)} · 회사 전용으로 지킨 패턴 {len(pats) - len(ALWAYS_KEEP)}개")
    for label, items in (("지움", remove), ("새로", added)):
        for f in items[:40]:
            print(f"  {label}: {f}")


if __name__ == "__main__":
    main()
