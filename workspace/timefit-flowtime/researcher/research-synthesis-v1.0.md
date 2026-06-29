# Research Synthesis: 다인원 회의 일정 조율 (timefit-flowtime)

**Method:** 경쟁/유사 서비스 분석(Secondary research) + 도메인 분석 + 웹 검색 | **Participants:** 0 (1차 사용자 데이터 없음)
**Date:** 2026-06-29 | **Researcher:** Researcher Agent (CREW mode)
**Status:** complete

> ⚠️ **근거 등급 표기 규칙** — 이 문서는 1차 사용자 데이터(인터뷰·설문·티켓)와 페르소나가 **없는 상태**에서 작성됐다. 모든 주장에 등급을 붙인다.
> - `[관찰]` 경쟁 서비스 문서·후기·기능 명세에서 직접 확인한 사실 (출처 명시)
> - `[해석]` 관찰로부터 도출한 추론
> - `[추정]` 1차 데이터로 검증되지 않은 가설. PM 단계 또는 사용성 테스트로 검증 필요

---

## Executive Summary

다인원(6명+) 회의 시간 조율은 "겹치는 시간 찾기"는 기존 도구(when2meet, Doodle, Calendly, 되는시간 등)가 이미 잘 푼다. 그러나 **세 가지 구조적 빈틈**이 남아 있다 — ① **강도 있는 사정(soft constraint)** 을 담는 어휘가 빈약하고(대부분 yes/no 2단계, Doodle만 "if need be" 3단계 `[관찰]`), ② **필수/선택 참석자 구분**이 폴링형 도구엔 거의 없으며(Outlook만 네이티브 지원하나 조직 내부 한정 `[관찰]`), ③ **선택 참석자의 솔직한 응답**을 유도하는 장치는 어떤 도구에도 없다 `[관찰: 부재 확인]`. 이 세 빈틈은 서로 연결돼 있다 — 정보가 풍부할수록(강도·역할 구분) 참석자는 솔직하기 어려워지므로, 단순히 입력칸을 늘리는 게 아니라 *솔직함의 비용을 낮추는* 설계가 필요하다 `[해석]`. 모바일 0→1 제품의 차별점은 "더 많은 슬롯을 모으는 것"이 아니라 "강도와 역할이 반영된, 솔직한 신호를 모으는 것"에 있다 `[해석]`.

---

## Key Themes

### Theme 1: "겹치는 시간 찾기"는 이미 commodity — 차별점이 아니다
**Prevalence:** 분석한 6개 도구 전부 `[관찰]`
**Summary:** when2meet, Doodle, Calendly Meeting Polls, 되는시간, 모두의 시간, Outlook Scheduling Assistant 모두 핵심 기능은 "참석자 가용 시간 모아서 겹치는 슬롯 보여주기"다. 이 기능 자체로는 변별력이 없다.
**Supporting Evidence:**
- when2meet: 무료 웹 가용성 폴링. 캘린더 연동·리마인더·미팅 생성 없음, 데스크톱 전용 UI `[관찰: usecarly/koalendar]`
- Doodle Group Poll: 슬롯별 yes / cannot / if-need-be 투표 `[관찰: doodle.com]`
- 되는시간(whattime.co.kr): Google/Outlook/iCloud/네이버 캘린더 연동 + Zoom/Meet 링크 자동 생성 `[관찰: whattime.co.kr]`
**Implication:** 0→1 제품이 "또 하나의 when2meet"이 되면 진입 의미가 없다. 차별점은 Theme 2~4의 빈틈에서 나와야 한다 `[해석]`.

