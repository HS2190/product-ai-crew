// 데모 셸 — 두 핵심 화면을 탭으로 전환. (실서비스는 별도 라우트)
import { useState } from "react";
import { RespondScreen } from "./screens/RespondScreen";
import { DashboardScreen } from "./screens/DashboardScreen";
import "./styles/layout.css";

type View = "respond" | "dashboard";

export default function App() {
  const [view, setView] = useState<View>("respond");

  return (
    <div className="app-root">
      <nav className="demo-switch" aria-label="데모 화면 전환">
        <span className="demo-brand">timefit</span>
        <div className="demo-tabs">
          <button data-on={view === "respond"} aria-pressed={view === "respond"} onClick={() => setView("respond")}>
            참석자 응답
          </button>
          <button data-on={view === "dashboard"} aria-pressed={view === "dashboard"} onClick={() => setView("dashboard")}>
            주최자 대시보드
          </button>
        </div>
      </nav>

      <main className="demo-stage">
        {view === "respond" ? <RespondScreen /> : <DashboardScreen />}
      </main>
    </div>
  );
}
