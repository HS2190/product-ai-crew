#!/usr/bin/env bash
# banana 스킬 ↔ Google AI API 키 연결 스크립트
# 사용법: bash skills/banana/connect-api.sh
# 키 발급: https://aistudio.google.com/apikey (무료 티어 있음)
set -euo pipefail

MCP_NAME="nanobanana-mcp"
MCP_PACKAGE="@ycse/nanobanana-mcp"
MODEL="gemini-3.1-flash-image-preview"

echo "── banana 스킬 API 연결"
echo "키 발급: https://aistudio.google.com/apikey"
echo ""
# -s: 입력이 화면·히스토리에 남지 않음
read -rsp "Google AI API 키 붙여넣기 (입력 안 보임, Enter로 확정): " API_KEY
echo ""

if [ -z "${API_KEY}" ]; then
  echo "✗ 키가 비어 있어요. 다시 실행해주세요."
  exit 1
fi

# 기존 등록이 있으면 교체
claude mcp remove "${MCP_NAME}" --scope user >/dev/null 2>&1 || true

claude mcp add "${MCP_NAME}" --scope user \
  --env GOOGLE_AI_API_KEY="${API_KEY}" \
  --env NANOBANANA_MODEL="${MODEL}" \
  -- npx -y "${MCP_PACKAGE}"

echo ""
echo "✓ MCP 서버 '${MCP_NAME}' 등록 완료 (user 스코프 — 모든 프로젝트에서 사용 가능)"
echo "  모델: ${MODEL}"
echo "  생성 이미지 저장 위치: ~/Documents/nanobanana_generated/"
echo ""
echo "── 연결 확인 (Google API 실제 호출)"
if curl -sf -o /dev/null -w "%{http_code}" \
  "https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}" | grep -q 200; then
  echo "✓ API 키 유효 — Google AI 응답 정상"
else
  echo "⚠ API 호출 실패 — 키가 잘못됐거나 아직 활성화 전일 수 있어요."
  echo "  https://aistudio.google.com/apikey 에서 키 상태를 확인해주세요."
fi

echo ""
echo "마지막 단계: Claude Code를 재시작하면 /banana 명령을 쓸 수 있어요."