### Theme 2: 강도 있는 사정(soft constraint)을 담는 어휘가 빈약하다
**Prevalence:** 6개 중 5개가 2단계(yes/no) 또는 부재. Doodle만 3단계 `[관찰]`
**Summary:** "되긴 되는데 점심 직후라 별로", "그 요일은 외근이라 가능하면 피하고 싶다" 같은 **강도(intensity)** 정보를 표현할 칸이 거의 없다. 대부분 이분법(가능/불가능)이라, 이 뉘앙스는 메신저 대화로 새어나가 일정 결정에 반영되지 못한다 (← input 문제 정의와 일치).
**Supporting Evidence:**
- Calendly group scheduling: 슬롯당 yes/no만, maybe 없음 `[관찰: zapier/calday]`
- Doodle "if need be": 슬롯을 "되면 맞춰볼 수 있음"으로 표시, 호스트는 yes보다 **약한 신호**로 본다 (기본 ON) `[관찰: whocan.org]`
- Doodle의 "if need be"조차 *부정적 강도*("되지만 싫다")는 표현 못 함 — 긍정/조건부 2단계일 뿐 `[해석]`
**Implication:** "가능/불가능"을 넘어 **선호 강도(prefer / ok / avoid-if-possible / hard-no)** 를 담는 입력 모델이 핵심 차별 기회다. Doodle의 3단계가 시장이 인정한 출발점이고, 그 위에 "부정적 강도"를 더하는 게 빈틈이다 `[해석/추정]`.

### Theme 3: 필수/선택 참석자 구분이 폴링형 도구에 거의 없다
**Prevalence:** 폴링형 도구(when2meet/Doodle/되는시간/모두의시간)에서 부재. Outlook만 네이티브 지원하나 한계 있음 `[관찰]`
**Summary:** "누가 꼭 와야 하고(필수) 누가 선택적인가"는 일정 결정의 핵심 변수인데, 폴링형 도구는 모든 응답자를 동등 취급한다. 따라서 "선택 참석자 3명이 안 되더라도 필수 참석자 5명이 되는 슬롯"을 자동으로 우선순위화하지 못한다.
**Supporting Evidence:**
- Outlook Scheduling Assistant: required/optional 구분 네이티브 지원. AutoPick은 required 한 명이라도 busy면 슬롯 제외, optional은 제안을 막지 않음 `[관찰: microsoft support]`
- 그러나 Outlook은 **조직 도메인 내부 캘린더만** 조회 — 외부 참석자는 "Unknown"으로 표시 `[관찰: calendarbridge]`. 6명+ 그리드는 가독성 저하 `[관찰]`
- 폴링형 도구는 외부 참석자엔 강하나(계정 불필요) 역할 구분이 없다 `[관찰]`
**Implication:** **"외부 참석자도 받는 폴링형의 개방성" + "필수/선택 역할을 일정 결정에 반영하는 Outlook의 로직"** 을 동시에 가진 도구가 시장에 없다. 이 교집합이 가장 또렷한 빈틈이다 `[해석]`.

### Theme 4: 선택 참석자의 "솔직한 응답"을 유도하는 장치가 어디에도 없다
**Prevalence:** 분석 도구 전부 부재 `[관찰: 부재 확인]`
**Summary:** input의 문제 정의("선택적 참석자는 자기 사정으로 일정이 틀어질까 봐 솔직히 답하기 어려워한다")는 사회적 바람직성 편향(social desirability bias)의 일정 조율 버전이다 `[해석]`. 기존 도구는 모든 응답을 공개·동등 취급하므로, 선택 참석자는 "내가 avoid를 누르면 다수에게 폐를 끼친다"는 압박 속에 응답한다.
**Supporting Evidence:**
- 사회적 바람직성 편향: 응답자가 타인에게 좋게 보이려 "바람직한 행동을 과대보고"하는 응답 편향 — 자기보고 연구의 고질적 문제 `[관찰: Wikipedia/Stanford 연구]`
- 일정 조율에 직접 적용한 연구는 검색되지 않음 — 도메인 매핑은 `[추정]`
- Doodle은 응답 옵션은 있으나 **응답이 다른 참석자에게 공개**되는 구조라 솔직함의 비용이 높다 `[해석]`
**Implication:** 차별 기회 = ① 선택 참석자의 강도/불참을 **다수에게 노출하지 않는** 비공개 신호 처리, ② "당신이 안 돼도 회의는 진행될 수 있다"는 안심을 주는 역할 표시. 이는 Theme 2·3과 결합돼야 작동한다 `[해석]`.

