import type { ActivityType, Factor } from "../types";
import { FactorPicker } from "./FactorPicker";

type EntryFormProps = {
  editingId: string | null;
  startTime: string;
  endTime: string;
  type: ActivityType;
  tiredness: number;
  notes: string;
  factorIds: string[];
  factors: Factor[];
  setStartTime: (value: string) => void;
  setEndTime: (value: string) => void;
  setType: (value: ActivityType) => void;
  setTiredness: (value: number) => void;
  setNotes: (value: string) => void;
  setFactorIds: (value: string[]) => void;
  addFactor: (name: string, emoji: string) => Promise<string | null>;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
};

export function EntryForm({
  editingId,
  startTime,
  endTime,
  type,
  tiredness,
  notes,
  factorIds,
  factors,
  setStartTime,
  setEndTime,
  setType,
  setTiredness,
  setNotes,
  setFactorIds,
  addFactor,
  onSubmit,
  onCancel,
}: EntryFormProps) {
  return (
    <form onSubmit={onSubmit} className="card form-card">
      <h2>{editingId ? "Edit observation" : "New observation"}</h2>

      <div className="time-row">
        <label>
          From
          <input
            type="time"
            step="900"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </label>

        <label>
          To
          <input
            type="time"
            step="900"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </label>
      </div>

      <label>
        Type
        <select
          value={type}
          className={`activity-select ${type}`}
          onChange={(e) => setType(e.target.value as ActivityType)}
        >
          <option value="physical">🚶 Physical</option>
          <option value="mental">🧠 Mental</option>
          <option value="rest">😌 Rest</option>
        </select>
      </label>

      <label>
        Tiredness afterwards: {tiredness}/10
        <input
          type="range"
          min="0"
          max="10"
          value={tiredness}
          onChange={(e) => setTiredness(Number(e.target.value))}
        />
      </label>

      <FactorPicker
        factors={factors}
        selectedFactorIds={factorIds}
        onChange={setFactorIds}
        onAddFactor={addFactor}
      />

      <label>
        Notes
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} required />
      </label>

      <button type="submit">{editingId ? "Update moe" : "Save moe"}</button>

      <button type="button" className="secondary-button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
}
