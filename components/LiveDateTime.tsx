"use client";

import { useEffect, useState } from "react";

/** "Sat, Oct 3, 2026 | 4:10 PM" in IST, ticking every 30s. Renders empty until mounted to avoid a hydration mismatch. */
export default function LiveDateTime() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  if (!now) return <span className="invisible">Sat, Oct 3, 2026 | 12:00 PM</span>;

  const date = now.toLocaleDateString("en-US", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const time = now.toLocaleTimeString("en-US", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <span suppressHydrationWarning>
      {date}
      <span className="mx-2 text-border-200">|</span>
      {time}
    </span>
  );
}
