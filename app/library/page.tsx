// app/library/page.tsx
import { getCalendar } from '@/lib/data';
import type { Metadata } from 'next';
import { TrackGrid } from '@/components/library/TrackGrid';
import tracksData from '@/content/data/tracks.json';

export const metadata: Metadata = {
  title: '赛道资料库 - F1 资讯站',
  description: 'F1 所有赛道技术资料，包含赛道长度、圈数、弯道数等详细数据',
};

export default function LibraryPage() {
  const currentYear = new Date().getFullYear();
  const races = getCalendar(currentYear) || [];
  const tracks = Object.values(tracksData) as Array<{
    id: string;
    name: string;
    officialName: string;
    location: string;
    country: string;
    length: number;
    laps: number;
    turns: number;
    coordinates: [number, number];
    firstHeld: number;
    trackImage: string;
  }>;

  // Create a map of track IDs to their race dates
  const raceDates = new Map(races.map(r => [r.track, r.date]));

  return (
    <div className="min-h-screen">
      {/* 装饰性头部 */}
      <header className="relative py-16 md:py-24 overflow-hidden">
        {/* 斜条纹背景 */}
        <div className="absolute inset-0 stripe-decoration opacity-30" />

        {/* 角落装饰 */}
        <div className="absolute top-0 left-0 w-32 h-32">
          <div className="absolute top-4 left-4 w-20 h-0.5 bg-primary/40 rotate-45 origin-left" />
          <div className="absolute top-8 left-0 w-16 h-0.5 bg-primary/30 rotate-45 origin-left" />
        </div>

        <div className="absolute bottom-0 right-0 w-32 h-32">
          <div className="absolute bottom-4 right-4 w-20 h-0.5 bg-primary/40 -rotate-45 origin-right" />
          <div className="absolute bottom-8 right-0 w-16 h-0.5 bg-primary/30 -rotate-45 origin-right" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* 小标签 */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full mb-6">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-primary text-sm font-medium tracking-wider uppercase">
              Track Library
            </span>
          </div>

          {/* 主标题 */}
          <h1
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-text-primary mb-6 tracking-tight"
            style={{ fontFamily: 'var(--font-serif), var(--font-serif-cn), Georgia, serif' }}
          >
            赛道资料库
          </h1>

          {/* 副标题 */}
          <p className="text-xl md:text-2xl text-text-secondary max-w-2xl mx-auto">
            <span className="text-primary">技术规格</span>
            <span className="mx-3 text-text-muted">·</span>
            <span className="text-primary">赛道图解</span>
            <span className="mx-3 text-text-muted">·</span>
            <span className="text-primary">3D 模型</span>
            <span className="mx-3 text-text-muted">·</span>
            <span className="text-primary">历史数据</span>
          </p>

          {/* 统计 */}
          <div className="mt-8 text-text-muted text-sm">
            {currentYear} 赛季 · 共 {tracks.length} 条赛道
          </div>
        </div>

        {/* 底部装饰线 */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </header>

      {/* 内容区域 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        <TrackGrid tracks={tracks} raceDates={raceDates} />
      </div>
    </div>
  );
}
