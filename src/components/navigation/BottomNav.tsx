export type Page = "today" | "calendar" | "insights" | "settings";

type BottomNavProps = {
  page: Page;
  setPage: (page: Page) => void;
};

export function BottomNav({ page, setPage }: BottomNavProps) {
  return (
    <nav className="bottom-nav">
      <button
        className={page === "today" ? "active" : ""}
        onClick={() => setPage("today")}
      >
        🏠<span>Today</span>
      </button>
      <button
        className={page === "calendar" ? "active" : ""}
        onClick={() => setPage("calendar")}
      >
        📅<span>History</span>
      </button>
      <button
        className={page === "insights" ? "active" : ""}
        onClick={() => setPage("insights")}
      >
        🧠<span>Patterns</span>
      </button>
      <button
        className={page === "settings" ? "active" : ""}
        onClick={() => setPage("settings")}
      >
        ⚙️<span>Settings</span>
      </button>
    </nav>
  );
}
