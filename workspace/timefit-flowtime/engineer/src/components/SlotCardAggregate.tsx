// SlotCard variant=aggregate (component-spec §5) — 주최자 집계 표시.
// candidate(후보) / excluded(제외, 3중 신호: 흐림 + 가라앉은 바탕 + ⊘ 배지). §3.3.
import type { IntensityItem } from "../data/intensityScale";
import type { Attendee, ResponseMap } from "../data/types";
import type { ScoredSlot } from "../lib/recommend";
import { buildCounts } from "../lib/recommend";
import { SlotScoreBadge } from "./SlotScoreBadge";
import { RequiredFulfillmentTag } from "./RequiredFulfillmentTag";
import { IntensityDistributionBar } from "./IntensityDistributionBar";
import { Button } from "./Button";

interface Props {
  scored: ScoredSlot;
  rank: number;
  scale: IntensityItem[];
  attendees: Attendee[];
  responses: ResponseMap;
  onConfirm: (slotId: string) => void;
}

export function SlotCardAggregate({ scored, rank, scale, attendees, responses, onConfirm }: Props) {
  const { slot, excluded } = scored;
  const req = buildCounts(slot.id, attendees, responses, "required");
  const opt = buildCounts(slot.id, attendees, responses, "optional");

  return (
    <section
      style={{
        background: excluded ? "var(--c-surface-sunken)" : "var(--c-surface)",
        border: "var(--border-hairline)",
        borderRadius: "var(--r-md)",
        padding: "var(--sp-4)",
        boxShadow: excluded ? "none" : "var(--shadow-card)",
        opacity: excluded ? 0.65 : 1,
        display: "flex",
        flexDirection: "column",
        gap: "var(--sp-3)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "var(--sp-2)" }}>
        <SlotScoreBadge rank={rank} score={scored.score} excluded={excluded} />
        <span className="tnum" style={{ font: "var(--t-body-strong)" }}>
          {slot.date} {slot.start}
        </span>
      </div>

      <RequiredFulfillmentTag
        required={scored.requiredTotal}
        available={scored.requiredAvailable}
        blocked={excluded}
        blockedCount={scored.requiredBlockedCount}
      />

      {!excluded && (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-2)" }}>
          <span style={{ font: "var(--t-caption)", color: "var(--c-ink-mute)" }}>
            응답 {req.total + opt.total}명 기준
          </span>
          <IntensityDistributionBar scale={scale} counts={req.counts} group="required" total={req.total} groupLabel="필수" />
          <IntensityDistributionBar scale={scale} counts={opt.counts} group="optional" total={opt.total} groupLabel="선택" />
        </div>
      )}

      {excluded ? (
        <p style={{ font: "var(--t-caption)", color: "var(--s-warning)", margin: 0 }}>
          필수 {scored.requiredBlockedCount}명이 불가한 시간이에요
        </p>
      ) : (
        <Button variant="primary" fullWidth onClick={() => onConfirm(slot.id)}>
          이 시간으로 확정
        </Button>
      )}
    </section>
  );
}
