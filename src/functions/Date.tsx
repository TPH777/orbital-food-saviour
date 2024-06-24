export function toLocalTime(date: Date) {
  date.setHours(date.getHours() + 8);
  return date.toISOString().slice(0, -8);
}

export function timestampToDate(timestamp: any) {
  return new Date(timestamp.toDate());
}
