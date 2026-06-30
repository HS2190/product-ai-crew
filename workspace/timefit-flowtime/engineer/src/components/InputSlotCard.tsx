/* C-02 SlotCard (input 모드) — 시각 + IntensityChipGroup + 사정 남기기 링크.
   카드 자체 비인터랙션, 내부 칩/링크가 동작. 무경고. */
import { IntensityScale, type IntensityId } from "../data/intensityScale";
import { IntensityChipGroup } from "./IntensityChip";
import { formatSlotRange } from "../lib/format";
import type { Slot } from "../data/types";
import styles from "./InputSlotCard.module.css";

interface Props {
  slot: Slot;
  value: IntensityId | null;
  comment?: string;
  disabled?: boolean;
  onChange: (id: IntensityId | null) => void;
  onComment: () => void;
}

export function InputSlotCard({ slot, value, comment, disabled, onChange, onComment }: Props) {
  return (
    <div className={styles.card} data-disabled={disabled}>
      <div className={`${styles.time} t-meta`}>{formatSlotRange(slot.start, slot.end)}</div>
      <IntensityChipGroup
        scale={IntensityScale}
        value={value}
        disabled={disabled}
        onChange={onChange}
      />
      <button type="button" className={styles.commentLink} onClick={onComment} disabled={disabled}>
        <CommentIcon />
        {comment ? "사정 수정" : "사정 남기기"}
        {comment && <span className={styles.commentDot} aria-label="작성됨" />}
      </button>
    </div>
  );
}

function CommentIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3 4.5h10v6H7l-2.5 2v-2H3z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}
