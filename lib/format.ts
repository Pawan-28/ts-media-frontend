export function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Same as formatDate but with a time-of-day - used for the Review History timeline, where the order of same-day events matters. */
export function formatDateTime(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/** Article byline timestamp, e.g. "October 2, 2026, 4:10 PM IST". Pinned to IST so server and viewer always agree. */
export function formatDateTimeIST(iso: string | null): string {
  if (!iso) return "";
  const text = new Date(iso).toLocaleString("en-US", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
  return `${text} IST`;
}
