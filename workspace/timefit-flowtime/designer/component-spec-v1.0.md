# 컴포넌트 스펙 — 다인원 회의 일정 조율 (timefit-flowtime)

service: timefit-flowtime
version: v1.0
author: 디자이너 (CREW mode)
date: 2026-06-29
status: complete

> 디자인 토큰·화면 레드라인 정본은 `design-spec-v1.0.md`. 본 문서는 **컴포넌트별 상세 스펙**(목적 → 사용 조건 → 상태 → Props → 사용 예) 정본이다.
> 모든 색·간격·라운드는 `design-spec-v1.0.md §1` 토큰을 참조한다. Engineer는 토큰을 1:1 매핑한다.
> 라벨 문구는 UX라이터 확정 전 placeholder다(open_question §맨 아래).

각 컴포넌트는 다음 상태를 빠짐없이 정의한다: **default / hover / active(pressed/selected) / focus / disabled / error / empty**(해당하는 경우).

---

## 1. IntensityChipGroup (강도 입력) ★핵심

- **목적**: 한 슬롯에 대한 선호 강도를 칩 1탭으로 입력. `IntensityScale` 배열을 순회해 칩을 렌더(단계 수 가변).
- **사용 조건**: SCR-MOB-RESP-001 각 SlotCard 내부. 단계 수 = `scale.length`(3 또는 4).
- **구성**: `scale.map(item => <IntensityChip>)` — 절대 고정 그리드 아님. 가로 wrap, 칩 간 8px, 칩 높이 48px.

### 상태 (개별 IntensityChip)

| 상태 | 시각 스펙 |
|------|----------|
| default(미선택) | 배경 `--c-surface`, 보더 1px `--c-hairline`, 텍스트 `--c-ink-soft`, 형태 부호(shape) 외곽선만. radius `--r-sm`. |
| hover(desktop) | 보더 `--c-ink-mute`, 배경 미세 톤(`--c-surface-sunken`). motion-fast. (모바일 무시) |
| active=selected | 배경 = 해당 강도 `fill` 토큰(§1.2), 텍스트 = 해당 `text` 토큰, 형태 부호 채움, 좌측 체크/형태 아이콘 강조. 보더 = fill보다 1단계 진한 색. |
| focus | selected/default 위에 `--border-focus` 링. |
| disabled | 배경 `--s-disabled-bg`, 텍스트 `--s-disabled-ink`, 탭 불가(마감 후). |
| error | 칩 자체 에러 없음(입력 실패는 SlotCard/Toast 레벨). |
| empty | 그룹 전체 미선택 = 슬롯 "무응답"(유효 상태, 강요 안 함). |

> ★ **부정 강도 칩(avoid/hard-no)도 위 default→selected 규칙을 동일 적용**한다. 빨강·경고·확인창·진동 없음(PRD §8.2). selected 색은 §1.2의 토프/무채 색.

### Props

| 속성 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `scale` | `IntensityItem[]` | (필수) | 강도 척도 배열(SSOT). 3 또는 4 length. |
| `value` | `string \| null` | `null` | 선택된 강도 id. null=무응답. |
| `onChange` | `(id \| null) => void` | (필수) | 칩 탭 시. 같은 id 재탭 → null(해제). |
| `disabled` | `boolean` | `false` | 마감 후 등. |
| `size` | `'md' \| 'lg'` | `lg` | lg=48px(모바일 권장). |

`IntensityItem` = `{ id, label, order, polarity, token, weight, ariaLabel, shape }`(screen-plan §0.1).

### 사용 예
```
<IntensityChipGroup scale={intensityScale} value="avoid" onChange={setSlotValue('slot-3')} />
// 4단계: ●선호 ◐가능 ◇회피 ✕불가 / 3단계: ●선호 ◐가능 ✕불가 (배열만 교체)
```

---

## 2. RoleBadge

- **목적**: 참석자/슬롯의 역할(필수/선택)을 색+라벨+아이콘으로 표시.
- **사용 조건**: SCR-MOB-RESP-000 게이트, 대시보드 참석자/집계.

### 상태

| 상태 | 시각 스펙 |
|------|----------|
| required | 배경 `--c-brand-soft`, 텍스트 `--c-brand-strong`, 아이콘 ★(채움), 라벨 "필수 참석자", radius `--r-full`, 패딩 4×10. |
| optional | 배경 `--c-surface-sunken`, 텍스트 `--c-ink-soft`, 아이콘 ◯(외곽선), 라벨 "선택 참석자". |
| unspecified | optional과 동일 시각(보수적), 라벨 "참석자". |
| (hover/active/disabled/error 해당 없음 — 비대화형 라벨) | — |

