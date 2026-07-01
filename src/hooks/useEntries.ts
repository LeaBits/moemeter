import { useEffect, useState } from "react";
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
import type { User } from "firebase/auth";
import { db } from "../firebase";
import type { MoeEntry } from "../types";
import { sortByStartTime } from "../utils/time";

type MoeEntryInput = Omit<MoeEntry, "id" | "userId" | "createdAt">;

export function useEntries(user: User | null, date: string) {
  const [entries, setEntries] = useState<MoeEntry[]>([]);

  async function loadEntries() {
    if (!user) return;

    const q = query(
      collection(db, "moeEntries"),
      where("userId", "==", user.uid),
      where("date", "==", date)
    );

    const snapshot = await getDocs(q);

    const loadedEntries = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<MoeEntry, "id">),
    }));

    setEntries(sortByStartTime(loadedEntries));
  }

  useEffect(() => {
    if (user) {
      loadEntries();
    } else {
      setEntries([]);
    }
  }, [user, date]);

  async function addEntry(input: MoeEntryInput) {
    if (!user) return;

    const entry: Omit<MoeEntry, "id"> = {
      ...input,
      userId: user.uid,
      createdAt: new Date().toISOString(),
    };

    const docRef = await addDoc(collection(db, "moeEntries"), entry);

    setEntries((current) =>
      sortByStartTime([...current, { ...entry, id: docRef.id }])
    );
  }

  async function updateEntry(entryId: string, input: MoeEntryInput) {
    if (!user) return;

    const updatedEntry: Omit<MoeEntry, "id"> = {
      ...input,
      userId: user.uid,
      createdAt: new Date().toISOString(),
    };

    await updateDoc(doc(db, "moeEntries", entryId), updatedEntry);

    setEntries((current) =>
      sortByStartTime(
        current.map((entry) =>
          entry.id === entryId ? { ...updatedEntry, id: entryId } : entry
        )
      )
    );
  }

  async function deleteEntry(entryId: string) {
    await deleteDoc(doc(db, "moeEntries", entryId));
    setEntries((current) => current.filter((entry) => entry.id !== entryId));
  }

  return {
    entries,
    addEntry,
    updateEntry,
    deleteEntry,
  };
}