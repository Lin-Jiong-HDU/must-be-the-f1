import { getNextRace } from '@/lib/data';
import { getAllContent } from '@/lib/content';
import { HeroSection } from '@/components/home/HeroSection';
import { LatestNews } from '@/components/home/LatestNews';
import { SeasonCalendar } from '@/components/home/SeasonCalendar';

export default function Home() {
  const nextRace = getNextRace();
  const news = getAllContent('news');

  return (
    <div>
      {nextRace && <HeroSection race={nextRace} />}
      <LatestNews articles={news} />
      <SeasonCalendar />
    </div>
  );
}
