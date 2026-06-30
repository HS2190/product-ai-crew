# 컴포넌트 스펙 — 다인원 회의 일정 조율 (timefit-flowtime)

service: timefit-flowtime
version: v1.1
author: 디자이너 (CREW mode)
date: 2026-06-30
status: complete
design_skill: minimalist-ui (override: 빨강 배제 → 황토 #B5852A)

> 정본: 컴포넌트별 **목적 → 사용 조건 → 상태 → Props → 인터랙션/전이 → 사용 예 → Figma 노트**.
> 토큰은 `design-spec-v1.1.md §1` 참조. 상태는 default/hover/active/disabled/error를 빠짐없이(해당 없으면 명시).
> Figma 노트 = 도구 연결 시 Variant·시멘틱 네이밍·오토레이아웃 매핑(현재 미산출, §design-spec 8 참조).

---

## C-01. IntensityChip / IntensityChipGroup ★ 핵심

**목적**: 슬롯에 선호 강도를 입력하는 최소 동작 단위. `IntensityScale` 배열을 순회해 칩을 렌더(단계 수 가변, screen-plan §0.1).

**사용 조건**: SCR-MOB-RESP-001 각 슬롯 카드 내부. 단일 선택(라디오) + 해제 가능.

### 상태 (IntensityChip)

| 상태 | 표현 | 토큰 |
|------|------|------|
| default(unselected) | 무채 아웃라인 칩, 형태 아이콘 + 라벨 | border `--c-line`, text `--c-ink-muted`, bg `--c-white` |
| hover (데스크톱) | 테두리 약간 진하게, 배경 미세 | border `--c-line-strong`, bg `--c-surface-2` |
| active(누르는 순간) | `scale(0.97)` 160ms | transform only |
| selected — prefer | 세이지 채움 | bg `--c-sage-bg`, fg `--c-sage`(#496447, 5.56:1), shape ● |
| selected — ok | 무채 채움 | bg `--c-neutral-ok-bg`, fg `--c-neutral-ok`(#676B65, 4.59:1), shape ○ |
| selected — avoid (soft) | 황토 저채도 | bg `--c-clay-bg`, **fg `--c-clay-ink`(#7A5A16, 5.39:1 — 라벨 가독)**, border `--c-clay-line`(연함), shape ◐ |
| selected — hard-no (hard) | 황토, 진한 테두리 | bg `--c-clay-bg`, **fg `--c-clay-ink`(#7A5A16, 5.39:1)**, border `--c-clay`(진함, soft 대비 강조), shape ⊘ |
| disabled(마감 후) | 흐림, 입력 불가 | text `--c-ink-faint`, bg `--c-surface-2` |
| error | 칩 자체 error 없음 — 제출 실패는 토스트가 담당 | 해당 없음(입력은 로컬 즉시 반영) |

> 부정 두 단계(avoid/hard-no)는 **라벨 fg를 둘 다 `--c-clay-ink`(5.39:1, AA)로 통일**해 라벨 가독성을 확보하고, soft/hard 구분은 **형태(◐ vs ⊘) + 테두리 채도(`--c-clay-line` 연함 vs `--c-clay` 진함)**로 가른다(색약·저시력 동시 대응, design-spec §1.2·§5.2 실측 표). v1.0은 avoid fg가 `--c-clay`(2.8:1, AA 미달)였던 것을 정정. selected 상태에 **경고 모션·테두리 깜빡임 절대 없음**(conventions).

### Props (IntensityChip)

| Prop | 타입 | 기본 | 설명 |
|------|------|------|------|
| `scaleItem` | `IntensityScale[number]` | — | {id,label,polarity,token,shape,ariaLabel} 주입 |
| `selected` | boolean | `false` | 선택 여부 |
| `disabled` | boolean | `false` | 마감 시 true |
| `onToggle` | `(id) => void` | — | 탭/재탭 콜백 |

### Props (IntensityChipGroup)

| Prop | 타입 | 기본 | 설명 |
|------|------|------|------|
| `scale` | `IntensityScale[]` | — | 칩 배열(길이=단계 수) |
| `value` | `id \| null` | `null` | 현재 선택(null=무응답) |
| `onChange` | `(id\|null) => void` | — | 선택/해제 |
| `layout` | `equal \| wrap` | `equal` | 모바일 균등분배 / 많으면 wrap |

### 인터랙션·상태 전이 (★)

- 칩 탭 → `value=id`(즉시 색·형태 반영). 같은 칩 재탭 → `value=null`(무응답 복귀).
- 다른 칩 탭 → 이전 해제 + 새 선택(라디오). **확인 다이얼로그 없음.**
- 부정 칩 선택도 동일 경로 — 추가 마찰 0(우민지 보호).
- `aria`: group `role=radiogroup`, 칩 `role=radio aria-checked`. label=`scaleItem.ariaLabel`.

### 사용 예
```
<IntensityChipGroup scale={IntensityScale} value={slot.intensity}
  onChange={(id)=>setSlot(slot.id,id)} layout="equal" />
```

### Figma 노트
- Component `chip/intensity` + Variants: `state=unselected/hover` × `id=prefer/ok/avoid/hard-no` × `selected=true/false`.
- Group = Auto Layout 가로, gap `space/2`, 각 칩 fill 균등, height fixed 44.
- 색은 Variable `color/intensity/{id}/bg|fg`. 형태 아이콘은 컴포넌트 내 벡터(Phosphor 계열 두께 통일).

---

## C-02. SlotCard ★

**목적**: 후보 슬롯 1개를 카드로 표현. 참석자(입력)·주최자(집계) 양쪽에서 베이스로 재사용.

**사용 조건**: RESP-001(입력형), DASH-001(집계형, recommended/excluded variant).

### 상태

| 상태 | 표현 |
|------|------|
| default | 1px line 카드, 그림자 없음, radius 12 |
| hover(데스크톱) | `--elev-hover`(0 2px 8px /.04), 배경 `--c-surface-2` 미세 |
| active | 해당 없음(카드 자체는 컨테이너; 액션은 내부 칩·버튼) |
| selected(집계형, 상세 펼침) | 좌측 2px `--c-ink` 인디케이터 |
| disabled(마감) | 입력 칩 disabled, 카드 흐림 |
| error | 해당 없음(데이터 로드 실패는 화면 레벨 Error) |
| excluded(집계형) | 본문 밖 제외 섹션에 위치 + `badge/excluded` 황토. 카드 톤 다운(`--c-ink-muted`) |

### Props

| Prop | 타입 | 기본 | 설명 |
|------|------|------|------|
| `slot` | `{id,start,end,comment?}` | — | 시각 데이터 |
| `mode` | `input \| aggregate` | `input` | 화면별 |
| `status` | `candidate \| excluded \| confirmed` | `candidate` | 집계형 |
| `rank` | number? | — | 추천 순위(집계형) |
| `score` | number? | — | 추천 점수(집계형) |

### 인터랙션·전이
- input 모드: 카드 자체 비인터랙션, 내부 `IntensityChipGroup`·코멘트 링크가 동작.
- aggregate 모드: 카드 탭 → 상세 펼침(분포·필수 충족·코멘트 집계). 선택 참석자 개인 식별 불가.
- 시각은 mono tabular(자릿수 정렬).

### Figma 노트
- `card/slot` 베이스 + Variant `mode=input/aggregate`, `status=candidate/excluded/confirmed`.
- Auto Layout 세로, padding `space/4`(모바일)/`space/5`(데스크톱), width fill.

---

## C-03. IntensityDistributionBar ★ (집계 막대, ≠ 추천 weight)

**목적**: 한 슬롯에 각 강도별 **응답 건수 분포**를 stacked 막대로. `IntensityScale` 순회, `order` 정렬·`polarity` 색칠. **weight 사용 안 함**(screen-plan §0.3 분리).

**사용 조건**: DASH-001 슬롯 카드/표. 필수/선택 그룹 2줄 구분(NFR-003).

### 상태

| 상태 | 표현 |
|------|------|
| default | 100% 폭 stacked segment(강도별), 막대 height 8, radius 4 |
| hover(데스크톱) | 세그먼트 tooltip "선호 3명" |
| 부분(응답 일부) | 응답분만 채우고 나머지 미응답 무채 트랙 |
| empty(응답 0) | 막대 자리 placeholder 라인 + "응답 대기" |
| 최소 익명성 발동 | 막대 대신 텍스트 "선택 1명 응답"(강도 비표시) |
| disabled/error | 해당 없음(상위 화면 상태가 담당) |

### Props

| Prop | 타입 | 기본 | 설명 |
|------|------|------|------|
| `scale` | `IntensityScale[]` | — | segment 정의(N 가변) |
| `counts` | `Record<id, number>` | — | 강도별 응답 수 |
| `group` | `required \| optional` | — | 2줄 구분 |
| `minAnonymity` | number | `1` | 이하면 강도 숨김 |

### 인터랙션·전이
- 단계 수 바뀌면 segment 수만 변하고 막대 폭 100% 유지(N 종속 금지).
- `aria`: `role=img aria-label="필수: 선호 3, 가능 2, 회피 1"`.

### Figma 노트
- `bar/distribution` + Variant `group=required/optional`, `state=full/partial/anonymized`.
- Auto Layout 가로, 각 segment width = fill 비율(인스턴스 스왑으로 표현하거나 노트로 비율 명시).

---

## C-04. RoleBadge

**목적**: 참석자 역할(필수/선택) 표시. 선택엔 가벼움, 필수엔 무게.

### 상태
| 상태 | 표현 |
|------|------|
| required | bg `--c-role-required-bg`, text `--c-role-required`, pill, uppercase ls .05em |
| optional | bg `--c-role-optional-bg`, text `--c-role-optional`(무채 — 가벼움) |
| (hover/active/disabled/error) | 해당 없음(비인터랙션 라벨) |

### Props
| Prop | 타입 | 기본 |
|------|------|------|
| `role` | `required \| optional` | — |

### Figma 노트: `badge/role` + Variant `role=required/optional`. pill radius `radius/pill`.

---

## C-05. ReassuranceBanner + PrivacyNotice (솔직함 보호 ★)

**목적**: 선택 참석자에게 "빠져도 됨"·"비공개" 안심. 우민지 Pain 직접 해소(FR-003).

**사용 조건**: RESP-000(강조 블록), RESP-001(지속 리마인더), RESP-002(완료 재확인).

### 상태
| 상태 | 표현 |
|------|------|
| default(선택 참석자) | `--c-surface-2` 카드, **중립 톤**(황토·빨강 아님 — 경고가 아니라 안심). 아이콘=선 자물쇠(중립). |
| weak(필수 참석자) | 약하게/생략(강도 안내 위주) |
| persistent(RESP-001) | 상·하단 caption 지속, 시각 방해 최소 |
| (hover/active/disabled/error) | 해당 없음(정적 고지) |

### Props
| Prop | 타입 | 기본 | 설명 |
|------|------|------|------|
| `variant` | `reassurance \| privacy` | — | 안심/비공개 |
| `emphasis` | `strong \| weak \| persistent` | `strong` | 역할별 강조 |

### 인터랙션·전이: 정적. 부정 강도 입력 시에도 톤 불변(안심 지속).
### Figma 노트: `banner/reassurance`, `notice/privacy` + Variant `emphasis`. **색은 안심 톤(중립)** — 경고 컴포넌트와 별개.

---

## C-06. WarningBanner (황토, 경고 ≠ 거부)

**목적**: 필수 응답 대기·필수 미충족 확정 등 *주의* 안내. **차단이 아니라 알림**.

### 상태
| 상태 | 표현 |
|------|------|
| default | `--c-clay-bg` 배경 + `--c-clay-line` 1px + `--c-clay-ink` 텍스트. 아이콘=선형 i. **빨강·느낌표 남용 금지.** |
| (hover/active) | 해당 없음(비인터랙션, 내부 액션 버튼은 별도) |
| disabled/error | 해당 없음 |

### Props
| Prop | 타입 | 기본 |
|------|------|------|
| `message` | string | — |
| `action?` | `{label,onClick}` | — |

### Figma 노트: `banner/warning` 단일 + 색 Variable `color/clay/*`. ReassuranceBanner와 명확히 다른 컴포넌트(안심 vs 주의).

---

## C-07. ExcludedSlotSection (제외 영역, 아코디언)

**목적**: 필수 hard-no로 제외된 슬롯을 본문 *밖* 접힘 영역에. 감점 후보와 시각 위계 분리(decisions).

### 상태
| 상태 | 표현 |
|------|------|
| collapsed(default) | 헤더 "필수 참석자가 불가한 시간 (2)" + `+` 아이콘, 1px line만(박스 없음) |
| expanded | 슬롯 리스트 + 각 슬롯 `badge/excluded` 황토 + 사유. `−` 아이콘 |
| empty(제외 0) | 섹션 자체 미노출 |
| (hover/active/disabled/error) | 헤더 hover 시 배경 미세 / 그 외 해당 없음 |

### Props
| Prop | 타입 | 기본 |
|------|------|------|
| `excludedSlots` | `Slot[]` | `[]` |
| `defaultOpen` | boolean | `false` |

### 인터랙션·전이: 헤더 탭 → 펼침/접힘(height auto, opacity 전이). 컬러 박스 없이 1px line + `+`/`−`(minimalist 아코디언).
### Figma 노트: `section/excluded` + `badge/excluded`(Variant of `badge/status`). Auto Layout 세로, 접힘은 프로토타입 노트로.

---

## C-08. RecommendedSlotList + SlotScoreBadge + RequiredFulfillmentTag

**목적**: deterministic 추천 정렬 결과 리스트(점수순, §0.3 STEP3).

### SlotScoreBadge 상태
| 상태 | 표현 |
|------|------|
| rank-1 | 잉크 솔리드 `--c-rank-1` pill "①", mono 점수 |
| rank-n | 무채 아웃라인 pill 순위 + mono 점수 |
| tentative(필수 0) | 점수 옆 "잠정" caption + 상단 WarningBanner |

### RequiredFulfillmentTag 상태
| 상태 | 표현 |
|------|------|
| 충족 "필수 5/5 가능" | 세이지 텍스트(긍정) |
| 미충족 "필수 4/5" | 황토 텍스트(주의, 거부 아님) |

### Props (List)
| Prop | 타입 | 기본 | 설명 |
|------|------|------|------|
| `slots` | `Slot[](sorted)` | — | STEP3 정렬 완료본 |
| `sort` | `recommended \| time` | `recommended` | 표시 순서만(점수 계산 불변) |
| `tentative` | boolean | `false` | 필수 응답 0 |

### 인터랙션·전이
- 정렬 토글 → 표시 순서만 변경, 점수·배지 불변.
- 슬롯 [이 시간으로 확정] → ConfirmSheet/모달.
### Figma 노트: `list/recommended`, `badge/status`(rank-1/rank-n/excluded/reminder-sent Variant), `tag/required-fulfillment`(met/unmet).

---

## C-09. ConfirmSheet (제출/확정 공용 시트)

**목적**: 부분 응답 제출 확인(참석자) / 슬롯 확정(주최자). 모바일 하단 시트, 데스크톱 모달.

### 상태
| 상태 | 표현 |
|------|------|
| default | 시트 상단 1px line + `--elev-sheet`, 요약 + [주 액션]/[취소] |
| loading | 처리 중 스피너, [주 액션] 일시 disabled(중복 클릭 방지) |
| warning(확정 시 필수 미충족) | 상단 WarningBanner(황토) + 진행 허용 |
| error | "확정하지 못했어요. 다시 시도해 주세요" 시트 유지 |
| disabled | 처리 중 주 버튼 |
| 성공 | 시트 닫힘 → 다음 화면 전이 |

### Props
| Prop | 타입 | 기본 | 설명 |
|------|------|------|------|
| `kind` | `submit \| confirm` | — | 용도 |
| `summary` | node | — | 미응답 수 / 확정 슬롯 요약 |
| `warning?` | string | — | 필수 미충족 등 |

### 인터랙션·전이
- 참석자 부분 제출: [그대로 제출](중립)/[더 채우기]. **강요·부정 뉘앙스 금지.**
- 주최자 미충족 확정: 경고 후 [확정] 허용(주최자 권한, 차단 아님).
### Figma 노트: `sheet/confirm` + Variant `kind=submit/confirm`, `state=default/loading/warning/error`. 모바일 bottom-anchored Auto Layout.

---

## C-10. 공용 — PrimaryButton / SecondaryButton / Toast / ProgressIndicator / RoleToggle / ReminderBadge / CommentInput

### PrimaryButton
| 상태 | 표현 |
|------|------|
| default | bg `--c-ink`, text `--c-white`, radius 6, **그림자 없음** |
| hover | bg `#333` 미세 시프트 |
| active | `scale(0.98)` |
| disabled | bg `--c-surface-2`, text `--c-ink-faint`(단, RESP 제출은 disabled 미사용) |
| loading | 스피너 + 텍스트 유지, 입력 차단 |

Props: `variant(primary/secondary/ghost)`, `size(sm/md/lg)`, `disabled`, `loading`.

### Toast
| 상태 | 표현 |
|------|------|
| info("복사됨") | 무채 다크 캡슐 |
| error("다시 시도해 주세요") | 황토 라인 캡슐(빨강 아님), 입력값 보존 안내 |

### ProgressIndicator: "N / 전체" mono tabular. 30초 목표 관측 지점(screen-plan §0.2). 상태=default만(정적 카운트).

### RoleToggle (주최자 ORG-001)
| 상태 | 표현 |
|------|------|
| required/optional | 세그먼트 토글, 선택측 `--c-ink` 텍스트 |
| hover/active | 미세 배경 |
| disabled | 해당 없음 |

### ReminderBadge (mock)
| 상태 | 표현 |
|------|------|
| 미발송 | [리마인드] 버튼(secondary) |
| 보냄(데모) | "리마인드 보냄(데모)" 무채 배지, 버튼 disabled |
| 이미 응답자 | [리마인드] disabled |

### CommentInput (RESP-001b)
| 상태 | 표현 |
|------|------|
| default(빈) | placeholder "사정을 짧게 남겨도 돼요" |
| 입력중 | 글자수 가벼운 카운트 |
| disabled | [저장] 빈 입력 시 비활성 |
| 성공 | 저장 → 카드 코멘트 칩 활성 |
| loading/error | 해당 없음(로컬, mock) |

### Figma 노트(공용): 각각 단일 컴포넌트 + 상태 Variant. `btn/primary` `btn/secondary` `btn/ghost`, `toast/info` `toast/error`, `toggle/role`, `badge/reminder`, `input/comment`.

---

## 부록 A. 상태 커버리지 매트릭스 (강화 규칙 — 빠짐없이)

| 컴포넌트 | default | hover | active | disabled | error | 비고 |
|---------|---------|-------|--------|----------|-------|------|
| IntensityChip | ● | ●(데스크톱) | ● | ● | ▲(토스트가 담당) | selected 4종 |
| SlotCard | ● | ●(데스크톱) | ▲(컨테이너) | ● | ▲(화면레벨) | excluded variant |
| IntensityDistributionBar | ● | ●(tooltip) | ▲ | ▲ | ▲ | 익명성/부분/empty |
| RoleBadge | ● | ▲ | ▲ | ▲ | ▲ | 정적 라벨 |
| Reassurance/Privacy | ● | ▲ | ▲ | ▲ | ▲ | 정적 안심 |
| WarningBanner | ● | ▲ | ▲ | ▲ | ▲ | 황토, 주의 |
| ExcludedSlotSection | ●(collapsed) | ●(헤더) | ●(toggle) | ▲ | ▲ | expanded/empty |
| SlotScoreBadge | ● | ▲ | ▲ | ▲ | ▲ | rank-1/n/tentative |
| ConfirmSheet | ● | ▲ | ▲ | ● | ● | loading/warning |
| PrimaryButton | ● | ● | ● | ● | ▲ | loading |
| Toast | ● | ▲ | ▲ | ▲ | ●(황토) | info/error |

> ● 정의됨 / ▲ 해당 없음(사유 명시). screen-plan/feature-spec의 화면 상태와 정합.
