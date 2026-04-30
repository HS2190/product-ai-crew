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

# skills 심링크
echo "[1/3] skills 심링크 설정..."
rm -rf "$HOME/.claude/skills"
ln -s "$REPO_DIR/skills" "$HOME/.claude/skills"
echo "  ✓ ~/.claude/skills → $REPO_DIR/skills"

# .agents/skills 심링크 (있는 경우)
if [ -d "$HOME/.agents" ]; then
  rm -rf "$HOME/.agents/skills"
  ln -s "$REPO_DIR/skills" "$HOME/.agents/skills"
  echo "  ✓ ~/.agents/skills → $REPO_DIR/skills"
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
echo "  \"위페어 파트너스 차량 입고 등록 기능 전체 프로세스 진행해줘\""
