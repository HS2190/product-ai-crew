// Mock 시나리오 — 9명(필수 5 + 선택 4), 6 후보 슬롯.
// 페르소나의 우민지(선택)·김도현(주최자)·박서준(필수)을 반영.
// 추천 엔진의 모든 분기를 자극하도록 설계:
//   - SLOT-1: 필수 전원 가능 + 선호 다수 → 최상위 후보
//   - SLOT-2: 무난한 후보
//   - SLOT-3: 선택 참석자 hard-no 다수 → 감점되지만 후보 유지(제외 아님)
//   - SLOT-4: 선택 참석자 1명만 응답 → 익명성 임계(분포 숨김, anonymizeBelow=2)
//   - SLOT-5: 필수 1명 hard-no → 제외(excluded)
//   - SLOT-6: 필수 avoid 섞임 → 감점 후보

import type { Attendee, Meeting, ResponseMap, Slot } from "./types";

export const slots: Slot[] = [
  { id: "s1", date: "2/3(월)", start: "14:00", end: "15:00", startMinutes: 3 * 24 * 60 + 14 * 60 },
  { id: "s2", date: "2/4(화)", start: "10:00", end: "11:00", startMinutes: 4 * 24 * 60 + 10 * 60 },
  { id: "s3", date: "2/4(화)", start: "16:00", end: "17:00", startMinutes: 4 * 24 * 60 + 16 * 60 },
  { id: "s4", date: "2/5(수)", start: "11:00", end: "12:00", startMinutes: 5 * 24 * 60 + 11 * 60 },
  { id: "s5", date: "2/5(수)", start: "09:00", end: "10:00", startMinutes: 5 * 24 * 60 + 9 * 60 },
  { id: "s6", date: "2/6(목)", start: "15:00", end: "16:00", startMinutes: 6 * 24 * 60 + 15 * 60 },
];

export const attendees: Attendee[] = [
  // 필수 5명
  { id: "a1", name: "김도현", role: "required" }, // 주최자 본인도 참석
  { id: "a2", name: "박서준", role: "required" },
  { id: "a3", name: "이서연", role: "required" },
  { id: "a4", name: "정민준", role: "required" },
  { id: "a5", name: "한지우", role: "required" },
  // 선택 4명
  { id: "o1", name: "우민지", role: "optional" }, // ★ 핵심 타겟
  { id: "o2", name: "강예린", role: "optional" },
  { id: "o3", name: "조현우", role: "optional" },
  { id: "o4", name: "윤채원", role: "optional" },
];

// 응답 — 9명 중 7명 응답, 2명 미응답(o3, a5는 일부 슬롯 미응답으로 표현).
// value=null 또는 키 부재 = 무응답.
export const responses: ResponseMap = {
  // 필수
  a1: { s1: "prefer", s2: "ok", s3: "ok", s4: "ok", s5: "ok", s6: "avoid" },
  a2: { s1: "prefer", s2: "prefer", s3: "avoid", s4: "ok", s5: "ok", s6: "ok" },
  a3: { s1: "ok", s2: "ok", s3: "ok", s4: "prefer", s5: "hard-no", s6: "ok" },
  a4: { s1: "prefer", s2: "ok", s3: "ok", s4: "ok", s5: "ok", s6: "avoid" },
  a5: { s1: "ok", s2: "prefer", s3: "ok", s4: null, s5: "ok", s6: "ok" },
  // 선택
  o1: { s1: "ok", s2: "avoid", s3: "hard-no", s4: "ok", s5: "ok", s6: "prefer" }, // 우민지: 솔직히 회피/불가 사용
  o2: { s1: "prefer", s2: "ok", s3: "hard-no", s4: null, s5: "prefer", s6: "ok" },
  o3: { s1: null, s2: null, s3: null, s4: null, s5: null, s6: null }, // 전체 미응답
  o4: { s1: "ok", s2: "ok", s3: "avoid", s4: null, s5: "ok", s6: "avoid" },
};
// 주: s4의 선택 응답은 o1 한 명만(o2·o4 null) → 선택 분포 익명성 임계(1명) → 분포 숨김.

export const meeting: Meeting = {
  id: "m1",
  title: "4월 팀 정기 회의",
  organizerName: "김도현",
  periodLabel: "2/3(월) – 2/6(목)",
  deadlineDays: 2,
  slots,
  attendees,
};

// 참석자 응답 화면 데모용 — 우민지(선택) 관점으로 응답하는 빈 폼 시작.
export const respondentDemo = {
  attendee: attendees.find((a) => a.id === "o1")!, // 우민지 = optional
  meeting,
};
