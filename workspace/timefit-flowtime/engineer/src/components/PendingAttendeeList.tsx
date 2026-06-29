// PendingAttendeeList + ReminderBadge (component-spec §10) — 미응답 현황 + 리마인드(mock).
// 비공개 일관: 응답 여부만 표시. 선택 참석자의 강도/불참은 개인 단위 노출 금지.
import type { Attendee } from "../data/types";
import { RoleBadge } from "./RoleBadge";

interface Props {
  pending: Attendee[];
  reminded: Set<string>;
  onRemind: (id: string) => void;
}

export function PendingAttendeeList({ pending, reminded, onRemind }: Props) {
  if (pending.length === 0) {
    return (
      <p style={{ font: "var(--t-body)", color: "var(--c-ink-soft)", margin: 0 }}>
        모두 응답했어요
      </p>
    );
  }
  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "var(--sp-2)" }}>
      {pending.map((a) => {
        const sent = reminded.has(a.id);
        return (
          <li
            key={a.id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "var(--sp-3)",
              padding: "8px 12px",
              borderRadius: "var(--r-sm)",
              background: "var(--c-surface)",
              border: "var(--border-hairline)",
            }}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <span style={{ font: "var(--t-body)" }}>{a.name}</span>
              <RoleBadge role={a.role} />
            </span>
            {sent ? (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5, font: "var(--t-caption)", color: "var(--s-info)" }}>
                알림 보냄 (데모)
              </span>
            ) : (
              <button
                type="button"
                onClick={() => onRemind(a.id)}
                style={{
                  minHeight: 36,
                  padding: "0 12px",
                  borderRadius: "var(--r-sm)",
                  border: "1px solid var(--c-hairline)",
                  background: "transparent",
                  color: "var(--c-brand)",
                  font: "var(--t-label)",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                알림 보내기
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );
}
