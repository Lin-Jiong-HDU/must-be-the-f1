// components/races/RaceList.tsx
import { getTrack } from '@/lib/data';
import type { RaceEvent } from '@/types/content';

interface RaceListProps {
  races: RaceEvent[];
}

export function RaceList({ races }: RaceListProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {races.map((race) => {
        const track = getTrack(race.track);
        return (
          <a
            key={race.round}
            href={`/races/${race.round}`}
            className="group block p-6 bg-bg-card rounded-lg border border-border-subtle hover:border-primary/30 transition-all duration-200 hover:-translate-y-1"
          >
            <p className="text-sm text-primary mb-2">第 {race.round} 站</p>
            <h3 className="text-xl font-semibold text-text-primary mb-2 group-hover:text-primary transition-colors">
              {race.name}
            </h3>
            <p className="text-text-secondary text-sm mb-4">
              {track?.location}, {track?.country}
            </p>
            <p className="text-text-muted text-sm">
              {new Date(race.date).toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </a>
        );
      })}
    </div>
  );
}
