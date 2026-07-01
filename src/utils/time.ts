import type { MoeEntry } from "../types";

export function timeToMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function durationHours(entry: MoeEntry) {
  return Math.max(
    (timeToMinutes(entry.endTime) - timeToMinutes(entry.startTime)) / 60,
    0
  );
}

export function sortByStartTime(entries: MoeEntry[]) {
  return [...entries].sort((a, b) => a.startTime.localeCompare(b.startTime));
}