### Props
| 속성 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `role` | `'required' \| 'optional' \| 'unspecified'` | `unspecified` | 역할 |
| `size` | `'sm' \| 'md'` | `md` | |

---

## 3. ReassuranceBanner (안심 메시지)

- **목적**: 선택 참석자에게 "빠져도 된다"는 안심을 첫 화면에서 강조(FR-003, 우민지 Pain 직접 해소).
- **사용 조건**: SCR-MOB-RESP-000(강조), -001 진입 시. `role=optional`일 때 강조, required면 약하게/생략.

### 상태
| 상태 | 시각 스펙 |
|------|----------|
| emphasized(optional) | 배경 `--c-brand-soft`, 좌측 아이콘 🤍 24px, 텍스트 `--c-ink`(--t-body), radius `--r-md`, 패딩 16. 따뜻한 청록 톤(경고색 절대 아님). |
| subtle(required) | 인라인 caption 한 줄 또는 미노출. |
| (default/hover/active/disabled/error 해당 없음 — 정보 배너) | — |

### Props
| 속성 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `variant` | `'emphasized' \| 'subtle'` | `emphasized` | role에 따라 결정 |
| `message` | `string` | (UX라이터) | 안심 카피 |

---

## 4. PrivacyNotice (비공개 고지 — persistent)

- **목적**: 선택 참석자에게 "내 응답은 비공개"를 *지속적으로* 체감시킨다(NFR-002). 디자인의 비공개 체감 핵심 장치(§2.4 (6)).
- **사용 조건**: 선택 참석자 동선 전반. SCR-MOB-RESP-000(고지 블록), -001(상단 상주 + 하단 바 은은), -002(완료 재확인).

### 상태/변형
| 상태(variant) | 시각 스펙 |
|------|----------|
| block(고지) | 배경 `--c-brand-soft`, 자물쇠 🔒 아이콘 `--s-info` 20px, 텍스트 `--t-caption` `--c-ink-soft`, radius `--r-sm`, 패딩 12×16. (RESP-000) |
| persistent-top | RESP-001 상단 상주. block과 동일하나 sticky, 그림자 없음(은은). |
| persistent-bar | 하단 고정 바 좌측 "🔒 비공개" 라벨(caption), 시각 방해 최소. |
| reconfirm | RESP-002 완료 시 "비공개로 안전하게 전달됐어요" 텍스트. |
| (hover/active/disabled/error 해당 없음) | — |

### Props
| 속성 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `variant` | `'block' \| 'persistent-top' \| 'persistent-bar' \| 'reconfirm'` | `block` | 노출 맥락 |
| `visible` | `boolean` | `true`(optional) | required면 false(미노출) |

---

## 5. SlotCard

- **목적**: 후보 슬롯 1개 = 날짜·시간 + (참석자 화면)강도 입력 / (주최자 화면)집계 표시.
- **사용 조건**: RESP-001(입력형), DASH-001(집계형). variant로 분기.

### 상태 (variant=respond, 참석자)
| 상태 | 시각 스펙 |
|------|----------|
| default(미응답) | 배경 `--c-surface`, 보더 hairline, radius `--r-md`, 패딩 16. 날짜·시간 `--t-body-strong`. ChipGroup default. |
| selected | 카드 좌측에 4px 강조 바(선택 강도 `fill` 색) 또는 상단 강도 라벨 칩. 카드 배경 불변(차분). |
| focus | 카드 포커스 시 `--border-focus`. |
| with-comment | 코멘트 아이콘(CommentBadge) active. |
| loading | 스켈레톤(날짜줄 + 칩 자리 `--c-surface-sunken`). |
| error | 카드 하단 인라인 안내(황토), 입력값 보존. |
| disabled | 마감 후 전체 `--s-disabled-*`, 탭 불가. |

### 상태 (variant=aggregate, 주최자 대시보드)
| 상태 | 시각 스펙 |
|------|----------|
| candidate(후보) | 정상 카드 + `--shadow-card`. SlotScoreBadge(순위+점수) + RequiredFulfillmentTag + IntensityDistributionBar(필수행·선택행). |
| excluded(제외) | 배경 `--c-surface-sunken`, opacity 0.6, 점수 자리 `⊘ 제외` 배지(황토 보더), 확정 버튼 대신 "필수 N명 불가" 라벨. 리스트 최하단. (§3.3) |
| empty(응답0) | placeholder "응답이 모이면 추천이 표시돼요". |
| loading | 집계 스켈레톤. |

