// 인라인 SVG 아이콘 — 외부 의존 없음. 모두 aria-hidden(인접 텍스트가 의미 전달).
interface IconProps {
  size?: number;
  color?: string;
}

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  "aria-hidden": true as const,
  focusable: "false" as const,
});

export function LockIcon({ size = 20, color = "currentColor" }: IconProps) {
  return (
    <svg {...base(size)} fill="none" stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

export function InfoIcon({ size = 18, color = "currentColor" }: IconProps) {
  return (
    <svg {...base(size)} fill="none" stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 7.5h.01" />
    </svg>
  );
}

export function HeartIcon({ size = 24, color = "currentColor" }: IconProps) {
  return (
    <svg {...base(size)} fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20s-7-4.6-7-9.5A3.8 3.8 0 0 1 12 7a3.8 3.8 0 0 1 7 3.5C19 15.4 12 20 12 20z" />
    </svg>
  );
}

export function CheckIcon({ size = 24, color = "currentColor" }: IconProps) {
  return (
    <svg {...base(size)} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.5l4.5 4.5L19 7" />
    </svg>
  );
}

export function CommentIcon({ size = 20, color = "currentColor" }: IconProps) {
  return (
    <svg {...base(size)} fill="none" stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 5h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9l-4 3v-3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" />
    </svg>
  );
}
