import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import type { User } from "firebase/auth";
import { db } from "../firebase";
import type { MoeEntry } from "../types";
import { sortByStartTime } from "../utils/time";

export function useAllEntries(user: User | null) {
  const [entries, setEntries] = useState<MoeEntry[]>([]);

  useEffect(() => {
    async function loadEntries() {
      if (!user) {
        setEntries([]);
        return;
      }

      const q = query(collection(db, "moeEntries"), where("userId", "==", user.uid));

      const snapshot = await getDocs(q);

      const loadedEntries = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<MoeEntry, "id">),
      }));

      setEntries(
        sortByStartTime(loadedEntries).sort((a, b) => a.date.localeCompare(b.date))
      );
    }

    loadEntries();
  }, [user]);

  return { entries };
}
