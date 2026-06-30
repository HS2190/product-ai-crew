/* C-02(aggregate) + C-08 — 추천 슬롯 카드.
   순위 배지 / mono 점수 / 필수 충족 태그 / 분포막대 2줄(필수·선택) / 확정 버튼.
   점수 배지(=weight 합)와 분포막대(=건수)는 다른 시각 요소. */
import type { SlotAggregate } from "../lib/recommend";
import type { Attendee } from "../data/types";
import { RankBadge } from "./Badge";
import { RequiredFulfillmentTag } from "./RequiredFulfillmentTag";
import { IntensityDistributionBar } from "./IntensityDistributionBar";
import { Button } from "./Button";
import { formatSlotShort } from "../lib/format";
import { formatScore } from "../lib/format";
import styles from "./AggregateSlotCard.module.css";

interface Props {
  agg: SlotAggregate;
  rank: number;
  attendees: Attendee[];
  tentative?: boolean;
  onConfirm: () => void;
}

export function AggregateSlotCard({ agg, rank, attendees, tentative, onConfirm }: Props) {
  const requiredTotal = attendees.filter((a) => a.role === "required").length;
  const optionalTotal = attendees.filter((a) => a.role === "optional").length;

  return (
    <article className={styles.card} data-rank1={rank === 1}>
      <header className={styles.head}>
        <div className={styles.headLeft}>
          <RankBadge rank={rank} />
          <span className={`${styles.time} t-meta`}>{formatSlotShort(agg.slot.start)}</span>
        </div>
        <div className={styles.scoreWrap}>
          <span className={`${styles.score} t-meta`}>{formatScore(agg.score)}</span>
          {tentative && <span className={styles.tentative}>잠정</span>}
        </div>
      </header>

      <RequiredFulfillmentTag met={agg.requiredMet} responded={agg.requiredResponded} />

      <div className={styles.bars}>
        <IntensityDistributionBar
          counts={agg.requiredCounts}
          group="required"
          total={requiredTotal}
          respondents={agg.requiredRespondents}
        />
        <IntensityDistributionBar
          counts={agg.optionalCounts}
          group="optional"
          total={optionalTotal}
          respondents={agg.optionalRespondents}
        />
      </div>

      <Button variant="primary" size="md" fullWidth onClick={onConfirm}>
        이 시간으로 확정
      </Button>
    </article>
  );
}
