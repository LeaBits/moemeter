import { useMemo, useState } from "react";
import type { User } from "firebase/auth";
import logo from "../assets/logo.png";
import { EntryForm } from "../components/EntryForm";
import { Hero } from "../components/Hero";
import { StatsCards } from "../components/StatsCards";
import { Timeline } from "../components/Timeline";
import { useEntries } from "../hooks/useEntries";
import { useFactors } from "../hooks/useFactors";
import type { ActivityType, MoeEntry } from "../types";
import { displayDate, shiftDate, today } from "../utils/dates";
import { durationHours } from "../utils/time";

type TodayPageProps = {
  user: User;
  onManageFactors: () => void;
};

function tirednessLabel(value: number) {
  if (value === 0) return "No data yet";
  if (value <= 3) return "😊 Feeling good";
  if (value <= 5) return "🙂 Doing okay";
  if (value <= 7) return "😐 Getting tired";
  if (value <= 9) return "🥱 Very tired";
  return "😴 Exhausted";
}

export function TodayPage({ user, onManageFactors }: TodayPageProps) {
  const [date, setDate] = useState(today());
  const [showForm, setShowForm] = useState(false);

  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("11:00");
  const [type, setType] = useState<ActivityType>("physical");
  const [filter, setFilter] = useState<ActivityType | "all">("all");
  const [tiredness, setTiredness] = useState(5);
  const [notes, setNotes] = useState("");
  const [factorIds, setFactorIds] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const { entries, addEntry, updateEntry, deleteEntry } = useEntries(user, date);
  const { factors, addFactor } = useFactors(user);

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

  const filteredEntries =
    filter === "all" ? entries : entries.filter((entry) => entry.type === filter);

  function resetForm() {
    setStartTime("10:00");
    setEndTime("11:00");
    setType("physical");
    setTiredness(5);
    setNotes("");
    setFactorIds([]);
    setEditingId(null);
  }

  function openNewForm() {
    resetForm();
    setShowForm(true);
  }

  function closeForm() {
    resetForm();
    setShowForm(false);
  }

  function startEdit(entry: MoeEntry) {
    setEditingId(entry.id ?? null);
    setDate(entry.date);
    setStartTime(entry.startTime);
    setEndTime(entry.endTime);
    setType(entry.type);
    setTiredness(entry.tiredness);
    setNotes(entry.notes);
    setFactorIds(entry.factorIds ?? []);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const entryData = {
      date,
      startTime,
      endTime,
      type,
      tiredness,
      notes,
      factorIds,
    };

    if (editingId) await updateEntry(editingId, entryData);
    else await addEntry(entryData);

    closeForm();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <section className="page">
      <Hero
        user={user}
        logo={logo}
        average={stats.averageTiredness}
        tirednessLabel={tirednessLabel(stats.averageTiredness)}
        onManageFactors={onManageFactors}
        />

      {saved && <p className="success">Moe saved!</p>}

      {showForm && (
        <EntryForm
          editingId={editingId}
          startTime={startTime}
          endTime={endTime}
          type={type}
          tiredness={tiredness}
          notes={notes}
          factorIds={factorIds}
          factors={factors}
          setStartTime={setStartTime}
          setEndTime={setEndTime}
          setType={setType}
          setTiredness={setTiredness}
          setNotes={setNotes}
          setFactorIds={setFactorIds}
          addFactor={addFactor}
          onSubmit={handleSubmit}
          onCancel={closeForm}
        />
      )}

      <section className="card">
        <div className="section-header">
          <div>
            <h2>Timeline</h2>
            <p className="section-date">{displayDate(date)}</p>
            </div>
          <button type="button" className="small-button" onClick={openNewForm}>
            + Add
          </button>
        </div>

        <div className="date-nav">
          <button type="button" onClick={() => setDate(shiftDate(date, -1))}>
            ←
          </button>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <button type="button" onClick={() => setDate(shiftDate(date, 1))}>
            →
          </button>
        </div>

        <div className="filters">
          <button type="button" onClick={() => setFilter("all")}>
            All
          </button>
          <button type="button" onClick={() => setFilter("physical")}>
            🚶 Physical
          </button>
          <button type="button" onClick={() => setFilter("mental")}>
            🧠 Mental
          </button>
          <button type="button" onClick={() => setFilter("rest")}>
            😌 Rest
          </button>
        </div>

        <Timeline
          entries={filteredEntries}
          factors={factors}
          onEdit={startEdit}
          onDelete={deleteEntry}
        />
      </section>

      <StatsCards
        physical={stats.hoursByType.physical}
        mental={stats.hoursByType.mental}
        rest={stats.hoursByType.rest}
        average={stats.averageTiredness}
      />
    </section>
  );
}