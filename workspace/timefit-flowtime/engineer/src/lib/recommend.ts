/* =========================================================================
   추천 로직 — screen-plan §0.3 단일 확정 규칙 (순수 함수, 무작위 0)
   flowtime decisions(2026-06-29, 2026-06-30):
   · 제외(자격 박탈)는 단 하나의 조건: 필수 참석자의 softHard==hard.
     → weight 합산이 아니라 '제외 플래그'로 분기한다.
   · 그 외 모든 부정 강도(필수 soft / 선택 hard / 선택 soft)는 weight 감점.
   · tie-break: 필수 prefer 수 → 미응답 적은 순 → 시작시각 → 생성순(인덱스, 최종 결정자).
   동일 입력 → 동일 출력 (NFR-004).
   ========================================================================= */

import type { Attendee, Meeting, Response, Slot } from "../data/types";
import { scaleById, type IntensityId } from "../data/intensityScale";

export interface SlotAggregate {
  slot: Slot;
  /** 강도별 응답 건수 (분포막대용 — weight 아님) */
  counts: Record<IntensityId, number>;
  /** 필수/선택 그룹별 강도 건수 (분포막대 2줄 구분, 익명성 임계) */
  requiredCounts: Record<IntensityId, number>;
  optionalCounts: Record<IntensityId, number>;
  /** 응답한 선택 참석자 수 (최소 익명성 임계 판단) */
  optionalRespondents: number;
  requiredRespondents: number;
  /** 추천 점수 = weight 합산 (STEP2). 제외 슬롯은 표시하지 않음 */
  score: number;
  /** 제외 여부 (STEP1: 필수 hard 1건 이상) */
  excluded: boolean;
  /** 제외 사유 (제외일 때만) — 필수 hard-no 인원 수 */
  excludedRequiredCount: number;
  /** 필수 충족: 필수 중 부정(avoid/hard-no)이 아닌 응답 수 / 필수 응답 수 */
  requiredMet: number;
  requiredResponded: number;
  /** tie-break 보조값 */
  requiredPreferCount: number;
  pendingCount: number; // 미응답 인원 (전체 참석자 - 응답자)
}

const emptyCounts = (): Record<IntensityId, number> => ({
  prefer: 0,
  ok: 0,
  avoid: 0,
  "hard-no": 0,
});

function responsesForSlot(meeting: Meeting, slotId: string): Response[] {
  return meeting.responses.filter((r) => r.slotId === slotId);
}

function attendeeMap(attendees: Attendee[]): Map<string, Attendee> {
  return new Map(attendees.map((a) => [a.id, a]));
}

/** 한 슬롯 집계 (STEP1·STEP2 + 분포·충족 계산) */
export function aggregateSlot(meeting: Meeting, slot: Slot): SlotAggregate {
  const amap = attendeeMap(meeting.attendees);
  const slotResponses = responsesForSlot(meeting, slot.id);

  const counts = emptyCounts();
  const requiredCounts = emptyCounts();
  const optionalCounts = emptyCounts();

  let score = 0;
  let excludedRequiredCount = 0;
  let requiredMet = 0;
  let requiredResponded = 0;
  let requiredPreferCount = 0;
  let optionalRespondents = 0;
  let requiredRespondents = 0;

  for (const r of slotResponses) {
    const attendee = amap.get(r.attendeeId);
    if (!attendee) continue;
    const item = scaleById(r.intensity);

    counts[r.intensity] += 1;
    score += item.weight; // STEP2: weight 합산

    const isRequired = attendee.role === "required";
    if (isRequired) {
      requiredCounts[r.intensity] += 1;
      requiredResponded += 1;
      requiredRespondents += 1;
      if (item.id === "prefer") requiredPreferCount += 1;
      if (item.polarity !== "-") requiredMet += 1; // 부정 아님 = 충족
      // STEP1: 필수 + hard → 제외 플래그
      if (item.softHard === "hard") excludedRequiredCount += 1;
    } else {
      optionalCounts[r.intensity] += 1;
      optionalRespondents += 1;
    }
  }

  const respondedIds = new Set(slotResponses.map((r) => r.attendeeId));
  const pendingCount = meeting.attendees.filter((a) => !respondedIds.has(a.id)).length;

  return {
    slot,
    counts,
    requiredCounts,
    optionalCounts,
    optionalRespondents,
    requiredRespondents,
    score,
    excluded: excludedRequiredCount > 0,
    excludedRequiredCount,
    requiredMet,
    requiredResponded,
    requiredPreferCount,
    pendingCount,
  };
}

/** STEP3 결정적 비교자 (점수 내림차순 + 고정 tie-break) */
function compareSlots(a: SlotAggregate, b: SlotAggregate): number {
  // 1차: 점수 내림차순
  if (b.score !== a.score) return b.score - a.score;
  // tie 1: 필수 prefer 수 많은 순
  if (b.requiredPreferCount !== a.requiredPreferCount)
    return b.requiredPreferCount - a.requiredPreferCount;
  // tie 2: 미응답 적은 순
  if (a.pendingCount !== b.pendingCount) return a.pendingCount - b.pendingCount;
  // tie 3: 시작시각 빠른 순
  const ta = new Date(a.slot.start).getTime();
  const tb = new Date(b.slot.start).getTime();
  if (ta !== tb) return ta - tb;
  // tie 4: 생성순(인덱스) 빠른 순 — 최종 결정자(완전 결정성)
  return a.slot.order - b.slot.order;
}

export interface RecommendationResult {
  recommended: SlotAggregate[]; // 제외 안 된 슬롯, 점수순 정렬
  excluded: SlotAggregate[]; // 제외 슬롯 (생성순 유지)
  /** 필수 응답이 0인가 (잠정 추천 플래그) */
  tentative: boolean;
  /** 모든 슬롯이 제외됐는가 (전원 불가) */
  allExcluded: boolean;
  /** 응답이 하나도 없는가 */
  noResponses: boolean;
}

/** 전체 추천 계산 — 순수 함수. 동일 meeting → 동일 결과. */
export function recommend(meeting: Meeting): RecommendationResult {
  const aggregates = meeting.slots.map((s) => aggregateSlot(meeting, s));

  const recommended = aggregates
    .filter((a) => !a.excluded)
    .sort(compareSlots); // 정렬 안정성은 compareSlots 최종자(order)가 보장

  const excluded = aggregates
    .filter((a) => a.excluded)
    .sort((a, b) => a.slot.order - b.slot.order);

  const requiredResponseCount = recommended.reduce(
    (n, a) => n + a.requiredResponded,
    0
  );

  return {
    recommended,
    excluded,
    tentative: requiredResponseCount === 0 && recommended.length > 0,
    allExcluded: aggregates.length > 0 && recommended.length === 0,
    noResponses: meeting.responses.length === 0,
  };
}

/** 시간순 정렬(표시 순서만 — 점수 계산 불변) */
export function sortByTime(slots: SlotAggregate[]): SlotAggregate[] {
  return [...slots].sort((a, b) => {
    const ta = new Date(a.slot.start).getTime();
    const tb = new Date(b.slot.start).getTime();
    if (ta !== tb) return ta - tb;
    return a.slot.order - b.slot.order;
  });
}
