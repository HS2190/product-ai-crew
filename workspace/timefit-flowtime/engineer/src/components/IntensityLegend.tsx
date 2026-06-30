/* 범례 — IntensityScale에서 자동 생성(칩 형태 + 풀이 라벨). 범례는 "가급적 회피". */
import { IntensityScale } from "../data/intensityScale";
import styles from "./IntensityLegend.module.css";

export function IntensityLegend() {
  return (
    <ul className={styles.legend} aria-label="강도 범례">
      {IntensityScale.map((item) => (
        <li key={item.id} className={styles.item}>
          <span
            className={styles.swatch}
            style={
              {
                "--sw-bg": item.tokens.bg,
                "--sw-fg": item.tokens.fg,
                "--sw-border": item.tokens.border ?? "transparent",
              } as React.CSSProperties
            }
            aria-hidden="true"
          >
            {item.shape}
          </span>
          <span className={styles.text}>{item.legendLabel}</span>
        </li>
      ))}
    </ul>
  );
}
