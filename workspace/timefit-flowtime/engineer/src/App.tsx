/* 데모 셸 — 두 핵심 화면(참석자 응답 / 주최자 대시보드)을 전환해 본다.
   실제 제품에서는 라우팅으로 분리되나, 데모는 한 화면에서 둘 다 확인 가능하게 한다. */
import { useState } from "react";
import { mockMeeting } from "./data/mockMeeting";
import { RespondScreen } from "./screens/RespondScreen";
import { DashboardScreen } from "./screens/DashboardScreen";
import styles from "./App.module.css";

type View = "respond" | "dashboard";

export default function App() {
  const [view, setView] = useState<View>("respond");

  return (
    <div className={styles.app}>
      {/* 데모 전환 바 (제품 UI 아님 — 검토용) */}
      <nav className={styles.demoNav} aria-label="데모 화면 전환">
        <span className={styles.brand}>timefit</span>
        <div className={styles.tabs}>
          <button
            type="button"
            data-active={view === "respond"}
            onClick={() => setView("respond")}
          >
            참석자 응답
          </button>
          <button
            type="button"
            data-active={view === "dashboard"}
            onClick={() => setView("dashboard")}
          >
            주최자 대시보드
          </button>
        </div>
      </nav>

      <div className={styles.stage}>
        {view === "respond" ? (
          // 우민지(선택 참석자) = 솔직함 보호 시연
          <RespondScreen meeting={mockMeeting} attendeeId="a6" />
        ) : (
          <DashboardScreen meeting={mockMeeting} />
        )}
      </div>
    </div>
  );
}
