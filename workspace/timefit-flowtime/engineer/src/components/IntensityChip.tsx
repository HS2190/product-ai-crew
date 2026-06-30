/* C-01. IntensityChip / IntensityChipGroup ★
   1 컴포넌트 + 4 variant(=IntensityScale 데이터로 분기). 색 하드코딩 0 —
   strength 색은 scaleItem.tokens(var()명)에서만 온다.
   단일 선택(라디오) + 재탭 해제. 부정 선택도 동일 경로(무경고). */

import type { IntensityScaleItem, IntensityId } from "../data/intensityScale";
import styles from "./IntensityChip.module.css";

interface ChipProps {
  scaleItem: IntensityScaleItem;
  selected: boolean;
  disabled?: boolean;
  onToggle: (id: IntensityId) => void;
}

export function IntensityChip({ scaleItem, selected, disabled, onToggle }: ChipProps) {
  // 선택 시에만 strength 토큰 적용. 미선택은 무채 아웃라인(base.css 토큰).
  const style = selected
    ? ({
        "--chip-bg": scaleItem.tokens.bg,
        "--chip-fg": scaleItem.tokens.fg,
        "--chip-border": scaleItem.tokens.border ?? "transparent",
      } as React.CSSProperties)
    : undefined;

  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={scaleItem.ariaLabel}
      disabled={disabled}
      data-selected={selected}
      data-id={scaleItem.id}
      className={styles.chip}
      style={style}
      onClick={() => !disabled && onToggle(scaleItem.id)}
    >
      <span className={styles.shape} aria-hidden="true">
        {scaleItem.shape}
      </span>
      <span className={styles.label}>{scaleItem.label}</span>
    </button>
  );
}

interface GroupProps {
  scale: IntensityScaleItem[];
  value: IntensityId | null;
  disabled?: boolean;
  onChange: (id: IntensityId | null) => void;
}

export function IntensityChipGroup({ scale, value, disabled, onChange }: GroupProps) {
  return (
    <div className={styles.group} role="radiogroup" aria-label="이 시간 선호 강도">
      {scale.map((item) => (
        <IntensityChip
          key={item.id}
          scaleItem={item}
          selected={value === item.id}
          disabled={disabled}
          onToggle={(id) => onChange(value === id ? null : id)} // 재탭 = 해제
        />
      ))}
    </div>
  );
}
