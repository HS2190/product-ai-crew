/**
 * IntensityScale — 강도 척도 단일 진실 공급원(SSOT).
 * design-spec §1.2 / screen-plan §0.1.
 *
 * ★ 핵심 규칙: 강도 단계는 3↔4 가변. 모든 컴포넌트는 이 배열을 *순회*해 렌더한다.
 *   "4단계 고정"을 코드 어디에도 박지 않는다. 3단계 전환은 아래 배열에서 avoid만 빼면 된다.
 *
 * weight 의미(screen-plan §0.3, flowtime decisions):
 *   - 추천 점수 = weight 합. 단, hard-no는 weight 합산이 아니라 "제외 플래그"로 분기한다
 *     (필수 참석자 hard-no면 슬롯 excluded). 그래서 hard-no의 weight는 *감점 폭*으로만 쓰이고
 *     (선택 참석자 hard-no의 감점), 제외 판정은 polarity/id 기준 분기로 별도 처리한다.
 *   - 막대(IntensityDistributionBar)는 weight를 절대 쓰지 않는다 — 건수(count)만 쌓는다(§3.4).
 */

export type Polarity = "+" | "0" | "-";
export type IntensityShape =
  | "circle-check"
  | "half-circle"
  | "diamond-hatch"
  | "square-x";

export interface IntensityItem {
  id: string;
  /** 정렬 순서: 긍정→부정 (막대·범례 좌→우) */
  order: number;
  label: string;
  ariaLabel: string;
  polarity: Polarity;
  shape: IntensityShape;
  /** 채움 색 CSS 변수명(var(--...)) */
  fill: string;
  /** 텍스트/보더 색 (칩 selected 시 채움 대비 ≥4.5:1) */
  text: string;
  /** 추천 점수 감점/가점 폭. hard-no는 제외 분기 + 큰 감점. */
  weight: number;
  /** true면 "필수 참석자가 이 값이면 슬롯 제외" 후보. (hard-no 전용) */
  hardExclude: boolean;
}

/**
 * 데모 기본 4단계 주입(부록 A 확정 라벨).
 * 3단계 전환: avoid 객체만 제거 → 컴포넌트 코드/레이아웃 불변(SSOT 순회).
 */
export const intensityScale4: IntensityItem[] = [
  {
    id: "prefer",
    order: 0,
    label: "선호",
    ariaLabel: "이 시간 선호로 응답",
    polarity: "+",
    shape: "circle-check",
    fill: "var(--int-prefer)",
    text: "#0f4f4a",
    weight: 2,
    hardExclude: false,
  },
  {
    id: "ok",
    order: 1,
    label: "가능",
    ariaLabel: "이 시간 가능으로 응답",
    polarity: "0",
    shape: "half-circle",
    fill: "var(--int-ok)",
    text: "#2f5c58",
    weight: 1,
    hardExclude: false,
  },
  {
    id: "avoid",
    order: 2,
    label: "가급적 회피",
    ariaLabel: "이 시간 가급적 회피로 응답",
    polarity: "-",
    shape: "diamond-hatch",
    fill: "var(--int-avoid)",
    text: "#6e5c45",
    weight: -1,
    hardExclude: false,
  },
  {
    id: "hard-no",
    order: 3,
    label: "불가",
    ariaLabel: "이 시간 불가로 응답",
    polarity: "-",
    shape: "square-x",
    fill: "var(--int-hardno)",
    text: "#4a4a4a",
    /** 제외는 weight 합산이 아니라 hardExclude 플래그로 분기(§3.4 인계노트1).
     *  단 선택 참석자 hard-no는 제외 안 되고 감점만 — 그 감점 폭으로 -3 사용. */
    weight: -3,
    hardExclude: true,
  },
];

/** 3단계 변형(검증용). avoid 제거만으로 동작 — SSOT 가변성 증명. */
export const intensityScale3: IntensityItem[] = intensityScale4.filter(
  (i) => i.id !== "avoid"
);

/** 데모에서 실제 주입하는 척도. 여기 한 줄만 바꾸면 전 화면이 3↔4로 전환된다. */
export const activeScale: IntensityItem[] = intensityScale4;

export const byId = (
  scale: IntensityItem[]
): Record<string, IntensityItem> =>
  Object.fromEntries(scale.map((i) => [i.id, i]));
