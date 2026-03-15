// components/home/HeroSection.tsx
import { Button } from '@/components/ui/Button';
import { getTrack } from '@/lib/data';
import type { RaceEvent } from '@/types/content';

interface HeroSectionProps {
  race: RaceEvent;
}

export function HeroSection({ race }: HeroSectionProps) {
  const track = getTrack(race.track);

  return (
    <section className="relative py-12 md:py-20 striped-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-secondary text-sm font-medium mb-2">本周赛事 · 第 {race.round} 站</p>
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">{race.name}</h1>
            <p className="text-text-secondary mb-2">{track?.location}, {track?.country}</p>
            <p className="text-text-muted mb-6">
              {new Date(race.date).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <div className="flex gap-3">
              <Button href={`/guides?track=${race.track}`}>观赛攻略</Button>
              <Button href={`/library/tracks/${race.track}`} variant="ghost">赛道百科</Button>
            </div>
          </div>
          <div className="relative aspect-video bg-bg-elevated rounded-lg flex items-center justify-center">
            <span className="text-text-muted">赛道示意图</span>
          </div>
        </div>
      </div>
    </section>
  );
}
