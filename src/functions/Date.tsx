export function toLocalTime(date: Date) {
  date.setHours(date.getHours() + 8);
  return date.toISOString().slice(0, -8);
}

export function timestampToDate(timestamp: any) {
  // Convert Firebase Timestamp to milliseconds
  const milliseconds =
    timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000;
  // Create a new Date object
  return new Date(milliseconds);
}
