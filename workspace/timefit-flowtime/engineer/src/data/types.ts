// 도메인 타입 — mock/정적 데이터용. 백엔드·API 없음.

export type Role = "required" | "optional" | "unspecified";

export interface Slot {
  id: string;
  /** 표시용 날짜 라벨 (예: "2/3(월)") */
  date: string;
  /** 시작 시각 "HH:MM" */
  start: string;
  /** 종료 시각 "HH:MM" */
  end: string;
  /** 결정적 정렬 tie-break ③ 용 — 분 단위 절대 시작 시각 (작을수록 빠름) */
  startMinutes: number;
}

export interface Attendee {
  id: string;
  name: string;
  role: Role;
}

/** 한 참석자가 한 슬롯에 남긴 강도 응답. value=null은 무응답. */
export type ResponseMap = Record<string, Record<string, string | null>>;
// ResponseMap[attendeeId][slotId] = intensityId | null

export interface Meeting {
  id: string;
  title: string;
  organizerName: string;
  periodLabel: string;
  /** 마감까지 남은 일수 (mock) */
  deadlineDays: number;
  slots: Slot[];
  attendees: Attendee[];
}
