import { AlertCircle, Clock } from "lucide-react";
import { useEffect, useState } from "react";

function getNextDonationEvent(now: Date) {
  // Quarterly events: March, June, September, December
  // Uses the 15th at 12:00 local time as a deterministic “event time”.
  const months = [2, 5, 8, 11];
  for (const month of months) {
    const candidate = new Date(now.getFullYear(), month, 15, 12, 0, 0, 0);
    if (candidate.getTime() > now.getTime()) return candidate;
  }
  return new Date(now.getFullYear() + 1, 2, 15, 12, 0, 0, 0);
}

function getTimeLeft(target: Date, now: Date) {
  const ms = Math.max(0, target.getTime() - now.getTime());
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / (60 * 60 * 24));
  const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds };
}

export function AlertBar() {
  const [timeLeft, setTimeLeft] = useState(() => {
    const now = new Date();
    return getTimeLeft(getNextDonationEvent(now), now);
  });

  useEffect(() => {
    const eventDate = getNextDonationEvent(new Date());
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(eventDate, new Date()));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="w-full py-3 px-4"
      style={{
        background:
          "linear-gradient(135deg, rgba(37,99,235,0.9) 0%, rgba(29,78,216,0.95) 100%)",
        position: "relative",
        zIndex: 30,
        marginTop: "64px", // Height of navbar to position it below
        boxShadow:
          "0 2px 12px rgba(37,99,235,0.3), inset 0 1px 0 rgba(255,255,255,0.15)",
        border: "1px solid rgba(59,130,246,0.3)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div className="container mx-auto max-w-7xl flex items-center justify-center gap-3 text-white">
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <Clock className="size-4 text-blue-100" />
          <span className="font-semibold text-blue-50">
            Unclaimed items will be donated in:
          </span>
          <div className="flex items-center gap-2 font-bold">
            <span className="bg-white/10 px-2 py-1 rounded backdrop-blur-sm border border-white/10">
              {timeLeft.days}d
            </span>
            <span className="bg-white/10 px-2 py-1 rounded backdrop-blur-sm border border-white/10">
              {timeLeft.hours}h
            </span>
            <span className="bg-white/10 px-2 py-1 rounded backdrop-blur-sm border border-white/10">
              {timeLeft.minutes}m
            </span>
            <span className="bg-white/10 px-2 py-1 rounded backdrop-blur-sm border border-white/10">
              {timeLeft.seconds}s
            </span>
          </div>
          <span className="font-medium text-blue-50">
            — Claim your items now!
          </span>
        </div>
      </div>
    </div>
  );
}
