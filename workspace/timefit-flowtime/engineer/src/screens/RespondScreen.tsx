// 화면 1 — 참석자 응답 (Mobile Web 전용). design-spec §2.
// 게이트(RESP-000) → 강도 입력(RESP-001, 핵심) → 완료(RESP-002).
// 우민지(선택 참석자) 관점 데모. 비공개 지속 노출 + 부정 강도 무경고.
import { useMemo, useState } from "react";
import { activeScale } from "../data/intensityScale";
import { respondentDemo } from "../data/mock";
import { RoleBadge } from "../components/RoleBadge";
import { ReassuranceBanner, PrivacyNotice } from "../components/Notices";
import { ProgressIndicator } from "../components/ProgressIndicator";
import { SlotCardRespond } from "../components/SlotCardRespond";
import { Button } from "../components/Button";
import { ConfirmSheet } from "../components/ConfirmSheet";
import { Toast } from "../components/Toast";

type Stage = "gate" | "input" | "done";

export function RespondScreen() {
  const { attendee, meeting } = respondentDemo;
  const isOptional = attendee.role === "optional";
  const scale = activeScale;

  const [stage, setStage] = useState<Stage>("gate");
  const [name, setName] = useState(attendee.name);
  const [values, setValues] = useState<Record<string, string | null>>({});
  const [comments, setComments] = useState<Record<string, string>>({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const answered = useMemo(
    () => meeting.slots.filter((s) => values[s.id]).length,
    [values, meeting.slots]
  );
  const total = meeting.slots.length;

  function submit() {
    if (answered < total) {
      setShowConfirm(true);
      return;
    }
    finalize();
  }

  function finalize() {
    setShowConfirm(false);
    setStage("done");
  }

  // ── 게이트 (RESP-000) ──────────────────────────────────────
  if (stage === "gate") {
    return (
      <div className="mob-shell">
        <div className="mob-scroll" style={{ padding: "var(--sp-6) var(--sp-4)" }}>
          <h1 style={{ font: "var(--t-display)", margin: "0 0 4px" }}>{meeting.title}</h1>
          <p style={{ font: "var(--t-caption)", color: "var(--c-ink-mute)", margin: "0 0 var(--sp-5)" }}>
            주최자 {meeting.organizerName} · {meeting.periodLabel}
          </p>

          <div style={{ marginBottom: "var(--sp-5)" }}>
            <RoleBadge role={attendee.role} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-3)", marginBottom: "var(--sp-6)" }}>
            <ReassuranceBanner
              variant={isOptional ? "emphasized" : "subtle"}
              message={
                isOptional
                  ? "당신이 안 돼도 회의는 진행돼요.\n솔직하게 답해도 괜찮아요."
                  : "이 시간에 대한 선호를 편하게 알려 주세요."
              }
            />
            <PrivacyNotice
              variant="block"
              visible={isOptional}
              message="내 응답은 다른 참석자에게 보이지 않아요."
            />
          </div>

          <label style={{ display: "block", font: "var(--t-label)", color: "var(--c-ink-soft)", marginBottom: 6 }}>
            회의에서 불릴 이름
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: "100%",
              minHeight: 48,
              padding: "0 14px",
              border: "var(--border-hairline)",
              borderRadius: "var(--r-md)",
              font: "var(--t-body)",
              fontSize: 16,
            }}
          />
        </div>

        <div className="mob-bar">
          <Button variant="primary" fullWidth onClick={() => setStage("input")} disabled={!name.trim()}>
            응답 시작
          </Button>
        </div>
      </div>
    );
  }

  // ── 완료 (RESP-002) ────────────────────────────────────────
  if (stage === "done") {
    return (
      <div className="mob-shell">
        <div className="mob-scroll" style={{ padding: "var(--sp-12) var(--sp-4)", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "var(--sp-4)" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--c-brand-soft)", display: "grid", placeItems: "center" }}>
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="var(--s-success)" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12.5l4.5 4.5L19 7" />
            </svg>
          </div>
          <h1 style={{ font: "var(--t-title)", margin: 0 }}>응답을 전달했어요</h1>
          {isOptional && (
            <PrivacyNotice
              variant="reconfirm"
              message="내 응답은 비공개로 전달됐어요.\n다른 참석자에게는 보이지 않아요."
            />
          )}
          <button
            type="button"
            onClick={() => setStage("input")}
            style={{ background: "none", border: "none", color: "var(--c-brand)", font: "var(--t-body-strong)", cursor: "pointer", marginTop: "var(--sp-2)" }}
          >
            응답 수정
          </button>
        </div>
      </div>
    );
  }

  // ── 강도 입력 (RESP-001, 핵심) ─────────────────────────────
  return (
    <div className="mob-shell">
      {/* 상단 고정 바: 진행 + 비공개 점 */}
      <header className="mob-topbar">
        <ProgressIndicator answered={answered} total={total} />
        {isOptional && <PrivacyNotice variant="persistent-bar" message="비공개" />}
      </header>

      <div className="mob-scroll" style={{ padding: "var(--sp-4)" }}>
        <h1 style={{ font: "var(--t-title)", margin: "0 0 2px" }}>{meeting.title}</h1>
        <p style={{ font: "var(--t-caption)", color: "var(--c-ink-mute)", margin: "0 0 var(--sp-4)" }}>
          주최자 {meeting.organizerName} · {meeting.periodLabel}
        </p>

        {/* 비공개 상주 배너 (선택 참석자) — 스크롤 내내 sticky */}
        {isOptional && (
          <div style={{ position: "sticky", top: 0, zIndex: 2, paddingBottom: "var(--sp-3)", background: "var(--c-paper)" }}>
            <PrivacyNotice variant="persistent-top" message="내 응답은 다른 참석자에게 보이지 않아요" />
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-3)" }}>
          {meeting.slots.map((slot) => (
            <SlotCardRespond
              key={slot.id}
              slot={slot}
              scale={scale}
              value={values[slot.id] ?? null}
              onChange={(id) => setValues((v) => ({ ...v, [slot.id]: id }))}
              comment={comments[slot.id] ?? ""}
              onComment={(text) => setComments((c) => ({ ...c, [slot.id]: text }))}
            />
          ))}
        </div>
        <div style={{ height: 84 }} />
      </div>

      {toast && (
        <div style={{ position: "fixed", left: 16, right: 16, bottom: 88, zIndex: 40, maxWidth: 448, margin: "0 auto" }}>
          <Toast message={toast} tone="error" />
        </div>
      )}

      {/* 하단 고정 바: 비공개 라벨 + 제출(엄지 존) */}
      <div className="mob-bar" style={{ display: "flex", flexDirection: "column", gap: "var(--sp-2)" }}>
        {isOptional && (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <PrivacyNotice variant="persistent-bar" message="비공개로 전달돼요" />
          </div>
        )}
        <Button variant="primary" fullWidth onClick={submit}>
          응답 제출 ({answered}/{total})
        </Button>
      </div>

      {showConfirm && (
        <ConfirmSheet
          title="그대로 제출할까요?"
          body={"아직 응답하지 않은 시간이 있어요.\n그대로 제출해도 괜찮아요."}
          confirmLabel="그대로 제출"
          cancelLabel="마저 응답하기"
          onConfirm={finalize}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      {/* 데모: 제출 실패 토스트 트리거(숨김) — 입력 보존 검증용. 미사용 setToast 경고 방지 */}
      <button hidden onClick={() => setToast("잠시 후 다시 시도해 주세요. 입력한 내용은 그대로 남아 있어요.")} />
    </div>
  );
}
