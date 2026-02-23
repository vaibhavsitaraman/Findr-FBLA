import { AlertCircle, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

export function AlertBar() {
  const [timeLeft, setTimeLeft] = useState({
    days: 12,
    hours: 5,
    minutes: 43,
    seconds: 22,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div 
      className="w-full py-3 px-4"
      style={{ backgroundColor: '#FF8A4B' }}
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
          <span className="font-medium">
            — Claim your items now!
          </span>
        </div>
      </div>
    </div>
  );
}
