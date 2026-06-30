/* C-05 ReassuranceBanner + PrivacyNotice (중립 톤 — 황토/빨강 아님, 안심)
   C-06 WarningBanner (황토 — 주의, 차단 아님)
   두 컴포넌트는 명확히 다르다(안심 vs 주의). */
import styles from "./Banners.module.css";

/** 안심·비공개 고지 — 중립 톤. 부정 입력에도 톤 불변. */
export function ReassuranceNotice({
  variant,
  children,
}: {
  variant: "reassurance" | "privacy";
  children: React.ReactNode;
}) {
  return (
    <div className={styles.notice} data-variant={variant}>
      <LockIcon />
      <p className={styles.noticeText}>{children}</p>
    </div>
  );
}

/** 지속 비공개 고지 (RESP-001 상주) — 1줄, 시각 방해 최소 */
export function PersistentPrivacy({ text }: { text: string }) {
  return (
    <div className={styles.persistent}>
      <LockIcon small />
      <span className="t-caption">{text}</span>
    </div>
  );
}

/** C-06 WarningBanner — 황토, 경고 ≠ 거부. 차단 아님. */
export function WarningBanner({
  message,
  action,
}: {
  message: React.ReactNode;
  action?: { label: string; onClick: () => void };
}) {
  return (
    <div className={styles.warning} role="status">
      <InfoIcon />
      <p className={styles.warningText}>{message}</p>
      {action && (
        <button type="button" className={styles.warningAction} onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </div>
  );
}

function LockIcon({ small }: { small?: boolean }) {
  const s = small ? 13 : 16;
  return (
    <svg width={s} height={s} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="3" y="7" width="10" height="6.5" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M5 7V5a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6.4" stroke="currentColor" strokeWidth="1.3" />
      <path d="M8 7.2v3.4M8 5.1v.1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
