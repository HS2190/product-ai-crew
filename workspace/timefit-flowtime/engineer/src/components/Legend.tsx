// Legend (component-spec §8) — IntensityScale에서 자동 생성. 손으로 안 적음(§0.1 규칙3).
import type { IntensityItem } from "../data/intensityScale";
import { IntensityGlyph } from "./IntensityGlyph";

export function Legend({ scale }: { scale: IntensityItem[] }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--sp-4)", alignItems: "center" }}>
      {scale.map((it) => (
        <span key={it.id} style={{ display: "inline-flex", alignItems: "center", gap: 6, font: "var(--t-caption)", color: "var(--c-ink-soft)" }}>
          <IntensityGlyph shape={it.shape} color={it.text} filled size={16} />
          {it.label}
        </span>
      ))}
    </div>
  );
}