### Props
| 속성 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `variant` | `'respond' \| 'aggregate'` | (필수) | 화면 분기 |
| `slot` | `Slot` | (필수) | `{ id, date, start, end }` |
| `value` | `string \| null` | `null` | (respond) 선택 강도 |
| `aggregate` | `AggregateData` | — | (aggregate) 건수 분포·필수 충족·점수·excluded 플래그 |
| `comment` | `string \| null` | `null` | 코멘트(FR-006) |
| `state` | `'default'\|'loading'\|'error'\|'disabled'\|'excluded'` | `default` | |

---

## 6. RecommendedSlotList + SlotScoreBadge

- **목적**: 추천 슬롯을 deterministic 점수 내림차순으로 렌더(§0.3). 제외 슬롯은 하단 구획.
- **사용 조건**: DASH-001.

### RecommendedSlotList 상태
| 상태 | 시각 스펙 |
|------|----------|
| default | 후보 SlotCard 점수순. 1순위에 강조. 제외 슬롯은 하단 별도 구획("필수 인원 불가 시간"). |
| empty(응답0) | placeholder + "링크를 공유해 보세요" + [링크 다시 공유]. |
| partial(필수만 응답) | 필수 기준 우선 정렬, 선택 분포행 "선택 응답 없음". |
| all-excluded | "필수 인원이 모두 가능한 시간이 없어요" + 차선(감점) 슬롯 제시(feature-spec F-WEB-DASH-001-002 예외). |
| loading | 스켈레톤 카드. |

### SlotScoreBadge 상태
| 상태 | 시각 스펙 |
|------|----------|
| rank-1 | 배경 `--c-brand`, 흰 텍스트, "①추천", radius `--r-full`. 점수 mono(`--t-mono-num`). |
| rank-n | 배경 `--c-brand-soft`, `--c-brand-strong` 텍스트, "②" "③". |
| excluded | "⊘ 제외" — 채움 없음, `--s-warning` 보더(황토), 점수 미표시. |

### Props (RecommendedSlotList)
| 속성 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `slots` | `ScoredSlot[]` | (필수) | 점수·순위·excluded 포함, 정렬 완료 |
| `sortMode` | `'recommended' \| 'time'` | `recommended` | 토글. 점수 계산은 불변 |
| `state` | `'default'\|'empty'\|'partial'\|'all-excluded'\|'loading'` | `default` | |

> tie-break(동률 시 ① 필수 prefer 수 → ② 미응답 적은 순 → ③ 시작시각)은 데이터 계산 책임(Engineer). 컴포넌트는 정렬된 배열을 받아 렌더만.

---

## 7. IntensityDistributionBar (집계 막대 — 건수 분포)

- **목적**: 슬롯별 강도 *건수* 분포를 stacked bar로(§3.4). **추천 weight와 다른 계산** — 건수만.
- **사용 조건**: DASH-001 aggregate SlotCard. 필수행·선택행 두 줄.

### 상태
| 상태 | 시각 스펙 |
|------|----------|
| default | 100% 폭 stacked. 세그먼트 폭 = 건수/총건수. 색 = `polarity`(§1.2), 정렬 = `order`. 세그먼트에 건수 라벨 + 형태 부호. 캡션 "응답 N명 기준". |
| empty(응답0) | 빈 트랙(`--c-surface-sunken`) + "응답 없음". |
| single-optional(익명성 임계) | 선택 1명뿐 → 분포 숨김, "선택 1명 응답"만(개인 식별 방지). |
| loading | 트랙 스켈레톤. |
| (hover desktop) | 세그먼트 hover 시 tooltip "선호 4명"(개인 식별 정보 없음). |

### Props
| 속성 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `scale` | `IntensityItem[]` | (필수) | 척도 배열(순회) |
| `counts` | `Record<id, number>` | (필수) | **건수** 분포(weight 아님) |
| `group` | `'required' \| 'optional'` | (필수) | 행 구분 |
| `total` | `number` | (필수) | 캡션용 |
| `anonymizeBelow` | `number` | `2` | 이 미만이면 분포 숨김(익명성) |

> ★ `counts`는 건수다. `weight`를 받지 않는다. hard-no도 "건수 1"로 쌓이며 제외 신호를 막대에 넣지 않는다(§3.4).

---

## 8. Legend (범례 — 자동 생성)

- **목적**: `IntensityScale`에서 색·형태·라벨을 **자동 생성**(손으로 안 적음, §0.1 규칙3).
- **사용 조건**: DASH-001 막대 하단.

