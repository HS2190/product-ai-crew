# 컴포넌트 스펙 — AOS 연동 UI

**화면**: SCR-MAIN-001 작업목록  
**작성일**: 2026-04-24  
**피그마**: [화면 디자인 페이지](https://www.figma.com/design/re1GhaBWR1sfVwBu7ngfjT/AOS-%EA%B8%B0%ED%9A%8D?node-id=36-111)  
**기준 디자인 토큰**: fill `#F9FAFB` | border `#E5E7EB` | radius `12px` | font `Pretendard`

---

## 1. Btn_AOS_Sync

### 개요

| 항목 | 값 |
|---|---|
| 컴포넌트명 | Btn_AOS_Sync |
| 크기 | 46 × 46 px |
| 배치 | Row_Filter_Tools 내 `↕ 입고일` 버튼과 검색창 사이 |
| 기본 스타일 | fill `#F9FAFB` · border 1px `#E5E7EB` · radius `12px` |

### Row_Filter_Tools 레이아웃 변경

```
[↕ 입고일  118px] [Btn_AOS_Sync  46px] [검색창  185px  ✕]
```

- 검색창(`Input_Search_Job`) 너비: 245px → **185px** 축소

### 상태별 스펙

| 상태 | 아이콘 | 아이콘 색상 | 테두리 | 인터랙션 |
|---|---|---|---|---|
| Default | sync | `#9CA3AF` (gray) | 1px `#E5E7EB` | 탭 가능 |
| Loading | spinner (회전) | `#9CA3AF` (gray) | 1px `#E5E7EB` | disabled (탭 불가) |
| Success | check (✓) | `#00C853` (green) | 1px `#E5E7EB` | enabled · 2초 후 Default 복귀 |
| Error | sync | `#E53935` (red) | 1px `#FFCDD2` (red-100) | 탭 가능 (재시도) |

### 상태 전환 플로우

```
Default → [탭] → Loading → [성공] → Success → [2초] → Default
                          → [실패] → Error   → [탭]  → Loading (재시도)
```

### 아이콘 사양

| 상태 | Material Icon | 크기 | 색상 |
|---|---|---|---|
| Default | `sync` | 20 × 20 px | `#9CA3AF` |
| Loading | `sync` + rotate animation (360°, 1s linear infinite) | 20 × 20 px | `#9CA3AF` |
| Success | `check` | 20 × 20 px | `#00C853` |
| Error | `sync` | 20 × 20 px | `#E53935` |

---

## 2. 토스트 메시지

### 공통 스타일

| 항목 | 값 |
|---|---|
| 배경색 | `#1A1A1A` |
| 텍스트색 | `#FFFFFF` |
| 폰트 | Pretendard Medium 13sp |
| 모서리 반경 | 8px |
| 수평 패딩 | 16px |
| 수직 패딩 | 12px |
| 위치 | 하단 탭바 위 16px (bottom: 72px) |

### 7가지 상황별 토스트

#### 자동 반영 (앱 포그라운드 진입 시 자동 실행)

| 상황 | 메시지 | 표시 시간 | 색상 태그 |
|---|---|---|---|
| 자동 성공 | N건의 입고 데이터를 불러왔어요 | 3초 | green |
| 자동 실패 | AOS 연동에 실패했어요. 수동으로 불러와 주세요 | 4초 | red |

#### 수동 불러오기 (Btn_AOS_Sync 탭 후)

| 상황 | 메시지 | 표시 시간 | 색상 태그 |
|---|---|---|---|
| 수동 성공 | N건의 입고 데이터를 불러왔어요 | 3초 | green |
| 새 데이터 없음 | 새로 불러올 입고 데이터가 없어요 | 3초 | blue |
| 권한 없음 | AOS 폴더에 접근할 수 없어요. 권한을 확인해 주세요 | 4초 | orange |
| 네트워크 오류 | 네트워크 연결을 확인해 주세요 | 3초 | red |
| 일부 실패 | N건 중 M건 불러오기에 실패했어요 | 4초 | orange |

### 색상 태그별 accent bar 색상

| 태그 | Hex |
|---|---|
| green | `#00C853` |
| red | `#E53935` |
| blue | `#2563EB` |
| orange | `#EA580C` |

> 토스트 좌측 3px accent bar로 상황 유형 시각적 구분

---

## 3. AOS 연동 배지

### 스펙

| 항목 | 값 |
|---|---|
| 텍스트 | "AOS" |
| 폰트 | Pretendard Bold 10sp |
| 높이 | 20px (고정) |
| 배경색 | `#FFFFFF` |
| 텍스트 색상 | `#0F1012` |
| 테두리 | 1px solid `#E5E7EB` |
| 모서리 반경 | 4px |
| 수평 패딩 | 6px |

### 배치 옵션

**A. 카드 배지 Row 맨 끝 (권장)**
```
[비보험] [결제요청] [AOS]
```
기존 badge row의 맨 끝에 추가

**B. 차량번호 옆 (대안)**
```
133마9232  [AOS]
BMW5
```
차량번호 텍스트 오른쪽에 인라인 배치

### 의미

AOS 폴더에서 자동 반영(`자동 반영` 기능)된 입고 데이터임을 표시. 수동 입고 등록 건과 시각적으로 구분.

---

## 4. 컴포넌트 배치 가이드

| 위치 | 상세 |
|---|---|
| Row_Filter_Tools | `[↕ 입고일 118px]` `[Btn_AOS_Sync 46px]` `[검색창 185px ✕]` |
| 토스트 | bottom: 72px (탭바 56px + 여백 16px) |
| AOS 배지 A | 카드 내 badge row 맨 끝 |
| AOS 배지 B | 차량번호 오른쪽 인라인 |

---

## 5. 디자인 QA 체크리스트

| 항목 | 확인 | 비고 |
|---|---|---|
| Btn_AOS_Sync 4개 상태 피그마 반영 | ✅ | 화면 디자인 페이지 |
| 토스트 7종 피그마 반영 | ✅ | 화면 디자인 페이지 |
| AOS 배지 2개 컨텍스트 피그마 반영 | ✅ | 화면 디자인 페이지 |
| 기존 버튼 스타일 일관성 유지 | ✅ | fill/stroke/radius 동일 |
| 검색창 너비 축소 명시 | ✅ | 245px → 185px |
| 작업자 환경 고려 (최성호) | ✅ | Error 상태 빨간 tint 명확 |
| 관리자 환경 고려 (박정훈) | ✅ | 토스트 메시지 명확한 행동 유도 |
| 접근성 — 색상 외 형태 구분 | ✅ | 아이콘 형태 + accent bar 병행 |
| 반응형 처리 | ⬜ | 현재 단일 해상도 기준 |
| 다크모드 처리 | ⬜ | 차후 대응 필요 |

---

## 관련 문서

### 작성 역할 및 구조
- [[project/_roles/designer/CLAUDE|프로덕트 디자이너 가이드]] — 이 문서를 작성한 역할의 작업 원칙 및 스펙 형식
- [[project/SETUP|전체 프로젝트 구조 안내]] — 디자이너 산출물 저장 위치 및 협업 흐름

### 페르소나 기반
- [[project/wepair/persona|위페어 파트너스 페르소나]] — 관리자(박정훈)·작업자(최성호) 환경 고려사항 반영

### 연관 스킬
- [[skills/stitch-design/SKILL|stitch-design]] — 화면 생성에 활용된 Stitch MCP 스킬
- [[skills/react-components/SKILL|react-components]] — 이 스펙을 기반으로 React 컴포넌트 구현 시 참조
