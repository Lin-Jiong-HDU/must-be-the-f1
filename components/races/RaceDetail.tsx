// components/races/RaceDetail.tsx
import { ArticleContent } from '@/components/content/ArticleContent';
import { getTrack } from '@/lib/data';
import type { Article } from '@/types/content';

interface RaceDetailProps {
  article: Article;
}

export function RaceDetail({ article }: RaceDetailProps) {
  const track = getTrack(article.track || '');

  return (
    <div className="max-w-4xl mx-auto">
      {/* 赛事信息头 */}
      <div className="mb-8 p-6 bg-bg-card rounded-lg border border-border-subtle">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-text-muted text-xs uppercase tracking-wider mb-1">赛道</p>
            <p className="text-text-primary font-medium">{track?.name || '未知'}</p>
          </div>
          <div>
            <p className="text-text-muted text-xs uppercase tracking-wider mb-1">圈数</p>
            <p className="text-text-primary font-medium">{track?.laps || '-'} 圈</p>
          </div>
          <div>
            <p className="text-text-muted text-xs uppercase tracking-wider mb-1">单圈长度</p>
            <p className="text-text-primary font-medium">{track?.length || '-'} km</p>
          </div>
          <div>
            <p className="text-text-muted text-xs uppercase tracking-wider mb-1">弯道</p>
            <p className="text-text-primary font-medium">{track?.turns || '-'} 个</p>
          </div>
        </div>
      </div>

      <ArticleContent article={article} />
    </div>
  );
}
