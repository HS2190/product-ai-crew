// 공통 버튼 (component-spec §14) — PrimaryButton / GhostButton.
import type { ButtonHTMLAttributes } from "react";
import "./Button.css";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "warning";
  fullWidth?: boolean;
  loading?: boolean;
}

export function Button({
  variant = "primary",
  fullWidth = false,
  loading = false,
  disabled,
  children,
  ...rest
}: Props) {
  return (
    <button
      type="button"
      className="btn"
      data-variant={variant}
      data-full={fullWidth}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading && <span className="btn-spinner" aria-hidden="true" />}
      <span style={{ visibility: loading ? "hidden" : "visible" }}>{children}</span>
    </button>
  );
}
