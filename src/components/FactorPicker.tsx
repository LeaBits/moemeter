import { useState } from "react";
import type { Factor } from "../types";

const emojiOptions = [
  "😴",
  "🛏️",
  "⏰",
  "🤒",
  "🤕",
  "💊",
  "🚗",
  "🚆",
  "🏠",
  "💼",
  "👥",
  "🧠",
  "☀️",
  "🌧️",
  "🔊",
  "📱",
  "☕",
  "🏷️",
];

type FactorPickerProps = {
  factors: Factor[];
  selectedFactorIds: string[];
  onChange: (ids: string[]) => void;
  onAddFactor: (name: string, emoji: string) => Promise<string | null>;
};

export function FactorPicker({
  factors,
  selectedFactorIds,
  onChange,
  onAddFactor,
}: FactorPickerProps) {
  const [newFactorName, setNewFactorName] = useState("");
  const [newFactorEmoji, setNewFactorEmoji] = useState("🏷️");
  const [isAdding, setIsAdding] = useState(false);

  function toggleFactor(id: string) {
    if (selectedFactorIds.includes(id)) {
      onChange(selectedFactorIds.filter((factorId) => factorId !== id));
    } else {
      onChange([...selectedFactorIds, id]);
    }
  }

  async function handleAdd() {
    if (!newFactorName.trim()) return;

    const newFactorId = await onAddFactor(newFactorName.trim(), newFactorEmoji);

    if (newFactorId) {
      onChange([...selectedFactorIds, newFactorId]);
    }

    setNewFactorName("");
    setNewFactorEmoji("🏷️");
    setIsAdding(false);
  }

  return (
    <div className="factor-picker">
      <span className="field-title">Factors</span>

      <div className="factor-chips">
        {factors.map((factor) => (
          <button
            key={factor.id}
            type="button"
            className={
              factor.id && selectedFactorIds.includes(factor.id)
                ? "factor-chip selected"
                : "factor-chip"
            }
            onClick={() => factor.id && toggleFactor(factor.id)}
          >
            {factor.emoji} {factor.name}
          </button>
        ))}

        <button
          type="button"
          className="factor-chip add-chip"
          onClick={() => setIsAdding((current) => !current)}
        >
          + Add
        </button>
      </div>

      {isAdding && (
        <div className="inline-factor-form">
          <div className="factor-add-row">
            <select
              value={newFactorEmoji}
              onChange={(e) => setNewFactorEmoji(e.target.value)}
              aria-label="Factor emoji"
            >
              {emojiOptions.map((emoji) => (
                <option key={emoji} value={emoji}>
                  {emoji}
                </option>
              ))}
            </select>

            <input
              value={newFactorName}
              onChange={(e) => setNewFactorName(e.target.value)}
              placeholder="New factor..."
              aria-label="Factor name"
            />
          </div>

          <button type="button" onClick={handleAdd}>
            Save factor
          </button>
        </div>
      )}
    </div>
  );
}
