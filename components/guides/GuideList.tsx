// components/guides/GuideList.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getTrack, getNextRace, getGuidesByTrack } from '@/lib/data';
import { Card, CardImage, CardContent } from '@/components/ui/Card';
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

  // 杂志视图：置顶当前赛道
  const sortedGuides = [...guides].sort((a, b) => {
    if (a.track === currentTrack && b.track !== currentTrack) return -1;
    if (b.track === currentTrack && a.track !== currentTrack) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div>
      {/* 视图切换按钮 */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <button
          onClick={() => setViewMode('magazine')}
          className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
            viewMode === 'magazine'
              ? 'bg-accent-gold text-bg-dark'
              : 'bg-bg-card text-text-secondary hover:text-text-primary'
          }`}
        >
          杂志视图
        </button>
        <button
          onClick={() => setViewMode('track')}
          className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
            viewMode === 'track'
              ? 'bg-accent-gold text-bg-dark'
              : 'bg-bg-card text-text-secondary hover:text-text-primary'
          }`}
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

// 杂志视图组件
function MagazineView({
  guides,
  currentTrack,
}: {
  guides: Frontmatter[];
  currentTrack: string | null;
}) {
  if (guides.length === 0) {
    return (
      <div className="text-center py-16 text-text-muted">
        暂无攻略内容
      </div>
    );
  }

  const [featured, ...rest] = guides;
  const isFeaturedCurrent = featured.track === currentTrack;

  return (
    <div>
      {/* 置顶大图 */}
      <Link
        href={`/guides/${featured.slug}`}
        className={`block mb-8 group ${
          isFeaturedCurrent ? 'border-2 border-accent-gold rounded-lg overflow-hidden' : ''
        }`}
      >
        <div className="grid md:grid-cols-2 gap-6 p-6 bg-bg-card rounded-lg hover:border-primary/30 transition-all">
          {featured.cover && (
            <div className="relative aspect-video md:aspect-[4/3] overflow-hidden rounded-lg">
              <img
                src={featured.cover}
                alt={featured.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {isFeaturedCurrent && (
                <div className="absolute top-4 left-4 px-3 py-1 bg-accent-gold text-bg-dark text-xs font-medium rounded">
                  本周赛事
                </div>
              )}
            </div>
          )}
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-1 text-xs font-medium bg-accent-gold/20 text-accent-gold rounded">
                攻略
              </span>
              <span className="text-text-muted text-sm">
                {new Date(featured.date).toLocaleDateString('zh-CN')}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold text-text-primary mb-3 group-hover:text-primary transition-colors">
              {featured.title}
            </h2>
            {featured.excerpt && (
              <p className="text-text-secondary line-clamp-3">{featured.excerpt}</p>
            )}
          </div>
        </div>
      </Link>

      {/* 其他攻略网格 */}
      {rest.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((guide) => (
            <GuideCard key={guide.slug} guide={guide} />
          ))}
        </div>
      )}
    </div>
  );
}

// 赛道视图组件
function TrackView({
  guidesByTrack,
  allTracks,
  currentTrack,
}: {
  guidesByTrack: Map<string, Frontmatter[]>;
  allTracks: string[];
  currentTrack: string | null;
}) {
  // 排序：当前赛道置顶
  const sortedTracks = allTracks.sort((a, b) => {
    if (a === currentTrack && b !== currentTrack) return -1;
    if (b === currentTrack && a !== currentTrack) return 1;
    return a.localeCompare(b);
  });

  if (sortedTracks.length === 0) {
    return (
      <div className="text-center py-16 text-text-muted">
        暂无攻略内容
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {sortedTracks.map((trackId) => {
        const track = getTrack(trackId);
        const trackGuides = guidesByTrack.get(trackId) || [];
        const isCurrent = trackId === currentTrack;

        return (
          <div
            key={trackId}
            className={`p-6 bg-bg-card rounded-lg border ${
              isCurrent ? 'border-accent-gold' : 'border-border-subtle'
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              {isCurrent && <span className="text-xl">🔥</span>}
              <h3 className="text-lg font-semibold text-text-primary">
                {track?.name || trackId}
              </h3>
              {isCurrent && (
                <span className="px-2 py-0.5 text-xs bg-accent-gold/20 text-accent-gold rounded">
                  当前赛事
                </span>
              )}
            </div>
            <div className="space-y-3">
              {trackGuides.map((guide) => (
                <Link
                  key={guide.slug}
                  href={`/guides/${guide.slug}`}
                  className="block p-4 bg-bg-elevated rounded hover:bg-bg-elevated/80 transition-colors group"
                >
                  <h4 className="text-text-primary group-hover:text-primary transition-colors">
                    {guide.title}
                  </h4>
                  {guide.excerpt && (
                    <p className="text-sm text-text-muted mt-1 line-clamp-1">
                      {guide.excerpt}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// 攻略卡片组件
function GuideCard({ guide }: { guide: Frontmatter }) {
  return (
    <Card href={`/guides/${guide.slug}`}>
      {guide.cover && <CardImage src={guide.cover} alt={guide.title} />}
      <CardContent>
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-0.5 text-xs font-medium bg-accent-gold/20 text-accent-gold rounded">
            攻略
          </span>
          <span className="text-xs text-text-muted">
            {new Date(guide.date).toLocaleDateString('zh-CN')}
          </span>
        </div>
        <h3 className="font-medium text-text-primary mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {guide.title}
        </h3>
        {guide.excerpt && (
          <p className="text-sm text-text-secondary line-clamp-2">{guide.excerpt}</p>
        )}
      </CardContent>
    </Card>
  );
}
