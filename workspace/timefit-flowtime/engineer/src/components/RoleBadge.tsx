// RoleBadge (component-spec §2) — 역할(필수/선택)을 색+라벨+아이콘으로. 비대화형 라벨.
import type { Role } from "../data/types";

const MAP: Record<Role, { label: string; icon: string; bg: string; fg: string }> = {
  required: { label: "필수 참석자", icon: "★", bg: "var(--c-brand-soft)", fg: "var(--c-brand-strong)" },
  optional: { label: "선택 참석자", icon: "○", bg: "var(--c-surface-sunken)", fg: "var(--c-ink-soft)" },
  unspecified: { label: "참석자", icon: "○", bg: "var(--c-surface-sunken)", fg: "var(--c-ink-soft)" },
};

export function RoleBadge({ role }: { role: Role }) {
  const m = MAP[role];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 10px",
        borderRadius: "var(--r-full)",
        background: m.bg,
        color: m.fg,
        font: "var(--t-label)",
        fontWeight: 600,
      }}
    >
      <span aria-hidden="true">{m.icon}</span>
      {m.label}
    </span>
  );
}
