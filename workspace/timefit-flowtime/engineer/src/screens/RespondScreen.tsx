/* SCR-MOB-RESP-001 ★ 참석자 응답 / 강도 입력.
   타겟: 우민지(선택, 솔직함 보호). 모바일 전용 420px 중앙.
   무응답이 정상 · 부정 강도 무경고 · 비공개 상주 · 입력값 보존. */
import { useMemo, useState } from "react";
import type { IntensityId } from "../data/intensityScale";
import type { Meeting } from "../data/types";
import { InputSlotCard } from "../components/InputSlotCard";
import { RoleBadge } from "../components/Badge";
import { ReassuranceNotice, PersistentPrivacy } from "../components/Banners";
import { Button } from "../components/Button";
import { Sheet } from "../components/Sheet";
import { Toast, type ToastState } from "../components/Toast";
import { useReveal } from "../lib/useReveal";
import styles from "./RespondScreen.module.css";

interface Props {
  meeting: Meeting;
  /** 응답 중인 참석자 (데모: 우민지 = 선택) */
  attendeeId: string;
}

type Answers = Record<string, { intensity: IntensityId | null; comment?: string }>;

export function RespondScreen({ meeting, attendeeId }: Props) {
  const attendee = meeting.attendees.find((a) => a.id === attendeeId)!;
  const isOptional = attendee.role === "optional";

  const [answers, setAnswers] = useState<Answers>({});
  const [commentSlot, setCommentSlot] = useState<string | null>(null);
  const [draftComment, setDraftComment] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const answeredCount = useMemo(
    () => Object.values(answers).filter((a) => a.intensity).length,
    [answers]
  );
  const total = meeting.slots.length;

  function setIntensity(slotId: string, id: IntensityId | null) {
    setAnswers((prev) => ({
      ...prev,
      [slotId]: { ...prev[slotId], intensity: id },
    }));
  }

  function openComment(slotId: string) {
    setCommentSlot(slotId);
    setDraftComment(answers[slotId]?.comment ?? "");
  }
  function saveComment() {
    if (!commentSlot) return;
    setAnswers((prev) => ({
      ...prev,
      [commentSlot]: { ...prev[commentSlot], comment: draftComment.trim() || undefined },
    }));
    setCommentSlot(null);
  }

  function trySubmit() {
    // 일부만 응답(또는 무응답 전체)이어도 확인 1회 후 허용
    if (answeredCount < total) {
      setConfirmOpen(true);
    } else {
      doSubmit();
    }
  }
  function doSubmit() {
    setConfirmOpen(false);
    // mock: 항상 성공 경로. (error 데모는 데모 패널에서 강제)
    setSubmitted(true);
  }

  if (submitted) {
    return <RespondDoneScreen optional={isOptional} onEdit={() => setSubmitted(false)} />;
  }

  return (
    <div className={styles.screen}>
      {/* 상단 고정 바 */}
      <header className={styles.topbar}>
        <div className={styles.topRow}>
          <h1 className={`${styles.title} t-h`}>{meeting.title}</h1>
          <span className={`${styles.progress} t-meta`} aria-live="polite">
            {answeredCount} / {total} 응답
          </span>
        </div>
        <div className={styles.role}>
          <RoleBadge role={attendee.role} />
        </div>
      </header>

      {/* 비공개 상주 고지 (NFR-002) */}
      {isOptional && <PersistentPrivacy text="이 응답은 비공개예요" />}

      <main className={styles.body}>
        {/* 안심 — 선택 참석자만 강조 */}
        {isOptional && (
          <ReassuranceNotice variant="reassurance">
            {"안 돼도 회의는 진행돼요.\n솔직하게 답해도 괜찮아요."}
          </ReassuranceNotice>
        )}

        <div className={styles.slots}>
          {meeting.slots.map((slot, i) => (
            <RevealCard key={slot.id} delay={i * 80}>
              <InputSlotCard
                slot={slot}
                value={answers[slot.id]?.intensity ?? null}
                comment={answers[slot.id]?.comment}
                onChange={(id) => setIntensity(slot.id, id)}
                onComment={() => openComment(slot.id)}
              />
            </RevealCard>
          ))}
        </div>

        <p className={`${styles.tip} t-caption`}>
          답하지 않은 시간이 있어도 괜찮아요. 그대로 제출할 수 있어요.
        </p>
      </main>

      {/* 하단 고정 CTA */}
      <div className={styles.cta}>
        <Button variant="primary" size="lg" fullWidth onClick={trySubmit}>
          응답 제출
        </Button>
      </div>

      {/* 부분 제출 확인 시트 */}
      <Sheet open={confirmOpen} onClose={() => setConfirmOpen(false)} labelledBy="confirm-title">
        <h2 id="confirm-title" className={`${styles.sheetTitle} t-title`}>
          {"아직 응답하지 않은 시간이 있어요.\n그대로 제출할까요?"}
        </h2>
        <div className={styles.sheetActions}>
          <Button variant="secondary" size="lg" fullWidth onClick={() => setConfirmOpen(false)}>
            더 채우기
          </Button>
          <Button variant="primary" size="lg" fullWidth onClick={doSubmit}>
            그대로 제출
          </Button>
        </div>
      </Sheet>

      {/* 코멘트 시트 (RESP-001b) */}
      <Sheet open={commentSlot !== null} onClose={() => setCommentSlot(null)} labelledBy="comment-title">
        <h2 id="comment-title" className={`${styles.sheetTitle} t-title`}>
          사정 남기기
        </h2>
        <textarea
          className={styles.textarea}
          placeholder="사정을 짧게 남겨도 돼요"
          value={draftComment}
          maxLength={120}
          onChange={(e) => setDraftComment(e.target.value)}
        />
        <p className={`${styles.privacyCaption} t-caption`}>
          남긴 사정도 다른 참석자에게 보이지 않아요
        </p>
        <div className={styles.sheetActions}>
          <Button variant="secondary" size="lg" fullWidth onClick={() => setCommentSlot(null)}>
            취소
          </Button>
          <Button variant="primary" size="lg" fullWidth onClick={saveComment}>
            저장
          </Button>
        </div>
      </Sheet>

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}

function RevealCard({ children, delay }: { children: React.ReactNode; delay: number }) {
  const { ref, shown } = useReveal();
  return (
    <div
      ref={ref}
      className={`reveal ${shown ? "is-in" : ""}`}
      style={{ transitionDelay: shown ? `${delay}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}

/* RESP-002 완료 */
function RespondDoneScreen({ optional, onEdit }: { optional: boolean; onEdit: () => void }) {
  return (
    <div className={styles.done}>
      <div className={styles.doneInner}>
        <div className={styles.check} aria-hidden="true">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path
              d="M7 14.5l4.5 4.5L21 9"
              stroke="var(--c-sage)"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h1 className="t-display">응답을 전달했어요</h1>
        <p className={`${styles.doneSub} t-body`}>
          {optional
            ? "응답은 다른 참석자에게 보이지 않게 전달됐어요"
            : "주최자가 모인 응답으로 시간을 정할 거예요"}
        </p>
        <Button variant="secondary" size="md" onClick={onEdit}>
          응답 수정
        </Button>
      </div>
    </div>
  );
}
