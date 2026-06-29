// Toast (component-spec §15) — 인라인 피드백. info/error(황토). 입력값 보존(상태 외부 관리).
interface Props {
  message: string;
  tone?: "info" | "error";
}

export function Toast({ message, tone = "info" }: Props) {
  return (
    <div
      role="status"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "12px 16px",
        borderRadius: "var(--r-md)",
        background: "var(--c-surface)",
        border: `1px solid ${tone === "error" ? "var(--s-error)" : "var(--c-hairline)"}`,
        color: tone === "error" ? "var(--s-error)" : "var(--c-ink)",
        font: "var(--t-caption)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      {message}
    </div>
  );
}
