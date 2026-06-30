/* SCR-WEB-DASH-001 ★ 주최자 집계 대시보드.
   deterministic 추천 정렬(§0.3) · 강도 분포 · 미응답 · 확정.
   모바일 카드 / 데스크톱 넓은 폭. 점수(=weight 합) ≠ 분포막대(=건수). */
import { useMemo, useState } from "react";
import type { Meeting } from "../data/types";
import { recommend, sortByTime, type SlotAggregate } from "../lib/recommend";
import { SummaryBento } from "../components/SummaryBento";
import { SegmentedToggle } from "../components/SegmentedToggle";
import { IntensityLegend } from "../components/IntensityLegend";
import { AggregateSlotCard } from "../components/AggregateSlotCard";
import { ExcludedSlotSection } from "../components/ExcludedSlotSection";
import { PendingAttendeeList } from "../components/PendingAttendeeList";
import { WarningBanner } from "../components/Banners";
import { Button } from "../components/Button";
import { Sheet } from "../components/Sheet";
import { Toast, type ToastState } from "../components/Toast";
import { formatSlotShort } from "../lib/format";
import styles from "./DashboardScreen.module.css";

export function DashboardScreen({ meeting }: { meeting: Meeting }) {
  const [sort, setSort] = useState<"recommended" | "time">("recommended");
  const [confirmSlot, setConfirmSlot] = useState<SlotAggregate | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  // 추천 계산은 순수 함수. 정렬 토글은 표시 순서만 바꾼다(점수 불변).
  const result = useMemo(() => recommend(meeting), [meeting]);

  const respondedAttendees = useMemo(() => {
    const ids = new Set(meeting.responses.map((r) => r.attendeeId));
    return ids.size;
  }, [meeting]);
  const pendingAttendees = useMemo(() => {
    const ids = new Set(meeting.responses.map((r) => r.attendeeId));
    return meeting.attendees.filter((a) => !ids.has(a.id));
  }, [meeting]);

  const displayed =
    sort === "recommended" ? result.recommended : sortByTime(result.recommended);

  const requiredAll = meeting.attendees.filter((a) => a.role === "required").length;

  function confirm() {
    if (!confirmSlot) return;
    setConfirmSlot(null);
    setToast({ kind: "info", message: "이 시간으로 확정했어요" });
  }

  // 확정 시트의 경고 여부 판단
  const confirmWarning = confirmSlot
    ? confirmSlot.excluded
      ? "이 시간은 필수 참석자에게 어려운 시간이에요.\n그래도 확정할 수 있어요."
      : confirmSlot.requiredMet < requiredAll
        ? "필수 참석자 일부가 아직 응답하지 않았어요.\n그래도 이 시간으로 확정할 수 있어요."
        : null
    : null;

  return (
    <div className={styles.screen}>
      <div className={styles.container}>
        <header className={styles.head}>
          <h1 className="t-title">{meeting.title}</h1>
        </header>

        <SummaryBento
          responded={respondedAttendees}
          total={meeting.attendees.length}
          pending={pendingAttendees.length}
          deadlineLabel={meeting.deadlineLabel}
        />
        <p className={`${styles.boundary} t-caption`}>
          선택 참석자 응답은 집계로만 보여요
        </p>

        {/* 잠정 추천 경고 (필수 응답 0) */}
        {result.tentative && (
          <WarningBanner message={"필수 참석자 응답을 기다리는 중이에요.\n지금 추천은 잠정값이에요."} />
        )}

        {/* 추천 영역 헤더 + 정렬 토글 + 범례 */}
        <section className={styles.recSection}>
          <div className={styles.recHead}>
            <h2 className="t-h">추천 슬롯</h2>
            <SegmentedToggle
              ariaLabel="추천 정렬"
              value={sort}
              onChange={setSort}
              options={[
                { value: "recommended", label: "추천순" },
                { value: "time", label: "시간순" },
              ]}
            />
          </div>
          <IntensityLegend />

          {/* 본문 상태 분기 */}
          {result.noResponses ? (
            <EmptyState
              title={"아직 응답이 없어요.\n링크를 공유해 보세요."}
              actionLabel="링크 다시 공유"
              onAction={() => setToast({ kind: "info", message: "링크를 복사했어요" })}
            />
          ) : result.allExcluded ? (
            <EmptyState
              title={"필수 참석자가 모두 가능한 시간이 아직 없어요.\n후보 시간을 더 추가해 보세요."}
              actionLabel="후보 시간 추가"
              onAction={() => setToast({ kind: "info", message: "데모: 후보 시간 추가 화면으로 이동" })}
            />
          ) : (
            <div className={styles.recList}>
              {displayed.map((agg) => (
                <AggregateSlotCard
                  key={agg.slot.id}
                  agg={agg}
                  /* 순위는 추천순 정렬 기준 — 시간순 표시여도 점수 순위 유지 */
                  rank={result.recommended.indexOf(agg) + 1}
                  attendees={meeting.attendees}
                  tentative={result.tentative}
                  onConfirm={() => setConfirmSlot(agg)}
                />
              ))}
            </div>
          )}
        </section>

        {/* 제외 슬롯 접힘 영역 */}
        <ExcludedSlotSection slots={result.excluded} />

        {/* 미응답 현황 */}
        <section className={styles.pendingSection}>
          <h2 className={`${styles.pendingHead} t-h`}>미응답 현황</h2>
          <PendingAttendeeList pending={pendingAttendees} />
        </section>
      </div>

      {/* 확정 시트/모달 */}
      <Sheet open={confirmSlot !== null} onClose={() => setConfirmSlot(null)} labelledBy="dash-confirm">
        {confirmSlot && (
          <>
            <h2 id="dash-confirm" className={`${styles.sheetTitle} t-title`}>
              이 시간으로 확정할까요?
            </h2>
            <p className={`${styles.confirmSlot} t-meta`}>{formatSlotShort(confirmSlot.slot.start)}</p>
            {confirmWarning && <div className={styles.warnGap}><WarningBanner message={confirmWarning} /></div>}
            <div className={styles.sheetActions}>
              <Button variant="secondary" size="lg" fullWidth onClick={() => setConfirmSlot(null)}>
                취소
              </Button>
              <Button variant="primary" size="lg" fullWidth onClick={confirm}>
                확정
              </Button>
            </div>
          </>
        )}
      </Sheet>

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}

function EmptyState({
  title,
  actionLabel,
  onAction,
}: {
  title: string;
  actionLabel: string;
  onAction: () => void;
}) {
  return (
    <div className={styles.empty}>
      <p className={`${styles.emptyText} t-body`}>{title}</p>
      <Button variant="secondary" size="md" onClick={onAction}>
        {actionLabel}
      </Button>
    </div>
  );
}
