/* C-04 RoleBadge + 공용 상태 배지(rank-1 / excluded / reminder-sent).
   pill = 배지 전용(--radius-pill). 1 컴포넌트 + variant. */
import styles from "./Badge.module.css";

export function RoleBadge({ role }: { role: "required" | "optional" }) {
  return (
    <span className={styles.badge} data-kind="role" data-role={role}>
      {role === "required" ? "필수 참석자" : "선택 참석자"}
    </span>
  );
}

/** 추천 1순위/일반 순위 배지 (C-08 SlotScoreBadge의 순위 부분) */
export function RankBadge({ rank }: { rank: number }) {
  const circled = ["①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨"];
  return (
    <span className={styles.badge} data-kind="rank" data-rank1={rank === 1}>
      {circled[rank - 1] ?? `${rank}`}
    </span>
  );
}

/** 제외 배지 — 황토. "제외" 2자 (copy-sheet) */
export function ExcludedBadge() {
  return (
    <span className={styles.badge} data-kind="excluded">
      제외
    </span>
  );
}

/** 리마인드 보냄(데모) — mock 명시 */
export function ReminderSentBadge() {
  return (
    <span className={styles.badge} data-kind="reminder">
      리마인드 보냄(데모)
    </span>
  );
}
