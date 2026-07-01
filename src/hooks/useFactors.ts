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
import type { Factor } from "../types";

export function useFactors(user: User | null) {
  const [factors, setFactors] = useState<Factor[]>([]);

  async function loadFactors() {
    if (!user) return;

    const q = query(collection(db, "factors"), where("userId", "==", user.uid));
    const snapshot = await getDocs(q);

    setFactors(
      snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Factor, "id">),
      }))
    );
  }

  useEffect(() => {
    if (user) loadFactors();
    else setFactors([]);
  }, [user]);

  async function addFactor(name: string, emoji: string) {
    if (!user) return null;

    const factor: Omit<Factor, "id"> = {
      userId: user.uid,
      name,
      emoji,
      createdAt: new Date().toISOString(),
    };

    const docRef = await addDoc(collection(db, "factors"), factor);
    const newFactor = { ...factor, id: docRef.id };

    setFactors((current) => [...current, newFactor]);

    return docRef.id;
  }

  async function updateFactor(factorId: string, data: Pick<Factor, "name" | "emoji">) {
    await updateDoc(doc(db, "factors", factorId), data);

    setFactors((current) =>
      current.map((factor) => (factor.id === factorId ? { ...factor, ...data } : factor))
    );
  }

  async function deleteFactor(factorId: string) {
    await deleteDoc(doc(db, "factors", factorId));
    setFactors((current) => current.filter((factor) => factor.id !== factorId));
  }

  return { factors, addFactor, updateFactor, deleteFactor };
}