### Theme 5: 모바일 + 응답 속도가 다인원 조율의 병목
**Prevalence:** 도메인 분석 + input 문제 정의 `[해석/추정]`
**Summary:** 참석자가 많을수록 한 명의 지연이 전체를 막는다(input). 기존 강자(when2meet 데스크톱 전용, Outlook 그리드)는 모바일 응답 경험이 약하다 `[관찰]`. 모바일에서 30초 안에 끝나는 응답 + 미응답자 자동 리마인더가 0→1의 실질 가치일 수 있다 `[추정]`.
**Supporting Evidence:**
- when2meet: 데스크톱 전용, 리마인더·팔로업 없음 `[관찰: koalendar]`
- Doodle 무료: 리마인더가 유료 기능 `[관찰: usecarly]`
**Implication:** "강도·역할" 차별이 작동하려면 응답 마찰이 극히 낮아야 한다. 모바일 응답 UX와 미응답 추적이 차별 기능을 떠받치는 토대 `[해석]`.

---

## Insights → Opportunities

| # | Insight (근거 등급) | Opportunity | Impact | Effort |
|---|---|---|---|---|
| I1 | 강도 정보(soft constraint)를 담는 도구가 사실상 없다 (Doodle 3단계가 최대) `[관찰]` | 선호 강도 입력 모델 — prefer/ok/avoid/hard-no 등 다단계, 부정적 강도까지 포함 | High | Med |
| I2 | 필수/선택 구분 + 외부 참석자 개방성을 동시에 가진 도구가 없다 `[관찰]` | 역할 기반 일정 산정 — 필수는 hard 제약, 선택은 가중치로 반영하는 추천 로직 | High | High |
| I3 | 선택 참석자의 솔직한 응답을 보호하는 장치가 부재 `[관찰 부재 + 추정]` | 비공개 신호 처리 + "회의는 당신 없이도 성립" 안심 장치 | High | Med |
| I4 | 강도·역할 정보가 메신저로 새어나가 결정에 미반영 `[input/해석]` | 사정/맥락을 슬롯 응답에 첨부(코멘트·태그)해 한곳에 모으기 | Med | Low |
| I5 | 다인원에서 1인 지연이 전체 병목 `[input/추정]` | 모바일 초경량 응답 + 미응답자 자동 리마인더 + 실시간 현황 | High | Med |
| I6 | "겹치는 시간 찾기"는 commodity `[관찰]` | 차별을 강도·역할·솔직함에 집중, 기본 폴링은 빠르게 패리티 확보 | — | — |

> 우선순위·범위 결정은 PM의 몫. 위 Impact/Effort는 근거 기반 *입력값*이며 결정이 아니다.

---

## User Segments Identified

> ⚠️ 페르소나·1차 데이터 부재로 아래 세그먼트는 도메인 분석 기반 `[추정]`. PM의 페르소나 정의와 사용성 테스트로 검증 필요.

| Segment | Characteristics | Needs | Size (추정) |
|---|---|---|---|
| **주최자 / 조율자** (Organizer) | 회의 소집·결정 책임. 6명+ 일정을 빠르게 확정해야 함 | 미응답자 추적, 필수/선택 구분 반영, 빠른 확정, 강도 정보 한눈에 | 1인/회의지만 핵심 의사결정자 |
| **필수 참석자** (Required) | 회의 성립에 꼭 필요. 빠지면 회의 무의미 | 자기 가용/선호를 정확히 전달, 강도 표현 | 회의당 소수(2~5) |
| **선택 참석자** (Optional) | 와도 되고 안 와도 되는 인원. 솔직히 답하기 부담 | 압박 없이 솔직한 응답, "빠져도 괜찮다"는 안심, 비공개성 | 회의당 다수일 수 있음 — Theme 4의 핵심 타겟 |
| **(잠재) 비응답 지연자** | 바빠서/우선순위 낮아 응답이 늦는 인원. 역할 무관하게 발생 | 마찰 없는 모바일 응답, 가벼운 리마인더 | 다인원일수록 비중↑ `[추정]` |

**세그먼트 간 긴장:** 주최자는 *더 많은 정보*(강도·역할·맥락)를 원하고, 선택 참석자는 *덜 노출되길* 원한다. 이 긴장 해소가 제품의 중심 설계 과제다 `[해석]`.

---

## Competitor Findings (무엇을 하는가 + 무엇이 비었는가)

