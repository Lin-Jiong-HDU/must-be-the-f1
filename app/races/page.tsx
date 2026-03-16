// app/races/page.tsx
import { getCalendar } from '@/lib/data';
import { RaceList } from '@/components/races/RaceList';

export default function RacesPage() {
  const currentYear = new Date().getFullYear();
  const races = getCalendar(currentYear) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-12 text-center">
        <h1
          className="text-4xl md:text-5xl font-semibold text-text-primary mb-4"
          style={{ fontFamily: 'var(--font-serif), var(--font-serif-cn), Georgia, serif' }}
        >
          赛事深度
        </h1>
        <p className="text-text-secondary max-w-2xl mx-auto">
          {currentYear} 赛季 · 共 {races.length} 站比赛
        </p>
      </header>

      <RaceList races={races} />
    </div>
  );
}
