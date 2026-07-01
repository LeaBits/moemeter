import type { User } from "firebase/auth";
import { useAllEntries } from "../hooks/useAllEntries";
import { displayDate } from "../utils/dates";

type CalendarPageProps = {
  user: User;
};

function average(values: number[]) {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function tirednessClass(value: number) {
  if (value <= 3) return "low";
  if (value <= 6) return "medium";
  if (value <= 8) return "high";
  return "very-high";
}

export function CalendarPage({ user }: CalendarPageProps) {
  const { entries } = useAllEntries(user);

  const days = Object.values(
    entries.reduce<Record<string, { date: string; tiredness: number[]; count: number }>>(
      (groups, entry) => {
        if (!groups[entry.date]) {
          groups[entry.date] = {
            date: entry.date,
            tiredness: [],
            count: 0,
          };
        }

        groups[entry.date].tiredness.push(entry.tiredness);
        groups[entry.date].count += 1;

        return groups;
      },
      {}
    )
  )
    .map((day) => ({
      ...day,
      average: average(day.tiredness),
    }))
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <section className="page">
      <header className="card">
        <h1>History</h1>
        <p className="subtitle">Browse your logged days.</p>
      </header>

      <section className="card">
        {days.length === 0 ? (
          <p className="empty">No history yet.</p>
        ) : (
          <div className="history-list">
            {days.map((day) => (
              <article key={day.date} className="history-row">
                <div>
                  <strong>{displayDate(day.date)}</strong>
                  <span>{day.count} observations</span>
                </div>

                <span className={`history-score ${tirednessClass(day.average)}`}>
                  {day.average.toFixed(1)}
                </span>
              </article>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}
