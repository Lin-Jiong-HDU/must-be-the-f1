// components/guides/GuideList.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getTrack, getNextRace, getGuidesByTrack } from '@/lib/data';
import type { Frontmatter } from '@/types/content';

type ViewMode = 'magazine' | 'track';

interface GuideListProps {
  guides: Frontmatter[];
}

export function GuideList({ guides }: GuideListProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('magazine');
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);

  useEffect(() => {
    const nextRace = getNextRace();
    if (nextRace) {
      setCurrentTrack(nextRace.track);
    }
  }, []);

  const guidesByTrack = getGuidesByTrack(guides);
  const allTracks = Array.from(guidesByTrack.keys());

  // 排序：当前赛道置顶
  const sortedGuides = [...guides].sort((a, b) => {
    if (a.track === currentTrack && b.track !== currentTrack) return -1;
    if (b.track === currentTrack && a.track !== currentTrack) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div>
      {/* 视图切换 */}
      <div className="flex items-center justify-center gap-4 mb-12">
        <button
          onClick={() => setViewMode('magazine')}
          className={`capsule-btn ${viewMode === 'magazine' ? 'active' : 'inactive'}`}
        >
          杂志视图
        </button>
        <button
          onClick={() => setViewMode('track')}
          className={`capsule-btn ${viewMode === 'track' ? 'active' : 'inactive'}`}
        >
          赛道视图
        </button>
      </div>

      {viewMode === 'magazine' ? (
        <MagazineView guides={sortedGuides} currentTrack={currentTrack} />
      ) : (
        <TrackView
          guidesByTrack={guidesByTrack}
          allTracks={allTracks}
          currentTrack={currentTrack}
        />
      )}
    </div>
  );
}

