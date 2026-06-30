/* C-10 PendingAttendeeList + ReminderBadge(mock).
   [리마인드] 탭 → 즉시 "리마인드 보냄(데모)" 배지. 실발송 없음. */
import { useState } from "react";
import type { Attendee } from "../data/types";
import { Button } from "./Button";
import { ReminderSentBadge } from "./Badge";
import styles from "./PendingAttendeeList.module.css";

export function PendingAttendeeList({ pending }: { pending: Attendee[] }) {
  const [sent, setSent] = useState<Record<string, boolean>>({});

  if (pending.length === 0) {
    return <p className={styles.allDone}>모든 참석자가 응답했어요</p>;
  }

  return (
    <ul className={styles.list}>
      {pending.map((a) => (
        <li key={a.id} className={styles.row}>
          <span className={styles.name}>
            <span className={styles.dot} aria-hidden="true" />
            {a.name}
          </span>
          {sent[a.id] ? (
            <ReminderSentBadge />
          ) : (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setSent((s) => ({ ...s, [a.id]: true }))}
            >
              리마인드
            </Button>
          )}
        </li>
      ))}
    </ul>
  );
}
