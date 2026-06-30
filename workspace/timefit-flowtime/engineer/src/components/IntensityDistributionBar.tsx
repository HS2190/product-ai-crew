/* C-03. IntensityDistributionBar ★ — 건수 분포(≠ 추천 weight).
   IntensityScale를 order로 정렬, polarity로 색칠. weight 미사용.
   필수/선택 2줄 구분. 최소 익명성 임계(선택 N명 이하면 강도 가림). */

import { IntensityScale, type IntensityId } from "../data/intensityScale";
import styles from "./IntensityDistributionBar.module.css";

interface BarProps {
  counts: Record<IntensityId, number>;
  group: "required" | "optional";
  total: number; // 그 그룹 전체 인원(미응답 트랙 계산)
  /** 응답한 인원 수 — 익명성 임계 판단(선택 그룹) */
  respondents: number;
  minAnonymity?: number; // 이하면 강도 숨김
}

const GROUP_LABEL: Record<"required" | "optional", string> = {
  required: "필수",
  optional: "선택",
};

export function IntensityDistributionBar({
  counts,
  group,
  total,
  respondents,
  minAnonymity = 2, // anonymizeBelow=2 (선택 1명 분포 숨김 — 강화 규칙)
}: BarProps) {
  const ordered = [...IntensityScale].sort((a, b) => a.order - b.order);
  const responded = ordered.reduce((n, s) => n + counts[s.id], 0);
  const pending = Math.max(0, total - responded);

  // 최소 익명성 발동(선택 그룹 + 응답 1명뿐): 강도 비표시
  if (group === "optional" && respondents > 0 && respondents < minAnonymity) {
    return (
      <div className={styles.row}>
        <span className={styles.groupTag}>{GROUP_LABEL[group]}</span>
        <span className={styles.anonymized}>선택 {respondents}명 응답</span>
      </div>
    );
  }

  // empty(응답 0)
  if (responded === 0) {
    return (
      <div className={styles.row}>
        <span className={styles.groupTag}>{GROUP_LABEL[group]}</span>
        <span className={styles.emptyTrack} aria-hidden="true" />
        <span className={styles.emptyText}>응답 대기</span>
      </div>
    );
  }

  // aria 요약 (copy-sheet: "필수: 선호 3명, 가능 2명, 가급적 회피 1명")
  const ariaParts = ordered
    .filter((s) => counts[s.id] > 0)
    .map((s) => `${s.legendLabel} ${counts[s.id]}명`);
  const ariaLabel = `${GROUP_LABEL[group]}: ${ariaParts.join(", ")}`;

  return (
    <div className={styles.row}>
      <span className={styles.groupTag}>{GROUP_LABEL[group]}</span>
      <div className={styles.bar} role="img" aria-label={ariaLabel}>
        {ordered.map((s) =>
          counts[s.id] > 0 ? (
            <span
              key={s.id}
              className={styles.seg}
              style={
                {
                  flex: counts[s.id],
                  "--seg-bg": s.tokens.fg, // 채움색 = 강도 fg(가독성 있는 진한 톤)
                } as React.CSSProperties
              }
              title={`${s.legendLabel} ${counts[s.id]}명`}
            />
          ) : null
        )}
        {pending > 0 && (
          <span
            className={styles.pendingSeg}
            style={{ flex: pending }}
            title={`미응답 ${pending}명`}
          />
        )}
      </div>
    </div>
  );
}