| 도구 | 무엇을 하는가 `[관찰]` | 강도(soft) | 필수/선택 | 솔직함 유도 | 빈틈 |
|---|---|---|---|---|---|
| **when2meet** | 무료 웹 가용성 그리드 폴링 | yes/no 2단계 | 없음 | 없음 | 데스크톱 전용, 리마인더·연동·앱 없음, 다인원 가독성 약함 |
| **Doodle** | 그룹 폴 (슬롯별 yes/cannot/if-need-be) | **if-need-be 3단계** (시장 최고 수준) | 없음 | 없음(응답 공개) | 무료 1폴·10슬롯·광고 제한, 리마인더 유료, 부정적 강도 없음 |
| **Calendly** | 1:1 예약 중심 + Group Events/Meeting Polls | yes/no만(maybe 없음) | 없음 | 없음 | 폴은 부가기능, 강도·역할 빈약, 유료 의존 |
| **Outlook Scheduling Assistant** | free/busy 기반 추천, **required/optional 네이티브** | 캘린더 free/busy만 | **있음**(required hard, optional 비차단) | 없음 | **조직 도메인 내부만** — 외부는 Unknown, 6명+ 그리드 가독성↓, 근무시간 외 룸 미표시 |
| **되는시간** (whattime.co.kr, KR) | Google/Outlook/iCloud/네이버 연동 + Zoom/Meet 자동 | 캘린더 기반 | 명시 근거 없음 `[관찰 한계]` | 없음 | 강도·역할·솔직함 차별 근거 미확인 — 추가 조사 필요 |
| **모두의 시간** (modutime.site, KR) | "쉽고 빠른 약속시간 정하기" | 상세 미확인 `[관찰 한계]` | 미확인 | 미확인 | 기능 상세는 추가 조사 필요 |

**종합:** 시장은 두 갈래다 — (A) 폴링형(when2meet/Doodle/되는시간): 외부 참석자에 강하나 **역할 구분 없음**, (B) 캘린더형(Outlook): 역할 구분 있으나 **조직 내부 한정**. **세 빈틈(강도·역할·솔직함)을 한 제품에서 동시에 푸는 도구는 확인되지 않았다** `[관찰: 부재 확인]`. 이것이 0→1의 진입 근거다 `[해석]`.

---

## Recommendations

> Researcher의 권고는 PM의 결정 입력값이다. 우선순위 확정은 PM이 한다.

1. **[높음] 차별 축을 "강도·역할·솔직함" 세 빈틈에 집중하라.** 기본 폴링(겹치는 시간 찾기)은 commodity이므로 빠르게 패리티만 확보하고, 변별력은 세 빈틈에서 만든다 `[해석, Theme 1·2·3·4]`.
2. **[높음] 선호 강도 입력 모델을 0→1 핵심으로 검토하라.** Doodle 3단계(if-need-be)가 시장이 검증한 출발점. 그 위에 "부정적 강도(avoid/hard-no)"를 더하는 게 빈틈 `[I1]`.
3. **[높음] 필수/선택 역할을 일정 산정 로직에 반영하라.** 필수=hard 제약, 선택=가중치. 단, Outlook과 달리 외부 참석자 개방성을 유지(계정 불필요) `[I2, Theme 3]`.
4. **[중간] 선택 참석자의 솔직함을 보호하는 비공개 신호 설계를 검토하라.** 응답 비노출 + "당신 없이도 회의 성립" 안심 장치. 강도·역할과 결합돼야 작동 `[I3, Theme 4]`.
5. **[중간] 모바일 초경량 응답 + 미응답 리마인더를 토대 기능으로.** 차별 기능이 작동하려면 응답 마찰이 극히 낮아야 함 `[I5, Theme 5]`.
6. **[낮음] 사정/맥락 코멘트를 슬롯 응답에 첨부**해 메신저로 새는 정보를 한곳에 모으기 `[I4]`.

---

## Questions for Further Research

