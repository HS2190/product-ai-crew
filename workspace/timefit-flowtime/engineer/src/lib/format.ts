/* 날짜/시각 포맷 — mono tabular 표시용 (design-spec §1.3 --t-meta) */

const WD = ["일", "월", "화", "수", "목", "금", "토"];

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

/** "6/30(월) 14:00–15:00" */
export function formatSlotRange(startISO: string, endISO: string): string {
  const s = new Date(startISO);
  const e = new Date(endISO);
  const date = `${s.getMonth() + 1}/${s.getDate()}(${WD[s.getDay()]})`;
  const time = `${pad(s.getHours())}:${pad(s.getMinutes())}–${pad(e.getHours())}:${pad(e.getMinutes())}`;
  return `${date} ${time}`;
}

/** "6/30 14:00" 짧은 형태 (대시보드 카드 제목) */
export function formatSlotShort(startISO: string): string {
  const s = new Date(startISO);
  return `${s.getMonth() + 1}/${s.getDate()} ${pad(s.getHours())}:${pad(s.getMinutes())}`;
}

/** 부호 유지 점수 표기 "+9" / "-3" */
export function formatScore(n: number): string {
  return n > 0 ? `+${n}` : `${n}`;
}
