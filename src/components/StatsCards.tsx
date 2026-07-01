type StatsCardsProps = {
  physical: number;
  mental: number;
  rest: number;
  average: number;
};

export function StatsCards({ physical, mental, rest, average }: StatsCardsProps) {
  return (
    <section className="stats">
      <div>
        <strong>{physical.toFixed(1)}h</strong>
        <span>🚶 physical</span>
      </div>
      <div>
        <strong>{mental.toFixed(1)}h</strong>
        <span>🧠 mental</span>
      </div>
      <div>
        <strong>{rest.toFixed(1)}h</strong>
        <span>😌 rest</span>
      </div>
      <div>
        <strong>{average.toFixed(1)}</strong>
        <span>avg tiredness</span>
      </div>
    </section>
  );
}