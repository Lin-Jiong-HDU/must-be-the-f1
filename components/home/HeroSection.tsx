// components/home/HeroSection.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { getTrack } from '@/lib/data';
import { Track3D } from '@/components/3d/Track3D';
import { TrackDetailModal } from '@/components/3d/TrackDetailModal';
import type { RaceEvent } from '@/types/content';

interface HeroSectionProps {
  race: RaceEvent;
}

export function HeroSection({ race }: HeroSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const track = getTrack(race.track);

  return (
    <>
      <section className="relative overflow-hidden">
        {/* 柔和的渐变背景 */}
        <div className="absolute inset-0 bg-gradient-to-b from-bg-dark via-bg-dark/95 to-bg-card/50" />

        {/* 温暖的光晕 - 更柔和 */}
        <div className="absolute top-20 right-20 w-[500px] h-[500px] bg-amber-500/[0.03] rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-10 w-[300px] h-[300px] bg-rose-500/[0.02] rounded-full blur-[120px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 lg:py-36">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-center">
            {/* 左侧内容 - 占3列 */}
            <div className="lg:col-span-3 space-y-8">
              {/* 赛事标签 - 更优雅 */}
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                  <span className="text-sm font-medium text-text-secondary">
                    {race.round}
                  </span>
                </div>
                <div className="h-px flex-1 max-w-[60px] bg-gradient-to-r from-white/10 to-transparent" />
                <span className="text-sm text-text-muted tracking-wide">
                  本周赛事
                </span>
              </div>

              {/* 赛事名称 - 更轻盈 */}
              <div className="space-y-5">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-text-primary tracking-tight leading-[1.15]">
                  {race.name}
                </h1>
                <p className="text-lg sm:text-xl text-text-secondary font-light leading-relaxed max-w-lg">
                  {track?.location}
                  <span className="text-text-muted/60 mx-2">·</span>
                  <span className="text-text-muted">{track?.country}</span>
                </p>
              </div>

              {/* 日期信息 - 更精致 */}
              <div className="flex items-center gap-4 py-4 px-5 rounded-2xl bg-white/[0.02] border border-white/[0.04] w-fit">
                <div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-white/[0.03]">
                  <span className="text-xs text-text-muted uppercase">
                    {new Date(race.date).toLocaleDateString('en-US', { month: 'short' })}
                  </span>
                  <span className="text-xl font-medium text-text-primary -mt-0.5">
                    {new Date(race.date).getDate()}
                  </span>
                </div>
                <div className="h-8 w-px bg-white/[0.06]" />
                <span className="text-text-secondary">
                  {new Date(race.date).toLocaleDateString('zh-CN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>

              {/* 按钮组 */}
              <div className="flex flex-wrap gap-4 pt-2">
                <Button href={`/guides?track=${race.track}`}>
                  观赛攻略
                </Button>
                <Button href={`/library/tracks/${race.track}`} variant="ghost">
                  <svg className="w-4 h-4 mr-2 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  赛道百科
                </Button>
              </div>
            </div>

            {/* 右侧 3D 赛道 - 占2列 */}
            <div className="lg:col-span-2 relative">
              <div className="relative rounded-3xl overflow-hidden bg-white/[0.02] border border-white/[0.05] shadow-xl">
                {/* 顶部装饰 */}
                <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                <Track3D
                  trackId={race.track}
                  className="aspect-square relative"
                  onClick={() => setIsModalOpen(true)}
                />

                {/* 底部提示 */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <span className="text-sm text-text-muted/70">
                    点击探索赛道
                  </span>
                  <div className="flex items-center gap-1.5 text-text-muted/50">
                    <span className="text-xs">3D</span>
                    <div className="w-1 h-1 rounded-full bg-current" />
                  </div>
                </div>
              </div>

              {/* 装饰性光晕 */}
              <div className="absolute -inset-8 bg-gradient-to-br from-amber-500/[0.02] via-transparent to-rose-500/[0.02] rounded-[2rem] blur-2xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      <TrackDetailModal
        trackId={race.track}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
