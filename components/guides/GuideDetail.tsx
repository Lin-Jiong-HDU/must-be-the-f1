// components/guides/GuideDetail.tsx
'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { SectionNav } from './SectionNav';
import { getTrack } from '@/lib/data';
import type { Article } from '@/types/content';

interface GuideDetailProps {
  article: Article;
}

export function GuideDetail({ article }: GuideDetailProps) {
  const track = getTrack(article.track || '');

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="relative">
      {/* 侧边导航 */}
      <SectionNav />

      <article className="max-w-4xl mx-auto">
        {/* 文章头部 */}
        <header className="text-center mb-12 pt-8">
          {/* 赛道标签 */}
          <div className="mb-6">
            <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-medium tracking-widest uppercase text-accent-gold border border-accent-gold/30 rounded">
              {track?.name || '攻略'}
            </span>
          </div>

          {/* 标题 */}
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-semibold text-text-primary mb-6 leading-tight tracking-tight"
            style={{ fontFamily: 'var(--font-serif), var(--font-serif-cn), Georgia, serif' }}
          >
            {article.title}
          </h1>

          {/* 摘要 */}
          {article.excerpt && (
            <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
              {article.excerpt}
            </p>
          )}

          {/* 元信息 */}
          <div className="flex items-center justify-center gap-6 mt-8 text-sm text-text-muted">
            <time className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatDate(article.date)}
            </time>
            {article.tags && article.tags.length > 0 && (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                {article.tags.join(' / ')}
              </div>
            )}
          </div>

          {/* 分隔线 */}
          <div className="mt-10 flex items-center justify-center gap-4">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-text-muted/50" />
            <div className="w-1.5 h-1.5 rounded-full bg-accent-gold" />
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-text-muted/50" />
          </div>
        </header>

        {/* 封面图 */}
        {article.cover && (
          <div className="relative mb-16 -mx-4 md:-mx-8 lg:-mx-16">
            <div className="relative aspect-[21/9] overflow-hidden rounded-lg">
              <img
                src={article.cover}
                alt={article.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/60 via-transparent to-transparent" />
            </div>
          </div>
        )}

        {/* 正文内容 */}
        <div className="guide-content pb-24 md:pb-12">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h2: ({ children }) => {
                const text = String(children);
                const icons: Record<string, string> = {
                  '交通指南': '🚇',
                  '看台推荐': '🎫',
                  '住宿美食': '🏨',
                  '景点购物': '🛍️',
                };
                const icon = icons[text] || '📍';
                return (
                  <h2
                    id={text}
                    className="flex items-center gap-3 text-2xl font-semibold text-text-primary mt-12 mb-6 pt-8 scroll-mt-24"
                  >
                    <span className="text-3xl">{icon}</span>
                    {text}
                  </h2>
                );
              },
              h3: ({ children }) => (
                <h3 className="text-xl font-medium text-text-primary mt-8 mb-4">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="mb-4 text-text-reading leading-relaxed">{children}</p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside mb-4 text-text-reading space-y-2">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside mb-4 text-text-reading space-y-2">{children}</ol>
              ),
              li: ({ children }) => (
                <li className="text-text-reading">{children}</li>
              ),
              strong: ({ children }) => (
                <strong className="text-text-primary font-semibold">{children}</strong>
              ),
              a: ({ href, children }) => (
                <a href={href} className="text-secondary underline underline-offset-2 hover:text-primary transition-colors">
                  {children}
                </a>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-accent-gold pl-4 my-6 italic text-text-secondary">
                  {children}
                </blockquote>
              ),
            }}
          >
            {article.content}
          </ReactMarkdown>
        </div>

        {/* 文章底部 */}
        <footer className="mt-16 pt-8 border-t border-border-subtle pb-24 md:pb-8">
          <div className="flex items-center justify-between text-sm text-text-muted">
            <div className="flex items-center gap-4">
              {article.tags?.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-bg-elevated rounded-full text-xs">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </footer>
      </article>
    </div>
  );
}
