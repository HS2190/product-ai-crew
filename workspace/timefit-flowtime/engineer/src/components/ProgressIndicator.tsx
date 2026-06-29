// ResponseProgress / ProgressIndicator (component-spec §9) — "N/전체 응답".
// 중립 톤. 미응답 강조·경고 없음. aria-live polite.
export function ProgressIndicator({ answered, total }: { answered: number; total: number }) {
  const complete = answered === total && total > 0;
  const pct = total > 0 ? (answered / total) * 100 : 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-2)" }} aria-live="polite">
      <span className="tnum" style={{ font: "600 14px/1 var(--font-base)", color: "var(--c-ink-soft)" }}>
        {complete ? "모두 응답했어요" : `${answered}/${total} 응답`}
      </span>
      <span
        aria-hidden="true"
        style={{ width: 64, height: 6, borderRadius: 999, background: "var(--c-surface-sunken)", overflow: "hidden" }}
      >
        <span style={{ display: "block", height: "100%", width: `${pct}%`, background: "var(--c-brand)", transition: "width var(--motion-base)" }} />
      </span>
    </div>
  );
}
