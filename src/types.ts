export type ActivityType = "physical" | "mental" | "rest";

export interface MoeEntry {
  id?: string;
  userId: string;
  date: string;
  startTime: string;
  endTime: string;
  type: ActivityType;
  tiredness: number;
  notes: string;
  createdAt: string;
}