import { useEffect, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { auth, db, googleProvider } from "./firebase";
import type { ActivityType, MoeEntry } from "./types";
import "./App.css";

const icons = {
  physical: "🚶",
  mental: "🧠",
  rest: "😌",
};

function today() {
  return new Date().toISOString().slice(0, 10);
}

function displayDate(date: string) {
  return new Date(date).toLocaleDateString("nl-NL");
}

function timeToMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function durationHours(entry: MoeEntry) {
  return Math.max(
    (timeToMinutes(entry.endTime) - timeToMinutes(entry.startTime)) / 60,
    0
  );
}

function sortByStartTime(entries: MoeEntry[]) {
  return [...entries].sort((a, b) => a.startTime.localeCompare(b.startTime));
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [date, setDate] = useState(today());
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("11:00");
  const [type, setType] = useState<ActivityType>("physical");
  const [filter, setFilter] = useState<ActivityType | "all">("all");
  const [tiredness, setTiredness] = useState(5);
  const [notes, setNotes] = useState("");
  const [entries, setEntries] = useState<MoeEntry[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => onAuthStateChanged(auth, setUser), []);

  async function login() {
    await signInWithPopup(auth, googleProvider);
  }

  async function logout() {
    await signOut(auth);
    setEntries([]);
  }

  async function loadEntries(selectedDate: string, currentUser: User) {
    const q = query(
      collection(db, "moeEntries"),
      where("userId", "==", currentUser.uid),
      where("date", "==", selectedDate)
    );

    const snapshot = await getDocs(q);

    setEntries(
      sortByStartTime(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<MoeEntry, "id">),
        }))
      )
    );
  }

  useEffect(() => {
    if (user) loadEntries(date, user);
  }, [date, user]);

  function resetForm() {
    setStartTime("10:00");
    setEndTime("11:00");
    setType("physical");
    setTiredness(5);
    setNotes("");
    setEditingId(null);
  }

  function startEdit(entry: MoeEntry) {
    setEditingId(entry.id ?? null);
    setDate(entry.date);
    setStartTime(entry.startTime);
    setEndTime(entry.endTime);
    setType(entry.type);
    setTiredness(entry.tiredness);
    setNotes(entry.notes);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteEntry(entryId: string) {
    await deleteDoc(doc(db, "moeEntries", entryId));
    setEntries((current) => current.filter((entry) => entry.id !== entryId));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    const entryData = {
      userId: user.uid,
      date,
      startTime,
      endTime,
      type,
      tiredness,
      notes,
      createdAt: new Date().toISOString(),
    };

    if (editingId) {
      await updateDoc(doc(db, "moeEntries", editingId), entryData);

      setEntries((current) =>
        sortByStartTime(
          current.map((entry) =>
            entry.id === editingId ? { ...entryData, id: editingId } : entry
          )
        )
      );
    } else {
      const docRef = await addDoc(collection(db, "moeEntries"), entryData);

      setEntries((current) =>
        sortByStartTime([...current, { ...entryData, id: docRef.id }])
      );
    }

    resetForm();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const filteredEntries =
    filter === "all" ? entries : entries.filter((entry) => entry.type === filter);

  const stats = useMemo(() => {
    const averageTiredness =
      entries.length === 0
        ? 0
        : entries.reduce((sum, entry) => sum + entry.tiredness, 0) /
          entries.length;

    const hoursByType = { physical: 0, mental: 0, rest: 0 };

    for (const entry of entries) {
      hoursByType[entry.type] += durationHours(entry);
    }

    return { averageTiredness, hoursByType };
  }, [entries]);

  const chartData = entries.map((entry) => ({
    time: entry.startTime,
    tiredness: entry.tiredness,
  }));

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
      <header className="topbar">
        <div>
          <h1>Moemeter</h1>
          <p className="subtitle">{user.displayName}</p>
        </div>
        <button className="small-button" onClick={logout}>Logout</button>
      </header>

      <form onSubmit={handleSubmit} className="card">
        <label>
          Date
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>

        <div className="time-row">
          <label>
            From
            <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
          </label>

          <label>
            To
            <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
          </label>
        </div>

        <label>
          Type
          <select value={type} onChange={(e) => setType(e.target.value as ActivityType)}>
            <option value="physical">🚶 Physical</option>
            <option value="mental">🧠 Mental</option>
            <option value="rest">😌 Rest</option>
          </select>
        </label>

        <label>
          Tiredness afterwards: {tiredness}/10
          <input
            type="range"
            min="1"
            max="10"
            value={tiredness}
            onChange={(e) => setTiredness(Number(e.target.value))}
          />
        </label>

        <label>
          Notes
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} required />
        </label>

        <button type="submit">{editingId ? "Update moe" : "Save my moe"}</button>

        {editingId && (
          <button type="button" className="secondary-button" onClick={resetForm}>
            Cancel edit
          </button>
        )}

        {saved && <p className="success">Moe saved!</p>}
      </form>

      <section className="card">
        <h2>{displayDate(date)}</h2>

        <div className="filters">
          <button onClick={() => setFilter("all")}>All</button>
          <button onClick={() => setFilter("physical")}>🚶 Physical</button>
          <button onClick={() => setFilter("mental")}>🧠 Mental</button>
          <button onClick={() => setFilter("rest")}>😌 Rest</button>
        </div>

        {filteredEntries.length === 0 ? (
          <p className="empty">No moe logged yet.</p>
        ) : (
          <div className="timeline">
            {filteredEntries.map((entry) => (
              <article key={entry.id} className={`entry ${entry.type}`}>
                <div className="entry-time">
                  {entry.startTime}–{entry.endTime}
                </div>

                <div className="entry-body">
                  <strong>{icons[entry.type]} {entry.type}</strong>
                  <span>{entry.tiredness}/10 tired</span>
                  <p>{entry.notes}</p>

                  <div className="entry-actions">
                    <button type="button" onClick={() => startEdit(entry)}>Edit</button>
                    <button
                      type="button"
                      className="danger-button"
                      onClick={() => entry.id && deleteEntry(entry.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="stats">
        <div>
          <strong>{stats.averageTiredness.toFixed(1)}</strong>
          <span>avg tiredness</span>
        </div>
        <div>
          <strong>{stats.hoursByType.physical.toFixed(1)}h</strong>
          <span>🚶 physical</span>
        </div>
        <div>
          <strong>{stats.hoursByType.mental.toFixed(1)}h</strong>
          <span>🧠 mental</span>
        </div>
        <div>
          <strong>{stats.hoursByType.rest.toFixed(1)}h</strong>
          <span>😌 rest</span>
        </div>
      </section>

      <section className="card chart-card">
        <h2>Tiredness today</h2>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={chartData}>
            <XAxis dataKey="time" />
            <YAxis domain={[1, 10]} />
            <Tooltip />
            <Line type="monotone" dataKey="tiredness" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </section>
    </main>
  );
}