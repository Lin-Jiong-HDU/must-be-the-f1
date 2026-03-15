// components/home/LatestNews.tsx
import Link from 'next/link';
import { formatRelativeTime } from '@/lib/utils';
import type { Frontmatter } from '@/types/content';

interface LatestNewsProps {
  articles: Frontmatter[];
}

export function LatestNews({ articles }: LatestNewsProps) {
  return (
    <section className="py-12 bg-bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-text-primary">最新围场新闻</h2>
          <Link href="/news" className="text-sm text-secondary hover:text-secondary/80">查看全部 →</Link>
        </div>
        <div className="space-y-4">
          {articles.slice(0, 5).map(article => (
            <Link key={article.slug} href={`/news/${article.slug}`}
              className="flex items-center justify-between p-4 bg-bg-elevated hover:bg-bg-elevated/80 rounded-lg group">
              <span className="text-text-primary group-hover:text-primary transition-colors">{article.title}</span>
              <span className="text-sm text-text-muted shrink-0 ml-4">{formatRelativeTime(article.date)}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
