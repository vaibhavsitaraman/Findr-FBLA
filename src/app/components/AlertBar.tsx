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
        backgroundColor: "#FF8A4B",
        position: "relative",
        zIndex: 30,
        marginTop: "64px", // Height of navbar to position it below
      }}
    >
      <div className="container mx-auto max-w-7xl flex items-center justify-center gap-3 text-white">
        <AlertCircle className="size-5 flex-shrink-0" />
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <Clock className="size-4" />
          <span className="font-semibold">
            Unclaimed items will be donated in:
          </span>
          <div className="flex items-center gap-2 font-bold">
            <span className="bg-white/20 px-2 py-1 rounded backdrop-blur-sm">
              {timeLeft.days}d
            </span>
            <span className="bg-white/20 px-2 py-1 rounded backdrop-blur-sm">
              {timeLeft.hours}h
            </span>
            <span className="bg-white/20 px-2 py-1 rounded backdrop-blur-sm">
              {timeLeft.minutes}m
            </span>
            <span className="bg-white/20 px-2 py-1 rounded backdrop-blur-sm">
              {timeLeft.seconds}s
            </span>
          </div>
          <span className="font-medium">— Claim your items now!</span>
        </div>
      </div>
    </div>
  );
}
