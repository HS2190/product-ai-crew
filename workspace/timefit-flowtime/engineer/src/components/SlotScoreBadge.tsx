// SlotScoreBadge (component-spec §6) — 순위+점수 / 제외 배지.
interface Props {
  rank: number; // 1-based. excluded면 무시
  score: number;
  excluded?: boolean;
}

const RANK_CIRCLED = ["①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨", "⑩"];

export function SlotScoreBadge({ rank, score, excluded }: Props) {
  if (excluded) {
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          padding: "4px 10px",
          borderRadius: "var(--r-full)",
          border: "1px solid var(--s-warning)",
          color: "var(--s-warning)",
          font: "var(--t-label)",
          fontWeight: 700,
          background: "transparent",
        }}
      >
        <span aria-hidden="true">⊘</span> 제외
      </span>
    );
  }
  const isRank1 = rank === 1;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          padding: "4px 10px",
          borderRadius: "var(--r-full)",
          background: isRank1 ? "var(--c-brand)" : "var(--c-brand-soft)",
          color: isRank1 ? "#fff" : "var(--c-brand-strong)",
          font: "var(--t-label)",
          fontWeight: 700,
        }}
      >
        <span aria-hidden="true">{RANK_CIRCLED[rank - 1] ?? `${rank}.`}</span>
        {isRank1 ? "추천" : ""}
      </span>
      <span className="tnum" style={{ font: "600 15px/1 var(--font-base)", color: "var(--c-ink-soft)" }}>
        점수 {score > 0 ? `+${score}` : score}
      </span>
    </span>
  );
}
