// IntensityChipGroup (component-spec §1) ★핵심
// scale 배열을 순회해 칩을 렌더(단계 수 가변). 절대 고정 그리드 아님 — 가로 wrap.
// 부정 강도 칩도 동일 default→selected 규칙. 빨강·경고·확인창·진동 없음(PRD §8.2).
import type { IntensityItem } from "../data/intensityScale";
import { IntensityGlyph } from "./IntensityGlyph";
import "./IntensityChipGroup.css";

interface Props {
  scale: IntensityItem[];
  value: string | null;
  onChange: (id: string | null) => void;
  disabled?: boolean;
}

export function IntensityChipGroup({ scale, value, onChange, disabled }: Props) {
  return (
    <div className="chipgroup" role="group" aria-label="이 시간에 대한 선호 강도 선택">
      {scale.map((item) => {
        const selected = value === item.id;
        return (
          <button
            key={item.id}
            type="button"
            className="chip"
            data-selected={selected}
            disabled={disabled}
            aria-pressed={selected}
            aria-label={item.ariaLabel}
            // 같은 칩 재탭 = 해제(무응답 복귀)
            onClick={() => onChange(selected ? null : item.id)}
            style={
              selected
                ? {
                    background: item.fill,
                    color: item.text,
                    borderColor: item.text,
                  }
                : undefined
            }
          >
            <IntensityGlyph
              shape={item.shape}
              color={selected ? item.text : "var(--c-ink-mute)"}
              filled={selected}
            />
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
