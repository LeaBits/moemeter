export function today() {
  return new Date().toISOString().slice(0, 10);
}

export function displayDate(date: string) {
  return new Date(date).toLocaleDateString("nl-NL");
}

export function shiftDate(date: string, days: number) {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate.toISOString().slice(0, 10);
}