### 상태
| 상태 | 시각 스펙 |
|------|----------|
| default | `scale.map`으로 [형태부호 + 색 스와치 + 라벨] 한 줄 나열. 단계 수 자동 흡수. |
| (그 외 해당 없음) | — |

### Props
| 속성 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `scale` | `IntensityItem[]` | (필수) | 배열 순회 |

---

## 9. ResponseProgress / ProgressIndicator

- **목적**: 참석자 응답 진행("3/8 응답") 표시 + 30초 목표 관측 지점(§0.2). 거짓 응답 강요 없는 중립 톤.
- **사용 조건**: RESP-001 상단 고정 바.

### 상태
| 상태 | 시각 스펙 |
|------|----------|
| default | "N/전체 응답" mono 숫자(`--t-mono-num`) + 도트/얇은 바. `aria-live="polite"`. |
| complete(전부) | 전체 채움(브랜드), "모두 응답했어요"(강요 아닌 긍정). |
| partial | 일부 채움. 미응답 강조·경고 없음(중립). |
| (hover/disabled/error 해당 없음) | — |

### Props
| 속성 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `answered` | `number` | (필수) | 응답 슬롯 수 |
| `total` | `number` | (필수) | 전체 슬롯 수 |

---

## 10. PendingAttendeeList + ReminderBadge (미응답 현황)

- **목적**: 미응답자 추적 + 리마인드(mock 상태 표시, 실발송 없음 — FR-004).
- **사용 조건**: DASH-001. 선택 참석자 비공개 일관(개인 강도 노출 금지, 응답 여부만).

### 상태
| 상태 | 시각 스펙 |
|------|----------|
| default | 미응답자 이름 칩 나열 + 각 [리마인드] 버튼. |
| reminded(mock) | "리마인드 보냄(데모)" ReminderBadge(info 톤), [리마인드] disabled. |
| empty(전원 응답) | "모두 응답했어요". |
| disabled(응답자) | 이미 응답 → [리마인드] disabled. |

### Props
| 속성 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `pending` | `Attendee[]` | (필수) | 미응답자(이름·역할만, 강도 없음) |
| `onRemind` | `(id) => void` | (필수) | mock 상태 변경만 |

> 비공개 일관: 미응답자도 "응답 여부"만 표시. 선택 참석자의 *강도/불참*은 개인 단위로 노출하지 않는다(집계만).

---

## 11. ConfirmSheet / ConfirmSlotSheet

- **목적**: (참석자) 부분 응답 제출 확인 / (주최자) 슬롯 확정. 모바일=하단 시트, 데스크톱=중앙 모달.
- **사용 조건**: RESP-001 부분 제출, DASH-002 확정.

### 상태 (참석자 부분 제출)
| 상태 | 시각 스펙 |
|------|----------|
| default | "응답하지 않은 슬롯이 있어요. 그대로 제출할까요?"(중립, 부정 뉘앙스·죄책감 금지). [그대로 제출](brand) / [마저 응답하기](ghost). |

### 상태 (주최자 확정)
| 상태 | 시각 스펙 |
|------|----------|
| default | 확정 슬롯 요약 + RequiredFulfillmentTag 재확인 + [확정](brand) / [취소](ghost). |
| warning(필수 미충족) | WarningBanner(황토 `--s-warning`, 빨강 아님) "필수 N명이 어려운 시간이에요" + [그래도 확정](경고 후 진행 허용 — 강제 차단 아님) / [취소]. |
| loading | 확정 진행 스피너. |
| error | "확정에 실패했어요" + 재시도. |

### Props
| 속성 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `mode` | `'submit-partial' \| 'confirm-slot'` | (필수) | 용도 |
| `slot` | `Slot` | — | (confirm) 대상 |
| `requiredFulfilled` | `boolean` | — | (confirm) 필수 충족 여부 → warning 분기 |
| `onConfirm` / `onCancel` | `() => void` | (필수) | |
| `state` | `'default'\|'warning'\|'loading'\|'error'` | `default` | |

> 확정 인터랙션: 필수 미충족이어도 경고 후 **주최자 판단으로 진행 허용**(강제 차단 아님, feature-spec F-WEB-DASH-005-002).

---

## 12. RequiredFulfillmentTag

- **목적**: 슬롯의 필수 인원 충족 결과("필수 5/5 가능")를 색+텍스트로. (hard 제약 결과, §0.3)
- **사용 조건**: aggregate SlotCard, ConfirmSlotSheet.

### 상태
| 상태 | 시각 스펙 |
|------|----------|
| fulfilled | "필수 5/5 가능" + ✓, `--c-brand-soft` 바탕 `--c-brand-strong` 텍스트. |
| partial | "필수 4/5" + 형태 부호, 중립 회색(`--c-surface-sunken`). 경고색 아님(아직 후보). |
| blocked(필수 hard-no) | "필수 1명 불가" + ⊘, `--s-warning` 보더(황토). → 슬롯 excluded. |

