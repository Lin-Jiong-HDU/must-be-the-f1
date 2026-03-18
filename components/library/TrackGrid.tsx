// components/library/TrackGrid.tsx
import Link from 'next/link';
import Image from 'next/image';
import type { Track } from '@/types/content';

interface TrackGridProps {
  tracks: Track[];
  raceDates: Map<string, string>;
}

export function TrackGrid({ tracks, raceDates }: TrackGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {tracks.map((track) => {
        const raceDate = raceDates.get(track.id);
        return (
          <Link
            key={track.id}
            href={`/library/tracks/${track.id}`}
            className="group relative bg-bg-card border border-border-subtle rounded-xl overflow-hidden transition-all duration-300 hover:border-primary/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5"
          >
            {/* 赛道图 */}
            <div className="relative aspect-[4/3] bg-bg-elevated/50 overflow-hidden">
              <Image
                src={track.trackImage}
                alt={track.name}
                fill
                className="object-contain p-6 opacity-60 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
              />
              {/* 悬浮渐变 */}
              <div className="absolute inset-0 bg-gradient-to-t from-bg-card via-transparent to-transparent" />

              {/* 赛道首年标签 */}
              <div className="absolute top-3 right-3 px-2 py-1 bg-bg-dark/80 backdrop-blur-sm rounded-md text-xs text-text-muted">
                Since {track.firstHeld}
              </div>
            </div>

            {/* 内容 */}
            <div className="p-4">
              {/* 赛道名称 */}
              <h3 className="text-lg font-semibold text-text-primary mb-1 group-hover:text-primary transition-colors">
                {track.name}
              </h3>

              {/* 地点 */}
              <p className="text-sm text-text-secondary mb-3">
                {track.location}，{track.country}
              </p>

              {/* 技术参数 */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border-subtle">
                <div className="text-center">
                  <p className="text-xs text-text-muted mb-0.5">长度</p>
                  <p className="text-sm font-medium text-text-primary">{track.length} km</p>
                </div>
                <div className="text-center border-x border-border-subtle">
                  <p className="text-xs text-text-muted mb-0.5">圈数</p>
                  <p className="text-sm font-medium text-text-primary">{track.laps}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-text-muted mb-0.5">弯道</p>
                  <p className="text-sm font-medium text-text-primary">{track.turns}</p>
                </div>
              </div>

              {/* 比赛日期（如果有） */}
              {raceDate && (
                <div className="mt-3 pt-3 border-t border-border-subtle flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  <span className="text-xs text-primary">
                    {new Date(raceDate).toLocaleDateString('zh-CN', {
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              )}
            </div>

            {/* 悬浮时的角标 */}
            <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="px-2 py-1 bg-primary text-white text-xs font-medium rounded">
                3D 模型
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
