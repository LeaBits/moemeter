import { useState } from "react";
import type { User } from "firebase/auth";
import { useFactors } from "../hooks/useFactors";

const emojiOptions = [
  // Sleep
  "😴",
  "🛏️",
  "🌙",
  "⏰",

  // Health
  "🤒",
  "🤧",
  "🤕",
  "💊",
  "🩺",

  // Food & Drink
  "☕",
  "🫖",
  "🥤",
  "🍎",
  "🍽️",
  "💧",

  // Physical
  "🚶",
  "🏃",
  "🚴",
  "🏋️",
  "🚗",
  "🚆",
  "✈️",

  // Mental
  "🧠",
  "💼",
  "📚",
  "📝",
  "🎨",

  // Social
  "👥",
  "💬",
  "👨‍👩‍👧",
  "❤️",
  "🎉",

  // Environment
  "🏠",
  "🏢",
  "🌳",
  "☀️",
  "🌧️",
  "❄️",
  "🌡️",

  // Sensory
  "📱",
  "💻",
  "🔊",
  "🎧",
  "💡",

  // Recovery
  "😌",
  "🧘",
  "📖",
  "🎮",
  "📺",

  // Misc
  "🏷️",
];

type SettingsPageProps = {
  user: User;
  logout: () => void;
};

export function SettingsPage({ user, logout }: SettingsPageProps) {
  const { factors, addFactor, updateFactor, deleteFactor } = useFactors(user);

  const [newName, setNewName] = useState("");
  const [newEmoji, setNewEmoji] = useState("🏷️");

  async function handleAddFactor(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;

    await addFactor(newName.trim(), newEmoji);
    setNewName("");
    setNewEmoji("🏷️");
  }

  return (
    <section className="page">
      <header className="card settings-profile">
        {user.photoURL && <img src={user.photoURL} alt="" className="settings-avatar" />}

        <div>
          <h1>Settings</h1>
          <p className="subtitle">{user.displayName}</p>
          <p className="settings-email">{user.email}</p>
        </div>
      </header>

      <section className="card">
        <h2>Manage factors</h2>

        <div className="factor-list">
          {factors.length === 0 ? (
            <p className="empty">No factors yet.</p>
          ) : (
            factors.map((factor) => (
              <div key={factor.id} className="factor-card">
                <select
                  value={factor.emoji}
                  onChange={(e) =>
                    factor.id &&
                    updateFactor(factor.id, {
                      name: factor.name,
                      emoji: e.target.value,
                    })
                  }
                >
                  {emojiOptions.map((emoji) => (
                    <option key={emoji} value={emoji}>
                      {emoji}
                    </option>
                  ))}
                </select>

                <input
                  value={factor.name}
                  onChange={(e) =>
                    factor.id &&
                    updateFactor(factor.id, {
                      name: e.target.value,
                      emoji: factor.emoji,
                    })
                  }
                />

                <button
                  type="button"
                  className="danger-button"
                  onClick={() => factor.id && deleteFactor(factor.id)}
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="card">
        <h2>New factor</h2>

        <form onSubmit={handleAddFactor} className="factor-form">
          <div className="factor-add-row">
            <select
              value={newEmoji}
              onChange={(e) => setNewEmoji(e.target.value)}
              aria-label="Factor emoji"
            >
              {emojiOptions.map((emoji) => (
                <option key={emoji} value={emoji}>
                  {emoji}
                </option>
              ))}
            </select>

            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="New factor..."
              aria-label="Factor name"
            />
          </div>

          <button type="submit">Add factor</button>
        </form>
      </section>

      <section className="card">
        <button type="button" className="danger-button" onClick={logout}>
          Sign out
        </button>
      </section>
    </section>
  );
}
