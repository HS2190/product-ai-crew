# 구현 워크플로우 (BUILD)

- **순서**: 0 → 6 Engineer (스펙이 부족하면 디자이너를 붙여 0 → 5a → 5 → 5b → 6. CLAUDE.md 실행 모드)
- **사용 상황**: 디자인 스펙 · 컴포넌트 스펙 · 문구가 이미 있고 동작하는 프론트엔드 코드만 필요할 때
- 순서 · 필드 · 게이트 · 상한 · 검수 처리는 `CLAUDE.md` 「단계 계약표」 · 「검수」가 정본이다. 이 문서는 산출물과 완료 조건만 적는다.

```
"디자인 스펙 있어, 코드로 구현만 해줘."
"[Figma URL] 이 디자인 그대로 동작하는 코드로 구현해줘."  (Figma 화면은 메인 세션이 캡처해 `shots_dir`로 넘김)
```

**선행 조건** (0단계에서 확인)
- [ ] 디자인 스펙 / 컴포넌트 스펙 파일. Figma URL만 있으면 메인 세션이 화면을 `[프로젝트]/_shots/engineer/`에 캡처해 `shots_dir`로 넘기고, 스펙이 없거나 부실하면 디자이너 단계(또는 DESIGN 모드)를 먼저 제안한다
- [ ] 화면 문구(`copy_sheet`). 없으면 스펙 내 문구를 쓰거나 사용자에게 확인
- [ ] 대상 플랫폼 (`mobile` / `web` / `both`) · 기술 스택 (없으면 React + Vite + TypeScript)

### 6 Engineer (`agents/engineer/CLAUDE.md`)

**입력**: `task` · `service_name` · `feature_name` · `design_spec` · `component_spec` · `copy_sheet`(있을 때) · `shots_dir`(있을 때) · `platform` · `tech_stack` · `design_system` · (사용자가 버그 수정을 요청한 재작업일 때) `bug_report`

| 산출물 | 경로 |
|-------|------|
| 구현 코드 (빌드/실행 가능, 데이터는 mock/정적) | `engineer/` |
| build_status | pass (fail이면 blocked로 반환) |
| run_command | 미리보기를 띄울 명령 (메인 세션이 띄움) |
| implementation_notes | 스펙 대비 차이 · 결정 사항 |

**완료 조건**
- [ ] 빌드 통과 (타입 · 린트 에러 0)
- [ ] 디자인 스펙 · 컴포넌트 스펙 · 문구 반영
- [ ] 접근성 반영 (색 외 단서 · 대비 · 키보드 접근)
- [ ] design_spec · 캡처와 대조해 스펙 일치 자가 확인 (스크린샷은 도구가 있을 때만)
- [ ] `run_command` 제출

**검수**: `--stage engineer` (대상 `code_path` + 빌드 로그), revise면 재작업 뒤 다시 게이트 · 검수 · rollback → designer (디자이너 단계를 붙였을 때. 아니면 스펙 문제를 사용자에게 escalate)

## 전체 완료 조건

- [ ] Engineer 구현 완료 (빌드 통과, 스펙 · 문구 · 접근성 반영)
- [ ] 검수 `pass` (또는 escalate 시 사용자 판단 완료)
- [ ] 메인 세션이 `run_command`로 미리보기를 띄워 주소와 함께 `CLAUDE.md` 「완료 보고」

스펙이 없거나 새 화면 설계부터 필요하면 DESIGN(`workflows/quick-design.md`) 또는 FULL로 실행한다. 백엔드 · DB · API는 범위 밖이다.
