// 안심·비공개 고지 컴포넌트 묶음.
// ReassuranceBanner(§3), PrivacyNotice(§4), PrivacyBoundaryNotice(§13).
// 모두 정보 배너 — 경고색 절대 아님. brand-soft / info 톤.

import { LockIcon, InfoIcon, HeartIcon } from "./icons";

// ── ReassuranceBanner ──────────────────────────────────────────
// 선택 참석자에게 "빠져도 된다" 안심. optional=강조, required=subtle.
export function ReassuranceBanner({
  variant,
  message,
}: {
  variant: "emphasized" | "subtle";
  message: string;
}) {
  if (variant === "subtle") {
    return (
      <p style={{ font: "var(--t-caption)", color: "var(--c-ink-soft)", margin: "var(--sp-2) 0 0" }}>
        {message}
      </p>
    );
  }
  return (
    <div
      style={{
        display: "flex",
        gap: var12(),
        alignItems: "flex-start",
        background: "var(--c-brand-soft)",
        borderRadius: "var(--r-md)",
        padding: "var(--sp-4)",
      }}
    >
      <HeartIcon size={24} color="var(--c-brand-strong)" />
      <span style={{ font: "var(--t-body)", color: "var(--c-ink)", whiteSpace: "pre-line" }}>
        {message}
      </span>
    </div>
  );
}

// ── PrivacyNotice ──────────────────────────────────────────────
// "내 응답은 비공개"를 지속 체감(NFR-002). variant별 노출 맥락.
type PrivacyVariant = "block" | "persistent-top" | "persistent-bar" | "reconfirm";

export function PrivacyNotice({
  variant,
  message,
  visible = true,
}: {
  variant: PrivacyVariant;
  message: string;
  visible?: boolean;
}) {
  if (!visible) return null;

  if (variant === "persistent-bar") {
    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, font: "var(--t-caption)", color: "var(--c-ink-soft)" }}>
        <LockIcon size={16} color="var(--s-info)" />
        {message}
      </span>
    );
  }

  if (variant === "reconfirm") {
    return (
      <p style={{ font: "var(--t-caption)", color: "var(--c-ink-soft)", whiteSpace: "pre-line", textAlign: "center", margin: 0 }}>
        {message}
      </p>
    );
  }

  // block / persistent-top
  return (
    <div
      style={{
        display: "flex",
        gap: var12(),
        alignItems: "flex-start",
        background: "var(--c-brand-soft)",
        borderRadius: "var(--r-sm)",
        padding: "12px 16px",
      }}
    >
      <LockIcon size={20} color="var(--s-info)" />
      <span style={{ font: "var(--t-caption)", color: "var(--c-ink-soft)" }}>{message}</span>
    </div>
  );
}

// ── PrivacyBoundaryNotice (주최자 측) ──────────────────────────
export function PrivacyBoundaryNotice({ message }: { message: string }) {
  return (
    <div
      style={{
        display: "flex",
        gap: var12(),
        alignItems: "flex-start",
        background: "var(--c-surface-sunken)",
        borderRadius: "var(--r-sm)",
        padding: "10px 14px",
      }}
    >
      <InfoIcon size={18} color="var(--s-info)" />
      <span style={{ font: "var(--t-caption)", color: "var(--c-ink-soft)" }}>{message}</span>
    </div>
  );
}

function var12() {
  return "var(--sp-3)";
}
