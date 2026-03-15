// components/home/SeasonCalendar.tsx
import { getCalendar, getTrack } from '@/lib/data';

interface SeasonCalendarProps {
  year?: number;
}

export function SeasonCalendar({ year = new Date().getFullYear() }: SeasonCalendarProps) {
  const races = getCalendar(year);
  const completed = races.filter(r => new Date(r.date) < new Date()).length;

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-text-primary mb-2">{year} 赛季日历</h2>
        <p className="text-text-secondary mb-6">已完成 {completed}/{races.length} 站</p>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {races.map(race => {
            const isPast = new Date(race.date) < new Date();
            const track = getTrack(race.track);
            return (
              <div key={race.round}
                className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-xs font-medium border-2 transition-colors ${
                  isPast
                    ? 'bg-primary border-primary text-white'
                    : 'border-text-muted/30 text-text-muted hover:border-secondary hover:text-secondary cursor-pointer'
                }`}
                title={`${race.name} · ${track?.location}`}>
                {race.round}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
