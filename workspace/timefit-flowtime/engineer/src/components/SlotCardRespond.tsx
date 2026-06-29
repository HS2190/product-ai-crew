// SlotCard variant=respond (component-spec §5) — 참석자 강도 입력.
// selected 시 카드 좌측 4px 강조 바(선택 강도 fill). 카드 배경 불변(차분).
import { useState } from "react";
import type { IntensityItem } from "../data/intensityScale";
import type { Slot } from "../data/types";
import { IntensityChipGroup } from "./IntensityChipGroup";
import { CommentIcon } from "./icons";

interface Props {
  slot: Slot;
  scale: IntensityItem[];
  value: string | null;
  onChange: (id: string | null) => void;
  comment: string;
  onComment: (text: string) => void;
  disabled?: boolean;
}

export function SlotCardRespond({ slot, scale, value, onChange, comment, onComment, disabled }: Props) {
  const [open, setOpen] = useState(false);
  const selectedItem = scale.find((i) => i.id === value) ?? null;

  return (
    <section
      style={{
        position: "relative",
        background: "var(--c-surface)",
        border: "var(--border-hairline)",
        borderRadius: "var(--r-md)",
        padding: "var(--sp-4)",
        paddingLeft: selectedItem ? "calc(var(--sp-4) + 4px)" : "var(--sp-4)",
        overflow: "hidden",
      }}
    >
      {selectedItem && (
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 4,
            background: selectedItem.fill,
          }}
        />
      )}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "var(--sp-3)" }}>
        <span style={{ font: "var(--t-body-strong)" }} className="tnum">
          {slot.date} {slot.start}–{slot.end}
        </span>
      </div>

      <IntensityChipGroup scale={scale} value={value} onChange={onChange} disabled={disabled} />

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        disabled={disabled}
        style={{
          marginTop: "var(--sp-3)",
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          minHeight: 36,
          padding: "0 4px",
          background: "transparent",
          border: "none",
          color: comment ? "var(--c-brand)" : "var(--c-ink-mute)",
          font: "var(--t-caption)",
          cursor: "pointer",
        }}
        aria-expanded={open}
      >
        <CommentIcon size={18} color="currentColor" />
        {comment ? "메모 1개" : "메모 더하기 (선택)"}
      </button>

      {open && (
        <div style={{ marginTop: "var(--sp-2)" }}>
          <textarea
            value={comment}
            onChange={(e) => onComment(e.target.value)}
            placeholder="예: 이날은 외근이라 오전만 가능해요"
            rows={2}
            disabled={disabled}
            style={{
              width: "100%",
              resize: "vertical",
              border: "var(--border-hairline)",
              borderRadius: "var(--r-sm)",
              padding: "10px 12px",
              font: "var(--t-body)",
              fontSize: 16, /* iOS 줌 방지 */
              color: "var(--c-ink)",
              background: "var(--c-surface)",
            }}
          />
          <p style={{ font: "var(--t-caption)", color: "var(--c-ink-mute)", margin: "6px 0 0" }}>
            메모도 다른 참석자에게 보이지 않아요
          </p>
        </div>
      )}
    </section>
  );
}
