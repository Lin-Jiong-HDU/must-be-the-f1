// app/library/tracks/[trackId]/page.tsx
import { notFound } from 'next/navigation';
import { getTrack, getCalendar } from '@/lib/data';
import { Track3DDetail } from '@/components/library/Track3DDetail';
import type { Metadata } from 'next';

interface TrackPageProps {
  params: Promise<{ trackId: string }>;
}

export async function generateStaticParams() {
  const tracks = await import('@/content/data/tracks.json');
  return Object.keys(tracks.default || tracks).map((trackId) => ({
    trackId,
  }));
}

export async function generateMetadata({ params }: TrackPageProps): Promise<Metadata> {
  const { trackId } = await params;
  const track = getTrack(trackId);

  if (!track) {
    return { title: '赛道未找到' };
  }

  return {
    title: `${track.name} - F1 赛道百科`,
    description: `${track.name}赛道技术资料：全长${track.length}公里，共${track.laps}圈，${track.turns}个弯道。位于${track.location}，${track.country}。`,
  };
}

export default async function TrackPage({ params }: TrackPageProps) {
  const { trackId } = await params;
  const track = getTrack(trackId);

  if (!track) {
    notFound();
  }

  // 查找该赛道的比赛信息
  const currentYear = new Date().getFullYear();
  const races = getCalendar(currentYear) || [];
  const race = races.find(r => r.track === trackId);

  return (
    <Track3DDetail track={track} race={race} currentYear={currentYear} />
  );
}
