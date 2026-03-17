import { getNextRace } from '@/lib/data';
import { getAllContent } from '@/lib/content';
import { HeroSection } from '@/components/home/HeroSection';
import { LatestNews } from '@/components/home/LatestNews';
import { SeasonCalendar } from '@/components/home/SeasonCalendar';

// 每小时重新验证一次，确保比赛信息自动切换
export const revalidate = 3600;

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
