#!/bin/bash
# Product AI Crew — 로컬 설치 스크립트
# Claude Code의 skills, plugins를 이 레포로 심링크 연결

set -e

REPO_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "Product AI Crew 설치를 시작합니다..."
echo "레포 경로: $REPO_DIR"
echo ""

# ~/.claude 디렉토리 확인
if [ ! -d "$HOME/.claude" ]; then
  echo "오류: ~/.claude 디렉토리가 없습니다. Claude Code가 설치되어 있는지 확인해 주세요."
  exit 1
fi

# skills 안전 병합
# 기존 스킬을 절대 삭제하지 않는다. 레포의 각 스킬을 개별 심링크로 추가하되,
# 같은 이름이 이미 있으면 기존 것을 보존하고 건너뛴다.
# (구버전 install.sh가 만든, 레포 루트로 향하던 통째 심링크는 정리한다.)
merge_skills() {
  local dest="$1"
  mkdir -p "$dest"

  # 구버전이 dest 자체를 레포 skills로 심링크해둔 경우 → 실제 디렉토리로 복원
  if [ -L "$dest" ]; then
    rm "$dest"
    mkdir -p "$dest"
    echo "  ↺ 기존 통째 심링크 해제 → 디렉토리로 복원: $dest"
  fi

  local added=0 skipped=0
  for d in "$REPO_DIR"/skills/*/; do
    [ -d "$d" ] || continue
    local name target
    name="$(basename "$d")"
    target="${d%/}"
    if [ -e "$dest/$name" ] || [ -L "$dest/$name" ]; then
      # 깨졌거나(존재X) 같은 레포를 가리키는 잘못된 링크면 교체, 아니면 보존
      if [ -L "$dest/$name" ] && [ ! -e "$dest/$name" ]; then
        rm "$dest/$name"; ln -s "$target" "$dest/$name"
        echo "  ✓ (깨진 링크 교체) $name"; added=$((added+1))
      else
        skipped=$((skipped+1))
      fi
    else
      ln -s "$target" "$dest/$name"
      echo "  ✓ $name"; added=$((added+1))
    fi
  done
  echo "  → $dest : 추가 $added / 보존(건너뜀) $skipped"
}

echo "[1/3] skills 안전 병합..."
merge_skills "$HOME/.claude/skills"
if [ -d "$HOME/.agents" ]; then
  merge_skills "$HOME/.agents/skills"
fi

# plugins 심링크
echo "[2/3] plugins 심링크 설정..."
mkdir -p "$HOME/.claude/plugins"
for plugin in design figma frontend-design frontend-design-audit; do
  if [ -d "$REPO_DIR/plugins/$plugin" ]; then
    rm -rf "$HOME/.claude/plugins/$plugin"
    ln -s "$REPO_DIR/plugins/$plugin" "$HOME/.claude/plugins/$plugin"
    echo "  ✓ ~/.claude/plugins/$plugin → $REPO_DIR/plugins/$plugin"
  fi
done

# workspace 폴더 생성
echo "[3/3] workspace 폴더 초기화..."
mkdir -p "$REPO_DIR/workspace"
echo "  ✓ workspace/ 폴더 준비 완료"

echo ""
echo "설치 완료! Claude Code에서 이 폴더를 열어 사용하세요."
echo ""
echo "사용 방법:"
echo "  claude (이 레포 루트에서 실행)"
echo ""
echo "에이전트 호출 예시:"
echo "  \"[서비스명] [기능명] 전체 프로세스 진행해줘\""
