// 강도 형태 부호(shape) — 색 외 단서(WCAG 1.4.1). 색 없이도 강도가 읽히게 한다.
// circle-check(선호) / half-circle(가능) / diamond-hatch(가급적 회피) / square-x(불가)
import type { IntensityShape } from "../data/intensityScale";

interface Props {
  shape: IntensityShape;
  /** 외곽선/부호 색 */
  color: string;
  /** true면 채움(선택 상태), false면 외곽선만(미선택) */
  filled: boolean;
  size?: number;
}

export function IntensityGlyph({ shape, color, filled, size = 18 }: Props) {
  const s = size;
  const stroke = color;
  const fill = filled ? color : "none";
  const common = { stroke, strokeWidth: 1.6, fill: "none" } as const;

  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      style={{ flexShrink: 0 }}
    >
      {shape === "circle-check" && (
        <>
          <circle cx="12" cy="12" r="9" {...common} fill={fill} />
          <path
            d="M8 12.5l2.5 2.5L16 9"
            stroke={filled ? "#fff" : color}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}
      {shape === "half-circle" && (
        <>
          <circle cx="12" cy="12" r="9" {...common} />
          {filled && <path d="M12 3a9 9 0 0 1 0 18z" fill={color} />}
        </>
      )}
      {shape === "diamond-hatch" && (
        <>
          <rect
            x="12"
            y="2.5"
            width="13.4"
            height="13.4"
            transform="rotate(45 12 12)"
            {...common}
            fill={fill}
            rx="1.5"
          />
          {/* 빗금 — 형태 식별 강화 */}
          <path
            d="M9 12l3 3M12 9l3 3"
            stroke={filled ? "#fff" : color}
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </>
      )}
      {shape === "square-x" && (
        <>
          <rect x="4" y="4" width="16" height="16" rx="2" {...common} fill={fill} />
          <path
            d="M9 9l6 6M15 9l-6 6"
            stroke={filled ? "#fff" : color}
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </>
      )}
    </svg>
  );
}
