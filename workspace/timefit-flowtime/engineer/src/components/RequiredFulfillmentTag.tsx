/* C-08 RequiredFulfillmentTag — 충족(세이지) / 미충족(황토, 거부 아님) */
import styles from "./RequiredFulfillmentTag.module.css";

export function RequiredFulfillmentTag({ met, responded }: { met: number; responded: number }) {
  // 필수 응답이 아직 없으면 충족 수치 대신 중립 대기 표시(과대 표기 방지)
  if (responded === 0) {
    return (
      <span className={styles.tag} data-met={false}>
        필수 응답 대기
      </span>
    );
  }
  const fulfilled = met === responded;
  return (
    <span className={styles.tag} data-met={fulfilled}>
      {fulfilled ? `필수 ${met}/${responded} 가능` : `필수 ${met}/${responded} 응답`}
    </span>
  );
}
