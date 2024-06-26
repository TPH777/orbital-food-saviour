export function toLocalTime(date: Date) {
  date.setHours(date.getHours() + 8);
  return date.toISOString().slice(0, -8);
}

export function timestampToDate(timestamp: any) {
  return new Date(timestamp.toDate());
}

export function timestampToString(timestamp: any) {
  const dateString = timestampToDate(timestamp).toString();
  const month = dateString.slice(4, 7);
  const day = dateString.slice(8, 10);
  const time = dateString.slice(16, 21);
  return `${day} ${month} - ${time}`;
}
