/* C-07 ExcludedSlotSection — 제외 슬롯 접힘 영역(아코디언, 1px line·박스 없음).
   제외(자격 박탈) vs 감점(점수 낮음)의 시각 위계 분리(decisions). 거부 톤 금지. */
import { useState } from "react";
import type { SlotAggregate } from "../lib/recommend";
import { ExcludedBadge } from "./Badge";
import { formatSlotShort } from "../lib/format";
import styles from "./ExcludedSlotSection.module.css";

export function ExcludedSlotSection({
  slots,
  defaultOpen = false,
}: {
  slots: SlotAggregate[];
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  if (slots.length === 0) return null; // empty = 미노출

  return (
    <section className={styles.section}>
      <button
        type="button"
        className={styles.header}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span>필수 참석자가 어려운 시간 ({slots.length})</span>
        <span className={styles.sign} aria-hidden="true">
          {open ? "−" : "+"}
        </span>
      </button>

      {open && (
        <ul className={styles.list}>
          {slots.map((agg) => (
            <li key={agg.slot.id} className={styles.item}>
              <div className={styles.itemHead}>
                <span className={`${styles.time} t-meta`}>{formatSlotShort(agg.slot.start)}</span>
                <ExcludedBadge />
              </div>
              <p className={styles.reason}>
                필수 참석자 {agg.excludedRequiredCount}명이 어려운 시간이에요
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
