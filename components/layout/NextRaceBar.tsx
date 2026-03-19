'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getNextRace } from '@/lib/data';

export function NextRaceBar() {
  const [countdown, setCountdown] = useState<string>('');
  const [race, setRace] = useState<ReturnType<typeof getNextRace>>(undefined);

  useEffect(() => {
    const nextRace = getNextRace();
    setRace(nextRace);

    if (!nextRace) return;

    const updateCountdown = () => {
      const now = new Date();
      const raceDate = new Date(nextRace.date);
      const diff = raceDate.getTime() - now.getTime();

      if (diff <= 0) {
        setCountdown('即将开始');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

      if (days >= 7) {
        setCountdown(`${days}天`);
      } else if (days > 0) {
        setCountdown(`${days}天${hours}小时`);
      } else {
        setCountdown(`${hours}小时`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);

    return () => clearInterval(interval);
  }, []);

  if (!race) return null;

  return (
    <div className="bg-bg-card/50 border-b border-border-subtle">
      <Link
        href={`/races/${race.track}`}
        className="flex items-center justify-center gap-2 py-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
      >
        <span>🏁</span>
        <span>下一站：{race.name}</span>
        <span className="text-text-muted">·</span>
        <span className="text-primary font-medium">{countdown}</span>
      </Link>
    </div>
  );
}
