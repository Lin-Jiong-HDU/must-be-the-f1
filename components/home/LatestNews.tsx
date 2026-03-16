// components/home/LatestNews.tsx
import Link from 'next/link';
import { formatRelativeTime } from '@/lib/utils';
import type { Frontmatter } from '@/types/content';

interface LatestNewsProps {
  articles: Frontmatter[];
}

export function LatestNews({ articles }: LatestNewsProps) {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* 柔和的背景过渡 */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg-card/30 via-bg-card/20 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 标题区域 */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div className="space-y-3">
            <p className="text-sm text-text-muted tracking-wider">
              LATEST UPDATES
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold text-text-primary tracking-tight">
              围场动态
            </h2>
          </div>
          <Link
            href="/news"
            className="group inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            <span>查看全部</span>
            <svg
              className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* 新闻列表 */}
        <div className="space-y-3">
          {articles.slice(0, 5).map((article, index) => (
            <Link
              key={article.slug}
              href={`/news/${article.slug}`}
              className="group block"
            >
              <div className="flex items-center gap-4 sm:gap-6 p-4 sm:p-5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.04] hover:border-white/[0.08] transition-all duration-300">
                {/* 日期卡片 */}
                <div className="hidden sm:flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-white/[0.03] border border-white/[0.05] shrink-0">
                  <span className="text-lg font-medium text-text-primary">
                    {new Date(article.date).getDate()}
                  </span>
                  <span className="text-[10px] text-text-muted uppercase tracking-wide">
                    {new Date(article.date).toLocaleDateString('en-US', { month: 'short' })}
                  </span>
                </div>

                {/* 序号 */}
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/[0.03] shrink-0 sm:hidden">
                  <span className="text-sm text-text-muted">{index + 1}</span>
                </div>

                {/* 标题 */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg text-text-secondary group-hover:text-text-primary transition-colors truncate">
                    {article.title}
                  </h3>
                </div>

                {/* 右侧 */}
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm text-text-muted hidden sm:inline">
                    {formatRelativeTime(article.date)}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-white/[0.03] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <svg className="w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 底部装饰 */}
        <div className="flex items-center justify-center mt-16">
          <div className="h-px w-32 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
      </div>
    </section>
  );
}
