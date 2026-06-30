import type { Meeting } from "./types";

/* =========================================================================
   Mock 시나리오 — "4분기 기획 킥오프", 참석자 9명 (필수 5 / 선택 4).
   우민지 = 선택 참석자(솔직함 보호 대상)로 포함. 응답 8/9 (정민호 미응답).
   슬롯 5개. 한 슬롯(S5)은 필수 1명 hard-no → 제외 시나리오 검증.
   한 슬롯(S4)은 선택 응답 1명만 → 최소 익명성 임계 검증.
   백엔드 없음 — 전부 정적.
   ========================================================================= */

export const mockMeeting: Meeting = {
  id: "m-q4-kickoff",
  title: "4분기 기획 킥오프",
  deadlineLabel: "D-1",
  attendees: [
    // 필수 5
    { id: "a1", name: "김도현", role: "required" }, // 주최자 겸 필수
    { id: "a2", name: "박서준", role: "required" },
    { id: "a3", name: "이서연", role: "required" },
    { id: "a4", name: "최유나", role: "required" },
    { id: "a5", name: "정민호", role: "required" }, // 미응답
    // 선택 4
    { id: "a6", name: "우민지", role: "optional" }, // 솔직함 보호 페르소나
    { id: "a7", name: "한지우", role: "optional" },
    { id: "a8", name: "오세훈", role: "optional" },
    { id: "a9", name: "강예린", role: "optional" },
  ],
  slots: [
    { id: "s1", order: 0, start: "2026-06-30T14:00:00", end: "2026-06-30T15:00:00" },
    { id: "s2", order: 1, start: "2026-06-30T16:00:00", end: "2026-06-30T17:00:00" },
    { id: "s3", order: 2, start: "2026-07-01T10:00:00", end: "2026-07-01T11:00:00" },
    { id: "s4", order: 3, start: "2026-07-01T14:00:00", end: "2026-07-01T15:00:00" },
    { id: "s5", order: 4, start: "2026-07-02T09:00:00", end: "2026-07-02T10:00:00" },
  ],
  responses: [
    // ---- S1 (6/30 14:00): 강한 후보. 필수 prefer 多 ----
    { attendeeId: "a1", slotId: "s1", intensity: "prefer" },
    { attendeeId: "a2", slotId: "s1", intensity: "prefer" },
    { attendeeId: "a3", slotId: "s1", intensity: "prefer" },
    { attendeeId: "a4", slotId: "s1", intensity: "ok" },
    { attendeeId: "a6", slotId: "s1", intensity: "prefer", comment: "이 시간이 가장 좋아요" },
    { attendeeId: "a7", slotId: "s1", intensity: "ok" },
    { attendeeId: "a8", slotId: "s1", intensity: "prefer" },

    // ---- S2 (6/30 16:00): 점수는 S1과 동률 유도, tie-break로 갈림 ----
    { attendeeId: "a1", slotId: "s2", intensity: "prefer" },
    { attendeeId: "a2", slotId: "s2", intensity: "ok" },
    { attendeeId: "a3", slotId: "s2", intensity: "prefer" },
    { attendeeId: "a4", slotId: "s2", intensity: "prefer" },
    { attendeeId: "a6", slotId: "s2", intensity: "ok", comment: "오후 늦게는 집중이 좀 떨어져요" },
    { attendeeId: "a7", slotId: "s2", intensity: "prefer" },
    { attendeeId: "a8", slotId: "s2", intensity: "ok" },
    { attendeeId: "a9", slotId: "s2", intensity: "prefer" },

    // ---- S3 (7/1 10:00): 필수 soft 부정 섞임 → 본문에 남되 감점 ----
    { attendeeId: "a1", slotId: "s3", intensity: "ok" },
    { attendeeId: "a2", slotId: "s3", intensity: "avoid" }, // 필수 soft 부정 = 감점(제외 아님)
    { attendeeId: "a3", slotId: "s3", intensity: "prefer" },
    { attendeeId: "a4", slotId: "s3", intensity: "ok" },
    { attendeeId: "a6", slotId: "s3", intensity: "avoid" },
    { attendeeId: "a8", slotId: "s3", intensity: "ok" },

    // ---- S4 (7/1 14:00): 선택 1명(우민지)만 응답 → 최소 익명성 임계 발동 ----
    { attendeeId: "a6", slotId: "s4", intensity: "avoid", comment: "그날 오후엔 외근이 있어요" },

    // ---- S5 (7/2 09:00): 필수(이서연) 1명 hard-no → 슬롯 제외 ----
    { attendeeId: "a1", slotId: "s5", intensity: "ok" },
    { attendeeId: "a3", slotId: "s5", intensity: "hard-no" }, // 필수 hard = 제외 트리거
    { attendeeId: "a7", slotId: "s5", intensity: "prefer" },
    { attendeeId: "a8", slotId: "s5", intensity: "ok" },
  ],
};