- 선택 참석자가 실제로 어느 정도, 어떤 상황에서 부정직하게 응답하는가 — 일정 조율 맥락의 1차 데이터 부재 (사회적 바람직성 편향은 일반론일 뿐) `[추정 검증 필요]`
- 강도 단계 수의 적정 해상도 — 3단계(Doodle) vs 4단계(prefer/ok/avoid/no) vs 슬라이더. 변별력과 입력 부담의 트레이드오프 (사용성 테스트 필요)
- 되는시간·모두의 시간의 강도/역할 처리 상세 — 한국 시장 직접 경쟁자이므로 실제 앱 사용 기반 추가 조사 권장
- 6명+ 다인원에서 강도+역할 정보를 주최자가 한눈에 보는 시각화 방식 (디자이너 단계 연계)
- 타겟 환경(사내 회의 vs 외부 미팅 vs 동호회·스터디)에 따라 세 빈틈의 우선순위가 달라지는지 — PM 페르소나 정의 시 결정 필요

---

## Methodology Notes

**수행 방법:** 1차 사용자 데이터(인터뷰·설문·티켓) 및 페르소나가 **없는 상태**에서, 경쟁/유사 서비스 6종의 공개 문서·비교 리뷰·기능 명세 + 도메인 분석 + 웹 검색으로 종합. research-synthesis 스킬 형식 준수.

**한계 (반드시 PM에 전달):**
- **1차 사용자 데이터 부재** — 모든 사용자 행동 주장(특히 Theme 4의 "솔직함" 문제)은 input 문제 정의 + 도메인 추론 기반 `[추정]`. 사용성 테스트/인터뷰로 검증 전까지 사실로 확정 금지.
- **페르소나 부재** — User Segments는 도메인 추론으로 도출. PM이 PRD에서 페르소나를 정의할 때 본 세그먼트를 기초 자료로 활용하되, 검증 대상으로 취급.
- **사회적 바람직성 편향의 일정 조율 적용은 추정** — 학술 근거는 일반 설문 맥락. 일정 조율 직접 연구는 검색되지 않음.
- **한국 경쟁자(되는시간·모두의 시간) 기능 상세 미확인** — 강도/역할/솔직함 처리 여부를 공개 문서로 충분히 확인 못 함. `[관찰 한계]`로 표기, 추가 조사 권장.
- **memory_context 비어 있음** — flowtime 첫 프로젝트로 누적 기억(decisions/conventions) 없음. 반영할 기존 판단 없이 진행.
- 웹 검색은 US 결과 위주. 한국 시장 심층은 제한적.

**관찰/해석 분리 원칙 적용:** 모든 주장에 `[관찰]`/`[해석]`/`[추정]` 등급 표기. 경쟁 도구 기능은 출처와 함께 `[관찰]`로만 기재.

---

### Sources
- [20 Best Group Scheduling Tools 2026 (usecarly)](https://www.usecarly.com/blog/group-scheduling-tools/)
- [Doodle vs When2meet (koalendar)](https://koalendar.com/scheduling-software-comparison/doodle-vs-when2meet)
- [Doodle v Calendly Group Polls (doodle.com)](https://doodle.com/en/doodle-v-calendly-the-group-polls-comparison/)
- [Calendly vs Doodle (zapier)](https://zapier.com/blog/calendly-vs-doodle/)
- [Doodle Poll Guide — "if necessary" weighting (whocan.org)](https://www.whocan.org/en/blog/doodle-guide/)
- [Outlook Scheduling Assistant & limitations (calendarbridge)](https://calendarbridge.com/blog/how-to-use-outlook-scheduling-assistant/)
- [Use Scheduling Assistant & Room Finder (Microsoft Support)](https://support.microsoft.com/en-us/office/use-the-scheduling-assistant-and-room-finder-for-meetings-in-outlook-2e00ac07-cef1-47c8-9b99-77372434d3fa)
- [되는시간 (whattime.co.kr)](https://whattime.co.kr/)
- [모두의 시간 (modutime.site)](https://modutime.site/)
- [Social-desirability bias (Wikipedia)](https://en.wikipedia.org/wiki/Social-desirability_bias)
- [Social Desirability Bias in Voter Turnout (Stanford)](https://web.stanford.edu/dept/communication/faculty/krosnick/Turnout%20Overreporting%20-%20ICT%20Only%20-%20Final.pdf)