### Props
| 속성 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `required` | `number` | (필수) | 필수 총원 |
| `available` | `number` | (필수) | 가능 인원 |
| `blocked` | `boolean` | `false` | hard-no 존재(제외) |

---

## 13. PrivacyBoundaryNotice (주최자 측 집계 경계 고지)

- **목적**: 주최자에게 "선택 참석자는 집계로만 보인다" 고지(FR-003 비공개 경계).
- **사용 조건**: DASH-001 상단 상주.

### 상태
| 상태 | 시각 스펙 |
|------|----------|
| default | ⓘ info 아이콘 + "선택 참석자 응답은 집계로만 표시됩니다"(caption). 상주. |

### Props
| 속성 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `message` | `string` | (UX라이터) | 고지 문구 |

---

## 14. 공통 버튼 (PrimaryButton / GhostButton / SubmitButton)

- **목적**: CTA·보조 액션. 참석자 핵심 CTA는 엄지 존 full-width.

### 상태 (PrimaryButton)
| 상태 | 시각 스펙 |
|------|----------|
| default | 배경 `--c-brand`, 흰 텍스트(`--t-body-strong`), h=48, radius `--r-md`, full-width(모바일). |
| hover(desktop) | 배경 `--c-brand-strong`. |
| active/pressed | `--c-brand-strong` + 미세 scale(0.98). |
| focus | `--border-focus` 링. |
| disabled | `--s-disabled-bg` / `--s-disabled-ink`, 커서 not-allowed. |
| loading | 텍스트 자리 스피너, disabled 처리. |

### SubmitButton 추가
- 라벨에 응답 수 동적 표시: "응답 제출 (5/8)". 0건이어도 활성(무응답 제출 허용 → ConfirmSheet 경유).

### GhostButton
- 배경 투명, 텍스트 `--c-brand`, 보더 1px `--c-hairline`. hover 시 `--c-surface-sunken`.

### Props (공통)
| 속성 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `variant` | `'primary' \| 'ghost'` | `primary` | |
| `size` | `'md' \| 'lg'` | `lg` | lg=48px |
| `fullWidth` | `boolean` | `false`(데스크톱) / `true`(모바일 CTA) | |
| `disabled` | `boolean` | `false` | |
| `loading` | `boolean` | `false` | |

---

## 15. 보조 컴포넌트 (간략)

| 컴포넌트 | 목적 | 핵심 상태 |
|---------|------|----------|
| CommentInput / CommentBadge | 슬롯 코멘트(FR-006) 입력·표시 | 빈/입력중/저장됨(아이콘 active)/비공개 일관 |
| Toast | 인라인 피드백(제출 실패 등) | info/error(황토). 자동 dismiss, 입력값 보존 |
| Skeleton | 로딩 placeholder | shimmer(reduced-motion 시 정적), `--c-surface-sunken` |
| ShareLink | 링크 복사(ORG-002/DASH-003) | default / 복사완료 토스트 |
| AttendeeRow + RoleToggle | 조율 생성 참석자·역할 지정(ORG-001) | default/필수·선택 토글/필수0명 안내(강요 아님) |

---

## 부록 — open questions (UX라이터 / Engineer 전달)

- **[UX라이터]** 강도 칩 라벨 확정(선호/가능/가급적 회피/불가 — 중립 어휘, PRD §8.2), 안심·비공개·부분제출·제외 슬롯·경고 문구 전부 확정 필요. 본 스펙은 placeholder.
- **[Engineer]** `IntensityScale` 데모 기본값 4단계 주입(prefer/ok/avoid/hard-no). 3단계 전환 시 배열만 교체.
- **[Engineer]** tie-break 결정성 검증(① 필수 prefer 수 → ② 미응답 적은 순 → ③ 시작시각). 컴포넌트는 정렬된 배열 수신.
- **[디자이너↔Engineer]** 최소 익명성 임계: 선택 1명 슬롯 분포 숨김(`anonymizeBelow=2` 제안). 데모 데이터 설계 시 반영.
- **[디자이너↔UX라이터]** 선택 참석자 코멘트의 주최자 노출 범위(집계/익명만). 코멘트 집계 표시 방식 협의.
- **[전체]** 데모 다크모드 지원 여부 미정(screen-plan §6 [확인 필요]). 토큰은 의미 기반이라 다크 추가 시 값만 교체 가능.
