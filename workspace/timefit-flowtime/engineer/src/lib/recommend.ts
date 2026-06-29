/**
 * 추천 엔진 — 순수 함수, 결정적(deterministic). 무작위 요소 없음.
 *
 * 정본: screen-plan §0.3, flowtime decisions, Reviewer 인계노트 1.
 *
 * 핵심 규칙:
 *  1) 제외(excluded)는 *필수 참석자(required)의 hard-no만* 발동한다.
 *     → hard-no는 weight 합산이 아니라 **제외 플래그로 분기**한다(인계노트 1).
 *     필수 1명이라도 hard-no면 슬롯 excluded=true. 추천 후보에서 빠지고 리스트 최하단.
 *  2) 그 외 모든 부정 강도(필수 soft=avoid, 선택 hard-no, 선택 soft)는 *전부 감점*하고 후보 유지.
 *     선택 참석자가 전원 불가여도 회의는 성립(빠져도 됨).
 *  3) 점수 = 응답된 강도의 weight 합 (무응답은 0, 점수에 영향 없음).
 *  4) 동률 tie-break 고정 순서(무작위 없음):
 *       ① 필수 prefer 수 많은 순
 *       ② 미응답 적은 순
 *       ③ 슬롯 시작시각 빠른 순 (최종 안정 정렬 키)
 *
 * 집계 막대(IntensityDistributionBar)는 이 점수와 무관하다 — 건수 분포는 buildCounts()가 따로 만든다.
 */

import type { IntensityItem } from "../data/intensityScale";
import type { Attendee, ResponseMap, Slot } from "../data/types";

export interface ScoredSlot {
  slot: Slot;
  /** weight 합산 점수 (제외 슬롯도 참고용으로 계산해 둠) */
  score: number;
  /** 필수 참석자 hard-no가 1명이라도 있으면 true → 후보 제외 */
  excluded: boolean;
  /** 제외 사유: 불가 표시한 필수 인원 수 */
  requiredBlockedCount: number;
  /** 필수 충족: 불가(hard-no) 아닌 필수 인원 수 / 전체 필수 수 */
  requiredAvailable: number;
  requiredTotal: number;
  /** tie-break ① — 필수 참석자가 prefer로 응답한 수 */
  requiredPreferCount: number;
  /** tie-break ② — 무응답(전체 참석자 기준) 수 */
  unansweredCount: number;
}

interface Ctx {
  scale: IntensityItem[];
  weightOf: Record<string, number>;
  item: Record<string, IntensityItem>;
}

function scoreSlot(
  slot: Slot,
  attendees: Attendee[],
  responses: ResponseMap,
  ctx: Ctx
): ScoredSlot {
  let score = 0;
  let requiredBlockedCount = 0;
  let requiredPreferCount = 0;
  let unansweredCount = 0;

  const requiredTotal = attendees.filter((a) => a.role === "required").length;
  let requiredAvailable = requiredTotal;

  for (const a of attendees) {
    const value = responses[a.id]?.[slot.id] ?? null;
    if (value === null) {
      unansweredCount += 1;
      continue; // 무응답은 점수 영향 없음
    }
    const it = ctx.item[value];
    if (!it) continue;

    // 점수: 모든 응답 강도의 weight 합 (제외와 별개로 누적)
    score += ctx.weightOf[value] ?? 0;

    if (a.role === "required") {
      if (it.hardExclude) {
        // 필수 참석자 hard-no → 제외 분기 (weight 합산이 아니라 플래그)
        requiredBlockedCount += 1;
        requiredAvailable -= 1;
      }
      if (it.id === "prefer") requiredPreferCount += 1;
    }
    // 선택 참석자 hard-no는 제외하지 않음 — weight 감점(score)에만 반영됨(위에서 처리)
  }

  return {
    slot,
    score,
    excluded: requiredBlockedCount > 0,
    requiredBlockedCount,
    requiredAvailable,
    requiredTotal,
    requiredPreferCount,
    unansweredCount,
  };
}

/**
 * 결정적 비교자. 후보끼리: 점수 내림차순 → tie-break ①②③.
 * 제외 슬롯은 항상 후보 뒤로(리스트 최하단 구획).
 */
function compareScored(a: ScoredSlot, b: ScoredSlot): number {
  // 제외는 항상 뒤로
  if (a.excluded !== b.excluded) return a.excluded ? 1 : -1;

  // 점수 내림차순
  if (b.score !== a.score) return b.score - a.score;
  // ① 필수 prefer 수 많은 순
  if (b.requiredPreferCount !== a.requiredPreferCount)
    return b.requiredPreferCount - a.requiredPreferCount;
  // ② 미응답 적은 순
  if (a.unansweredCount !== b.unansweredCount)
    return a.unansweredCount - b.unansweredCount;
  // ③ 시작시각 빠른 순 (최종 안정 키 — 항상 유일하게 결정됨)
  return a.slot.startMinutes - b.slot.startMinutes;
}

export interface RecommendResult {
  /** 정렬 완료된 전체 슬롯(후보 점수순 → 제외 슬롯). */
  ranked: ScoredSlot[];
  /** 제외되지 않은 후보만 */
  candidates: ScoredSlot[];
  /** 제외 슬롯만 */
  excluded: ScoredSlot[];
}

export function recommend(
  slots: Slot[],
  attendees: Attendee[],
  responses: ResponseMap,
  scale: IntensityItem[]
): RecommendResult {
  const ctx: Ctx = {
    scale,
    weightOf: Object.fromEntries(scale.map((i) => [i.id, i.weight])),
    item: Object.fromEntries(scale.map((i) => [i.id, i])),
  };

  const scored = slots.map((s) => scoreSlot(s, attendees, responses, ctx));
  const ranked = [...scored].sort(compareScored);

  return {
    ranked,
    candidates: ranked.filter((s) => !s.excluded),
    excluded: ranked.filter((s) => s.excluded),
  };
}

/** 시간순 정렬(정렬 토글 '시간순'). 점수 계산은 불변 — 표시 순서만 바뀐다(§3.1). */
export function sortByTime(ranked: ScoredSlot[]): ScoredSlot[] {
  return [...ranked].sort((a, b) => a.slot.startMinutes - b.slot.startMinutes);
}

/**
 * 집계 막대용 건수 분포(§3.4). 추천 weight와 무관 — *건수만* 센다.
 * hard-no도 "건수 1"로 쌓인다(제외 신호를 막대에 넣지 않음).
 */
export function buildCounts(
  slotId: string,
  attendees: Attendee[],
  responses: ResponseMap,
  role: "required" | "optional"
): { counts: Record<string, number>; total: number } {
  const counts: Record<string, number> = {};
  let total = 0;
  for (const a of attendees) {
    if (a.role !== role) continue;
    const value = responses[a.id]?.[slotId] ?? null;
    if (value === null) continue;
    counts[value] = (counts[value] ?? 0) + 1;
    total += 1;
  }
  return { counts, total };
}
