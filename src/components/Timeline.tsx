import type { Factor, MoeEntry } from "../types";
import { TimelineItem } from "./TimelineItem";

type TimelineProps = {
  entries: MoeEntry[];
  factors: Factor[];
  onEdit: (entry: MoeEntry) => void;
  onDelete: (entryId: string) => void;
};

export function Timeline({ entries, factors, onEdit, onDelete }: TimelineProps) {
  if (entries.length === 0) {
    return <p className="empty">No moe logged yet.</p>;
  }

  return (
    <div className="compact-timeline">
      {entries.map((entry) => (
        <TimelineItem
          key={entry.id}
          entry={entry}
          factors={factors}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}