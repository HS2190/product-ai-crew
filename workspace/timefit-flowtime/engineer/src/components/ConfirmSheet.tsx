// ConfirmSheet (component-spec §11) — 모바일 하단 시트 / 데스크톱 중앙 모달.
// submit-partial(참석자 부분 제출, 중립 톤) / confirm-slot(주최자 확정, 필수 미충족 시 황토 warning).
import { useEffect, useRef } from "react";
import { Button } from "./Button";
import "./ConfirmSheet.css";

interface Props {
  title: string;
  body: React.ReactNode;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  warning?: string | null;
  confirmVariant?: "primary" | "warning";
}

export function ConfirmSheet({
  title,
  body,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  warning = null,
  confirmVariant = "primary",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onCancel]);

  return (
    <div className="sheet-overlay" onClick={onCancel}>
      <div
        ref={ref}
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sheet-grip" aria-hidden="true" />
        <h2 style={{ font: "var(--t-title)", margin: "0 0 var(--sp-3)" }}>{title}</h2>
        <div style={{ font: "var(--t-body)", color: "var(--c-ink-soft)", marginBottom: "var(--sp-4)", whiteSpace: "pre-line" }}>
          {body}
        </div>

        {warning && (
          <div
            style={{
              background: "var(--c-surface-sunken)",
              borderLeft: "3px solid var(--s-warning)",
              borderRadius: "var(--r-sm)",
              padding: "12px 14px",
              marginBottom: "var(--sp-4)",
              font: "var(--t-caption)",
              color: "var(--s-warning)",
            }}
          >
            {warning}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-2)" }}>
          <Button variant={confirmVariant} fullWidth onClick={onConfirm}>
            {confirmLabel}
          </Button>
          <Button variant="ghost" fullWidth onClick={onCancel}>
            {cancelLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