// 杂志视图 - 不对称网格
function MagazineView({
  guides,
  currentTrack,
}: {
  guides: Frontmatter[];
  currentTrack: string | null;
}) {
  if (guides.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-text-muted text-lg">暂无攻略内容</p>
      </div>
    );
  }

  const [featured, second, ...rest] = guides;
  const isFeaturedCurrent = featured.track === currentTrack;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[200px]">
      {/* 置顶大卡片 - 跨2行 */}
      <Link
        href={`/guides/${featured.slug}`}
        className="guide-card corner-stripe row-span-2 group"
      >
        {/* 赛道轮廓背景 */}
        <TrackOutlineBg trackId={featured.track} />

        {/* 图片 */}
        {featured.cover && (
          <div className="absolute inset-0">
            <img
              src={featured.cover}
              alt={featured.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-bg-dark/60 to-transparent" />
          </div>
        )}

        {/* 内容 */}
        <div className="absolute inset-0 p-8 flex flex-col justify-end z-10">
          <div className="flex items-center gap-3 mb-4">
            {isFeaturedCurrent && (
              <span className="px-3 py-1 bg-accent-gold text-bg-dark text-xs font-bold rounded-full">
                本周赛事
              </span>
            )}
            <span className="px-3 py-1 bg-white/10 backdrop-blur-sm text-text-primary text-xs font-medium rounded-full">
              攻略
            </span>
          </div>
          <h2
            className="text-2xl md:text-3xl font-bold text-text-primary mb-3 group-hover:text-accent-gold transition-colors"
            style={{ fontFamily: 'var(--font-serif), var(--font-serif-cn), Georgia, serif' }}
          >
            {featured.title}
          </h2>
          {featured.excerpt && (
            <p className="text-text-secondary text-sm md:text-base line-clamp-2">
              {featured.excerpt}
            </p>
          )}
          <div className="mt-4 text-text-muted text-sm">
            {new Date(featured.date).toLocaleDateString('zh-CN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </div>
      </Link>

      {/* 第二张卡片 */}
      {second && (
        <Link
          href={`/guides/${second.slug}`}
          className="guide-card corner-stripe group"
        >
          <TrackOutlineBg trackId={second.track} />
          <GuideCardContent guide={second} />
        </Link>
      )}

      {/* 第三张（如果有） */}
      {guides.length > 2 && rest.slice(0, 1).map((guide) => (
        <Link
          key={guide.slug}
          href={`/guides/${guide.slug}`}
          className="guide-card corner-stripe group"
        >
          <TrackOutlineBg trackId={guide.track} />
          <GuideCardContent guide={guide} />
        </Link>
      ))}

      {/* 其余卡片 - 让某些跨行增加变化 */}
      {rest.slice(1).map((guide, index) => {
        const shouldSpan = index % 4 === 0 && index < rest.length - 1;
        return (
          <Link
            key={guide.slug}
            href={`/guides/${guide.slug}`}
            className={`guide-card corner-stripe group ${shouldSpan ? 'row-span-2' : ''}`}
          >
            <TrackOutlineBg trackId={guide.track} />
            {shouldSpan && guide.cover ? (
              <>
                <div className="absolute inset-0">
                  <img
                    src={guide.cover}
                    alt={guide.title}
                    className="w-full h-full object-cover opacity-40"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-bg-dark/80 to-transparent" />
                </div>
              </>
            ) : null}
            <GuideCardContent guide={guide} />
          </Link>
        );
      })}
    </div>
  );
}

// 赛道视图
function TrackView({
  guidesByTrack,
  allTracks,
  currentTrack,
}: {
  guidesByTrack: Map<string, Frontmatter[]>;
  allTracks: string[];
  currentTrack: string | null;
}) {
  const sortedTracks = allTracks.sort((a, b) => {
    if (a === currentTrack && b !== currentTrack) return -1;
    if (b === currentTrack && a !== currentTrack) return 1;
    return a.localeCompare(b);
  });

  if (sortedTracks.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-text-muted text-lg">暂无攻略内容</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {sortedTracks.map((trackId) => {
        const track = getTrack(trackId);
        const trackGuides = guidesByTrack.get(trackId) || [];
        const isCurrent = trackId === currentTrack;

        return (
          <div
            key={trackId}
            className={`relative p-8 bg-bg-card rounded-xl border overflow-hidden ${
              isCurrent ? 'border-accent-gold/50 neon-glow' : 'border-border-subtle'
            }`}
          >
            {/* 赛道轮廓背景 */}
            <div className="absolute inset-0 opacity-5">
              <TrackOutlineBg trackId={trackId} />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                {isCurrent && (
                  <span className="text-2xl animate-pulse">🔥</span>
                )}
                <h3
                  className="text-xl font-bold text-text-primary"
                  style={{ fontFamily: 'var(--font-serif), var(--font-serif-cn), Georgia, serif' }}
                >
                  {track?.name || trackId}
                </h3>
                {isCurrent && (
                  <span className="px-2 py-1 bg-accent-gold/20 text-accent-gold text-xs font-medium rounded">
                    当前赛事
                  </span>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {trackGuides.map((guide) => (
                  <Link
                    key={guide.slug}
                    href={`/guides/${guide.slug}`}
                    className="group p-4 bg-bg-elevated/50 rounded-lg hover:bg-bg-elevated transition-colors"
                  >
                    <h4 className="text-text-primary font-medium group-hover:text-accent-gold transition-colors">
                      {guide.title}
                    </h4>
                    {guide.excerpt && (
                      <p className="text-sm text-text-muted mt-2 line-clamp-1">
                        {guide.excerpt}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// 卡片内容组件
function GuideCardContent({ guide }: { guide: Frontmatter }) {
  return (
    <div className="absolute inset-0 p-6 flex flex-col justify-end z-10">
      <div className="flex items-center gap-2 mb-2">
        <span className="px-2 py-0.5 bg-white/10 backdrop-blur-sm text-text-primary text-xs font-medium rounded-full">
          攻略
        </span>
      </div>
      <h3
        className="text-lg font-bold text-text-primary group-hover:text-accent-gold transition-colors line-clamp-2"
        style={{ fontFamily: 'var(--font-serif), var(--font-serif-cn), Georgia, serif' }}
      >
        {guide.title}
      </h3>
      {guide.excerpt && (
        <p className="text-sm text-text-secondary mt-2 line-clamp-2">
          {guide.excerpt}
        </p>
      )}
    </div>
  );
}

// 赛道轮廓背景组件
function TrackOutlineBg({ trackId }: { trackId?: string }) {
  const track = getTrack(trackId || '');

  if (!track?.trackImage) return null;

  return (
    <div
      className="track-outline-bg"
      style={{
        backgroundImage: `url(${track.trackImage})`,
      }}
    />
  );
}
