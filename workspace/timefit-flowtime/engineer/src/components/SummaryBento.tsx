/* 대시보드 요약 — 비대칭 bento 3칸(응답률 / 미응답 / 마감). mono 숫자. */
import styles from "./SummaryBento.module.css";

interface Props {
  responded: number;
  total: number;
  pending: number;
  deadlineLabel: string;
}

export function SummaryBento({ responded, total, pending, deadlineLabel }: Props) {
  return (
    <div className={styles.bento}>
      <div className={`${styles.cell} ${styles.wide}`}>
        <span className={styles.label}>응답</span>
        <span className={`${styles.num} t-meta`}>
          {responded} <span className={styles.slash}>/</span> {total}
        </span>
      </div>
      <div className={styles.cell}>
        <span className={styles.label}>미응답</span>
        <span className={`${styles.num} t-meta`}>{pending}명</span>
      </div>
      <div className={styles.cell}>
        <span className={styles.label}>마감</span>
        <span className={`${styles.num} t-meta`}>{deadlineLabel}</span>
      </div>
    </div>
  );
}
