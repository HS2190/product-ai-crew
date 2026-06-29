// RequiredFulfillmentTag (component-spec §12) — 필수 인원 충족 결과.
// fulfilled(전원 가능) / partial(일부, 중립 회색 — 경고 아님) / blocked(필수 불가, 황토).
import { CheckIcon } from "./icons";

interface Props {
  required: number;
  available: number;
  blocked?: boolean;
  blockedCount?: number;
}

export function RequiredFulfillmentTag({ required, available, blocked, blockedCount = 0 }: Props) {
  if (blocked) {
    return (
      <span style={tag("transparent", "var(--s-warning)")} >
        <span aria-hidden="true">⊘</span> 필수 {blockedCount}명이 불가한 시간
      </span>
    );
  }
  const fulfilled = available >= required;
  if (fulfilled) {
    return (
      <span style={{ ...tag("var(--c-brand-soft)", "var(--c-brand-strong)"), border: "none" }}>
        <CheckIcon size={15} color="var(--c-brand-strong)" />
        <span className="tnum">필수 {available}/{required} 가능</span>
      </span>
    );
  }
  // partial — 중립 회색(경고색 아님, 아직 후보)
  return (
    <span style={{ ...tag("var(--c-surface-sunken)", "var(--c-ink-soft)"), border: "none" }}>
      <span aria-hidden="true">◐</span>
      <span className="tnum">필수 {available}/{required} 가능</span>
    </span>
  );
}

function tag(bg: string, fg: string): React.CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    padding: "4px 10px",
    borderRadius: "var(--r-sm)",
    background: bg,
    color: fg,
    border: `1px solid ${fg}`,
    font: "var(--t-label)",
    fontWeight: 600,
  };
}
