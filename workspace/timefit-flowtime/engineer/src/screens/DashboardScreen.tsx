// 화면 2 — 주최자 집계 대시보드 (SCR-WEB-DASH-001, 핵심). design-spec §3.
// 추천 정렬(deterministic) · 강도 분포(건수) · 미응답 현황 · 확정.
// Mobile 우선 + Desktop 겸용(카드↔표는 동일 컴포넌트, 레이아웃만 폭으로 분기 — 여기선 카드 리스트로 통일하고 데스크톱은 폭 확장).
import { useMemo, useState } from "react";
import { activeScale } from "../data/intensityScale";
import { attendees, meeting, responses } from "../data/mock";
import { recommend, sortByTime } from "../lib/recommend";
import { PrivacyBoundaryNotice } from "../components/Notices";
import { SlotCardAggregate } from "../components/SlotCardAggregate";
import { Legend } from "../components/Legend";
import { PendingAttendeeList } from "../components/PendingAttendeeList";
import { ConfirmSheet } from "../components/ConfirmSheet";
import { Toast } from "../components/Toast";

export function DashboardScreen() {
  const scale = activeScale;
  const [sortMode, setSortMode] = useState<"recommended" | "time">("recommended");
  const [reminded, setReminded] = useState<Set<string>>(new Set());
  const [confirmSlot, setConfirmSlot] = useState<string | null>(null);
  const [confirmedSlot, setConfirmedSlot] = useState<string | null>(null);

  const result = useMemo(
    () => recommend(meeting.slots, attendees, responses, scale),
    [scale]
  );

  // 응답/미응답 집계 (한 슬롯이라도 응답하면 응답자로 간주)
  const responded = attendees.filter((a) =>
    meeting.slots.some((s) => responses[a.id]?.[s.id])
  );
  const pending = attendees.filter((a) => !responded.includes(a));

  // 표시 순서: 추천순 = 후보(점수순) + 제외(하단), 시간순 = 시간 정렬(점수 계산 불변)
  const display =
    sortMode === "recommended"
      ? result.ranked
      : sortByTime(result.ranked);

  // 순위는 후보에만 부여(제외 슬롯은 순위 없음)
  const rankOf = new Map(result.candidates.map((s, i) => [s.slot.id, i + 1]));

  const slotToConfirm = result.ranked.find((s) => s.slot.id === confirmSlot);

  return (
    <div className="dash-shell">
      {/* 요약 바 (상단 고정) */}
      <header className="dash-summary">
        <span className="tnum" style={{ font: "var(--t-body-strong)" }}>
          응답 {responded.length}/{attendees.length}
        </span>
        <span style={{ color: "var(--c-ink-mute)" }}>·</span>
        <span className="tnum" style={{ font: "var(--t-body)", color: "var(--c-ink-soft)" }}>
          미응답 {pending.length}명
        </span>
        <span style={{ color: "var(--c-ink-mute)" }}>·</span>
        <span className="tnum" style={{ font: "var(--t-body)", color: "var(--c-ink-soft)" }}>
          마감 D-{meeting.deadlineDays}
        </span>
      </header>

      <div className="dash-body">
        <div style={{ marginBottom: "var(--sp-4)" }}>
          <PrivacyBoundaryNotice message="선택 참석자 응답은 집계로만 보여요. 개인 응답은 표시되지 않아요." />
        </div>

        {/* 정렬 토글 */}
        <div role="group" aria-label="정렬" className="sort-toggle" style={{ marginBottom: "var(--sp-4)" }}>
          {(["recommended", "time"] as const).map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={sortMode === m}
              data-on={sortMode === m}
              onClick={() => setSortMode(m)}
            >
              {m === "recommended" ? "추천순" : "시간순"}
            </button>
          ))}
        </div>

        {/* 추천 슬롯 리스트 */}
        <div className="dash-grid">
          {display.map((scored) => (
            <SlotCardAggregate
              key={scored.slot.id}
              scored={scored}
              rank={rankOf.get(scored.slot.id) ?? 0}
              scale={scale}
              attendees={attendees}
              responses={responses}
              onConfirm={setConfirmSlot}
            />
          ))}
        </div>

        {/* 범례 (IntensityScale 자동 생성) */}
        <div style={{ margin: "var(--sp-6) 0 var(--sp-5)" }}>
          <h2 style={{ font: "var(--t-label)", color: "var(--c-ink-mute)", margin: "0 0 var(--sp-2)" }}>강도 범례</h2>
          <Legend scale={scale} />
        </div>

        {/* 미응답 현황 */}
        <section>
          <h2 style={{ font: "var(--t-title)", margin: "0 0 var(--sp-3)" }}>아직 응답 전인 사람</h2>
          <PendingAttendeeList
            pending={pending}
            reminded={reminded}
            onRemind={(id) => setReminded((r) => new Set(r).add(id))}
          />
        </section>
      </div>

      {confirmSlot && slotToConfirm && (
        <ConfirmSheet
          title="이 시간으로 확정할까요?"
          body={`${slotToConfirm.slot.date} ${slotToConfirm.slot.start}–${slotToConfirm.slot.end} · 필수 ${slotToConfirm.requiredAvailable}/${slotToConfirm.requiredTotal} 가능`}
          warning={
            slotToConfirm.requiredAvailable < slotToConfirm.requiredTotal
              ? `필수 ${slotToConfirm.requiredTotal - slotToConfirm.requiredAvailable}명이 어려운 시간이에요. 그래도 확정할 수 있어요.`
              : null
          }
          confirmVariant={
            slotToConfirm.requiredAvailable < slotToConfirm.requiredTotal ? "warning" : "primary"
          }
          confirmLabel={
            slotToConfirm.requiredAvailable < slotToConfirm.requiredTotal ? "그래도 확정" : "확정"
          }
          cancelLabel="취소"
          onConfirm={() => {
            setConfirmedSlot(confirmSlot);
            setConfirmSlot(null);
          }}
          onCancel={() => setConfirmSlot(null)}
        />
      )}

      {confirmedSlot && (
        <div style={{ position: "fixed", left: 16, right: 16, bottom: 24, zIndex: 40, maxWidth: 420, margin: "0 auto" }}>
          <Toast message="회의 시간을 확정했어요" tone="info" />
        </div>
      )}
    </div>
  );
}
