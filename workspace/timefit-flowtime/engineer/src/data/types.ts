import type { IntensityId } from "./intensityScale";

export type AttendeeRole = "required" | "optional";

export interface Attendee {
  id: string;
  name: string;
  role: AttendeeRole;
}

export interface Slot {
  id: string;
  /** 생성 순서(인덱스) — tie-break STEP4 최종 결정자 (decisions 2026-06-30) */
  order: number;
  start: string; // ISO
  end: string; // ISO
}

/** 한 참석자가 한 슬롯에 남긴 응답 */
export interface Response {
  attendeeId: string;
  slotId: string;
  intensity: IntensityId;
  comment?: string;
}

export interface Meeting {
  id: string;
  title: string;
  deadlineLabel: string; // "D-1" 등 (mock)
  attendees: Attendee[];
  slots: Slot[];
  responses: Response[];
}
