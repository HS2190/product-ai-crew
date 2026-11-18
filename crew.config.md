# 크루 설정 (설치마다 다른 값)

오케스트레이터와 모든 에이전트는 작업 시작 시 이 파일을 읽는다. 문서에 나오는 `[프로젝트]`는 `{projects_root}/[서비스명]` 폴더를 뜻한다.
회사(팀)용으로 쓸 때는 이 파일만 바꾼다. 에이전트 · 워크플로우 문서는 고치지 않는다.

```yaml
projects_root: workspace        # 작업물 위치 (이 레포 기준 상대경로). 별도 레포에 둘 거면 예: ../my-design-docs/projects
default_company:                # 비어 있으면 작업 시작 시 한 번 묻는다. 개인 작업은 personal
reviewer: codex                 # codex | claude. codex가 없으면 자동으로 claude(같은 모델 검수 표시)
```

## 회사 전용 내용을 넣는 곳

- 톤 · 디자인 규칙 · 기술 제약 · 고정 디자인 시스템 · 핸드오프 규칙: `workspace/_memory/companies/[회사명]/conventions.md`
- 회사 디자인 시스템 · 핸드오프 스킬: `skills/[회사-DS]/`
- 프로젝트마다 다른 디자인 시스템: `[프로젝트]/session.md`의 `design_system:`
