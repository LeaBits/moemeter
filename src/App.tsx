import { useState } from "react";
import { useAuth } from "./hooks/useAuth";
import { TodayPage } from "./pages/TodayPage";
import { CalendarPage } from "./pages/CalendarPage";
import { InsightsPage } from "./pages/InsightsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { BottomNav, type Page } from "./components/navigation/BottomNav";
import "./styles/app.css";

export default function App() {
  const { user, login, logout } = useAuth();
  const [page, setPage] = useState<Page>("today");

  if (!user) {
    return (
      <main className="app login-screen">
        <h1>Moemeter</h1>
        <p className="subtitle">Your personal energy timeline.</p>
        <button onClick={login}>Sign in with Google</button>
      </main>
    );
  }

  return (
    <main className="app">
      {page === "today" && (
        <TodayPage user={user} onManageFactors={() => setPage("settings")} />
        )}
      {page === "calendar" && <CalendarPage />}
      {page === "insights" && <InsightsPage />}
      {page === "settings" && <SettingsPage user={user} logout={logout} />}

      <BottomNav page={page} setPage={setPage} />
    </main>
  );
}