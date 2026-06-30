/* =========================================================================
   IntensityScale — screen-plan §0.1 data-driven scale (단계 수 가변)
   강도 색은 컴포넌트에 하드코딩하지 않고 여기서 CSS 변수명으로만 주입한다.
   라벨은 copy-sheet 확정 문구. avoid 칩은 "회피" 축약 / 범례·aria는 "가급적 회피".
   ========================================================================= */

export type IntensityId = "prefer" | "ok" | "avoid" | "hard-no";
export type Polarity = "+" | "0" | "-";
export type SoftHard = "soft" | "hard";

export interface IntensityScaleItem {
  id: IntensityId;
  /** 칩에 표시되는 짧은 라벨 (copy-sheet 부록B: 4칩 균등 2~4자) */
  label: string;
  /** 범례·aria·tooltip 풀이 (copy-sheet 공통 강도 칩) */
  legendLabel: string;
  order: number; // 분포막대 정렬용 (긍정→부정)
  polarity: Polarity;
  softHard: SoftHard;
  /** 추천 점수 weight. hard는 제외 플래그로 분기하므로 점수엔 큰 음수만 둔다 */
  weight: number;
  /** 색 외 단서 (색약 대응) */
  shape: "●" | "○" | "◐" | "⊘";
  /** CSS 변수명만 참조 — 하드코딩 hex 금지 (design-spec §1.2) */
  tokens: {
    bg: string;
    fg: string;
    border?: string; // 없으면 투명
  };
  ariaLabel: string;
}

/**
 * 데모 4단계 매핑. 3단계 전환 시 이 배열만 교체하면
 * 칩 그룹·분포막대·범례·집계가 모두 따라간다(레이아웃 N 종속 없음).
 */
export const IntensityScale: IntensityScaleItem[] = [
  {
    id: "prefer",
    label: "선호",
    legendLabel: "선호",
    order: 0,
    polarity: "+",
    softHard: "soft",
    weight: 2,
    shape: "●",
    tokens: { bg: "var(--c-sage-bg)", fg: "var(--c-sage)" },
    ariaLabel: "선호, 이 시간이 좋아요",
  },
  {
    id: "ok",
    label: "가능",
    legendLabel: "가능",
    order: 1,
    polarity: "0",
    softHard: "soft",
    weight: 0,
    shape: "○",
    tokens: { bg: "var(--c-neutral-ok-bg)", fg: "var(--c-neutral-ok)" },
    ariaLabel: "가능, 이 시간도 괜찮아요",
  },
  {
    id: "avoid",
    label: "회피", // 칩 축약 (부록B). 범례/aria는 "가급적 회피"
    legendLabel: "가급적 회피",
    order: 2,
    polarity: "-",
    softHard: "soft",
    weight: -1,
    shape: "◐",
    tokens: {
      bg: "var(--c-clay-bg)",
      fg: "var(--c-clay-ink)",
      border: "var(--c-clay-line)", // soft = 연한 황토 테두리
    },
    ariaLabel: "가급적 회피, 가능하면 피하고 싶어요",
  },
  {
    id: "hard-no",
    label: "불가",
    legendLabel: "불가",
    order: 3,
    polarity: "-",
    softHard: "hard",
    weight: -1000, // 점수상 매우 낮음. 단 '제외'는 weight가 아닌 softHard==hard 플래그로 분기
    shape: "⊘",
    tokens: {
      bg: "var(--c-clay-bg)",
      fg: "var(--c-clay-ink)",
      border: "var(--c-clay)", // hard = 진한 황토 테두리 (soft 대비 강조)
    },
    ariaLabel: "불가, 이 시간은 어려워요",
  },
];

export const scaleById = (id: IntensityId): IntensityScaleItem =>
  IntensityScale.find((s) => s.id === id)!;
