export type ActivityType = "physical" | "mental" | "rest";

export interface Factor {
  id?: string;
  userId: string;
  name: string;
  emoji: string;
  createdAt: string;
}

export interface MoeEntry {
  id?: string;
  userId: string;
  date: string;
  startTime: string;
  endTime: string;
  type: ActivityType;
  tiredness: number;
  notes: string;
  factorIds: string[];
  createdAt: string;
}