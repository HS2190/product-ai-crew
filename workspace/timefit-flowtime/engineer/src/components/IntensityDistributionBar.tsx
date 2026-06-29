// IntensityDistributionBar (component-spec §7) — 집계 막대 = 건수(count) 분포.
// ★ weight를 받지 않는다. hard-no도 "건수 1"로 쌓인다(§3.4). 추천 점수와 다른 계산.
// 세그먼트 색 = polarity, 정렬 = order. 단계 수 가변(scale 순회).
import type { IntensityItem } from "../data/intensityScale";
import { IntensityGlyph } from "./IntensityGlyph";

interface Props {
  scale: IntensityItem[];
  counts: Record<string, number>;
  group: "required" | "optional";
  total: number;
  /** 이 미만이면 분포 숨김(익명성). 기본 2 — 선택 1명이면 개인 식별 위험. */
  anonymizeBelow?: number;
  groupLabel: string;
}

export function IntensityDistributionBar({
  scale,
  counts,
  group,
  total,
  anonymizeBelow = 2,
  groupLabel,
}: Props) {
  const empty = total === 0;
  // 익명성 임계: 선택 그룹에서 응답 수가 임계 미만이면 분포 숨김
  const anonymized = group === "optional" && total > 0 && total < anonymizeBelow;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "44px 1fr", gap: var12(), alignItems: "center" }}>
      <span style={{ font: "var(--t-label)", color: "var(--c-ink-soft)" }}>{groupLabel}</span>

      {empty ? (
        <div style={trackStyle}>
          <span style={mutedLabel}>{group === "optional" ? "선택 참석자 응답이 아직 없어요" : "응답 없음"}</span>
        </div>
      ) : anonymized ? (
        <div style={trackStyle}>
          <span style={mutedLabel}>선택 참석자 1명이 응답했어요</span>
        </div>
      ) : (
        <div
          role="img"
          aria-label={
            groupLabel +
            " 응답 분포 " +
            scale
              .filter((it) => (counts[it.id] ?? 0) > 0)
              .map((it) => `${it.label} ${counts[it.id]}명`)
              .join(", ")
          }
          style={{
            display: "flex",
            height: 24,
            borderRadius: var6(),
            overflow: "hidden",
            border: "var(--border-hairline)",
          }}
        >
          {scale.map((it) => {
            const c = counts[it.id] ?? 0;
            if (c === 0) return null;
            const pct = (c / total) * 100;
            return (
              <span
                key={it.id}
                title={`${it.label} ${c}명`}
                style={{
                  flex: `${pct} 0 0%`,
                  background: it.fill,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 4,
                  color: it.text,
                  font: "var(--t-caption)",
                  fontWeight: 600,
                  minWidth: 0,
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                }}
              >
                <IntensityGlyph shape={it.shape} color={it.text} filled size={13} />
                {pct >= 16 && <span>{it.label} {c}</span>}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

const trackStyle: React.CSSProperties = {
  height: 24,
  borderRadius: "var(--sp-1)",
  background: "var(--c-surface-sunken)",
  display: "flex",
  alignItems: "center",
  paddingLeft: 10,
};
const mutedLabel: React.CSSProperties = { font: "var(--t-caption)", color: "var(--c-ink-mute)" };

function var12() {
  return "var(--sp-3)";
}
function var6() {
  return "6px";
}
