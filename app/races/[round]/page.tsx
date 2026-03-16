// app/races/[round]/page.tsx
import { notFound } from 'next/navigation';
import { getContentByRound, getAllRounds } from '@/lib/content';
import { RaceDetail } from '@/components/races/RaceDetail';

export async function generateStaticParams() {
  const rounds = getAllRounds('race');
  return rounds.map((round) => ({
    round: round.toString(),
  }));
}

export default async function RacePage({ params }: { params: Promise<{ round: string }> }) {
  const { round } = await params;
  const article = getContentByRound('race', parseInt(round));

  if (!article) {
    notFound();
  }

  return (
    <div className="py-12">
      <RaceDetail article={article} />
    </div>
  );
}
