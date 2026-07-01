import { useState } from "react";
import type { Factor, MoeEntry } from "../types";

const icons = {
  physical: "🚶",
  mental: "🧠",
  rest: "😌",
};

function tirednessColor(value: number) {
  if (value <= 3) return "low";
  if (value <= 6) return "medium";
  if (value <= 8) return "high";
  return "very-high";
}

type TimelineItemProps = {
  entry: MoeEntry;
  factors: Factor[];
  onEdit: (entry: MoeEntry) => void;
  onDelete: (entryId: string) => void;
};

export function TimelineItem({ entry, factors, onEdit, onDelete }: TimelineItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  const entryFactors = factors.filter((factor) =>
    entry.factorIds?.includes(factor.id ?? "")
  );

  return (
    <article className={`timeline-item ${entry.type}`}>
      <div className={`timeline-dot type-dot ${entry.type}`}>{icons[entry.type]}</div>

      <button
        type="button"
        className="timeline-summary"
        onClick={() => setIsOpen((current) => !current)}
      >
        <div>
          <strong>{entry.notes}</strong>
          <span>
            {entry.startTime}–{entry.endTime} · {icons[entry.type]} {entry.type}
          </span>
        </div>

        <span className={`tiredness-pill ${tirednessColor(entry.tiredness)}`}>
          {entry.tiredness}/10
        </span>
      </button>

      {entryFactors.length > 0 && (
        <div className="timeline-factor-row">
          {entryFactors.map((factor) => (
            <span key={factor.id} title={factor.name}>
              {factor.emoji}
            </span>
          ))}
        </div>
      )}

      {isOpen && (
        <div className="timeline-details">
          <p>{entry.notes}</p>

          {entryFactors.length > 0 && (
            <div className="entry-factors">
              {entryFactors.map((factor) => (
                <span key={factor.id} className="entry-factor">
                  {factor.emoji} {factor.name}
                </span>
              ))}
            </div>
          )}

          <div className="entry-actions">
            <button type="button" onClick={() => onEdit(entry)}>
              Edit
            </button>
            <button
              type="button"
              className="danger-button"
              onClick={() => entry.id && onDelete(entry.id)}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
