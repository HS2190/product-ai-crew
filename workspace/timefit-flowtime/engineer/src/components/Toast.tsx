/* C-10 Toast — info(무채) / error(황토, 빨강 아님). 입력값 보존 안내. */
import { useEffect } from "react";
import styles from "./Toast.module.css";

export interface ToastState {
  kind: "info" | "error";
  message: string; // \n 줄바꿈 허용
}

export function Toast({
  toast,
  onDismiss,
}: {
  toast: ToastState | null;
  onDismiss: () => void;
}) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onDismiss, toast.kind === "error" ? 4200 : 2400);
    return () => clearTimeout(t);
  }, [toast, onDismiss]);

  if (!toast) return null;
  return (
    <div className={styles.wrap} role="status" aria-live="polite">
      <div className={styles.toast} data-kind={toast.kind}>
        {toast.message}
      </div>
    </div>
  );
}
