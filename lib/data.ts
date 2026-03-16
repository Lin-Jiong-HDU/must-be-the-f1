// lib/data.ts
import type { Track, RaceEvent, Calendar } from '@/types/content';
import tracks from '@/content/data/tracks.json';
import calendar from '@/content/data/calendar.json';

export function getTrack(id: string): Track | undefined {
  return (tracks as unknown as Record<string, Track>)[id];
}

export function getCalendar(year: number): RaceEvent[] {
  return (calendar as Calendar)[year.toString()] || [];
}

export function getNextRace(): RaceEvent | undefined {
  const races = getCalendar(new Date().getFullYear());
  const today = new Date();
  return races.find(race => new Date(race.date) > today);
}

export function getGuidesByTrack<T extends { track?: string }>(guides: T[]): Map<string, T[]> {
  const map = new Map<string, T[]>();
  for (const guide of guides) {
    const trackId = guide.track || 'other';
    if (!map.has(trackId)) {
      map.set(trackId, []);
    }
    map.get(trackId)!.push(guide);
  }
  return map;
}
