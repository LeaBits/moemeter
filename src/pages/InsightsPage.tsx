import type { User } from "firebase/auth";
import { useAllEntries } from "../hooks/useAllEntries";
import { useFactors } from "../hooks/useFactors";
import type { ActivityType } from "../types";

type InsightsPageProps = {
  user: User;
};

function average(values: number[]) {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function InsightsPage({ user }: InsightsPageProps) {
  const { entries } = useAllEntries(user);
  const { factors } = useFactors(user);

  const overallAverage = average(entries.map((entry) => entry.tiredness));

  const activityTypes: ActivityType[] = ["physical", "mental", "rest"];

  const activityAverages = activityTypes.map((type) => {
    const matchingEntries = entries.filter((entry) => entry.type === type);

    return {
      type,
      count: matchingEntries.length,
      average: average(matchingEntries.map((entry) => entry.tiredness)),
    };
  });

  const factorAverages = factors
    .map((factor) => {
      const matchingEntries = entries.filter((entry) =>
        entry.factorIds?.includes(factor.id ?? "")
      );

      return {
        factor,
        count: matchingEntries.length,
        average: average(matchingEntries.map((entry) => entry.tiredness)),
        difference:
          average(matchingEntries.map((entry) => entry.tiredness)) - overallAverage,
      };
    })
    .filter((item) => item.count > 0)
    .sort((a, b) => b.average - a.average);

  return (
    <section className="page">
      <header className="card">
        <h1>Patterns</h1>
        <p className="subtitle">Discover what is associated with your tiredness.</p>
      </header>

      <section className="card">
        <h2>Overview</h2>

        <div className="pattern-grid">
          <div>
            <strong>{entries.length}</strong>
            <span>observations</span>
          </div>

          <div>
            <strong>{overallAverage.toFixed(1)}</strong>
            <span>average tiredness</span>
          </div>
        </div>
      </section>

      <section className="card">
        <h2>Activity types</h2>

        <div className="pattern-list">
          {activityAverages.map((item) => (
            <div key={item.type} className={`pattern-row ${item.type}`}>
              <span>
                {item.type === "physical" && "🚶 Physical"}
                {item.type === "mental" && "🧠 Mental"}
                {item.type === "rest" && "😌 Rest"}
              </span>

              <strong>{item.average.toFixed(1)} / 10</strong>

              <small>{item.count} observations</small>
            </div>
          ))}
        </div>
      </section>

      <section className="card">
        <h2>Most tiring factors</h2>

        {factorAverages.length === 0 ? (
          <p className="empty">No factor data yet.</p>
        ) : (
          <div className="pattern-list">
            {factorAverages.map((item) => (
              <div key={item.factor.id} className="pattern-row">
                <span>
                  {item.factor.emoji} {item.factor.name}
                </span>

                <strong>{item.average.toFixed(1)} / 10</strong>

                <small>
                  {item.count} observations · {item.difference >= 0 ? "+" : ""}
                  {item.difference.toFixed(1)} vs average
                </small>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="card">
        <h2>Discoveries</h2>

        {factorAverages.length === 0 ? (
          <p className="empty">Add more observations with factors first.</p>
        ) : (
          <div className="discovery-list">
            {factorAverages.slice(0, 3).map((item) => (
              <p key={item.factor.id} className="discovery">
                💡 Entries tagged with{" "}
                <strong>
                  {item.factor.emoji} {item.factor.name}
                </strong>{" "}
                are associated with an average tiredness of{" "}
                <strong>{item.average.toFixed(1)} / 10</strong>.
              </p>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}
