// components/guides/GuideDetail.tsx
'use client';

import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { SectionNav } from './SectionNav';
import { getTrack } from '@/lib/data';
import type { Article } from '@/types/content';

interface GuideDetailProps {
  article: Article;
}

const sectionConfig = {
  '交通指南': { icon: '🚇', color: '#00D4FF' },
  '看台推荐': { icon: '🎫', color: '#FFD700' },
  '住宿美食': { icon: '🏨', color: '#FF6B6B' },
  '景点购物': { icon: '🛍️', color: '#A855F7' },
};

export function GuideDetail({ article }: GuideDetailProps) {
  const track = getTrack(article.track || '');
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);

  // 板块进入动画
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '-50px' }
    );

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="relative">
      <SectionNav />

      {/* 沉浸式头图 */}
      <header className="immersive-hero -mx-4 md:-mx-8 lg:-mx-16 xl:-mx-24">
        {article.cover && (
          <div className="absolute inset-0">
            <img
              src={article.cover}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="relative z-10 w-full max-w-4xl mx-auto px-4 text-center">
          {/* 赛道标签 */}
          <div className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-sm text-white">
              {track?.name || '攻略'}
            </span>
          </div>

          {/* 标题 */}
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
            style={{ fontFamily: 'var(--font-serif), var(--font-serif-cn), Georgia, serif' }}
          >
            {article.title}
          </h1>

          {/* 摘要 */}
          {article.excerpt && (
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-6">
              {article.excerpt}
            </p>
          )}

          {/* 元信息 */}
          <div className="flex items-center justify-center gap-6 text-sm text-white/60">
            <span>{formatDate(article.date)}</span>
            {article.tags && article.tags.length > 0 && (
              <span>{article.tags.join(' · ')}</span>
            )}
          </div>

          {/* 滚动提示 */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </header>

      {/* 装饰分隔 */}
      <div className="decorative-divider max-w-2xl mx-auto mt-8 mb-12">
        <span className="dot" />
      </div>

      {/* 正文内容 */}
      <article className="max-w-4xl mx-auto px-4 pb-32">
        <div className="guide-content">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h2: ({ children }) => {
                const text = String(children);
                const config = sectionConfig[text as keyof typeof sectionConfig] || { icon: '📍', color: '#FFD700' };
                const sectionIndex = Object.keys(sectionConfig).indexOf(text);

                return (
                  <h2
                    id={text}
                    ref={(el) => { sectionsRef.current[sectionIndex] = el; }}
                    className="section-animate scroll-mt-24"
                  >
                    <div className="decorative-heading mb-6">
                      <span className="text-4xl">{config.icon}</span>
                      <span
                        className="text-2xl md:text-3xl font-bold text-text-primary"
                        style={{
                          fontFamily: 'var(--font-serif), var(--font-serif-cn), Georgia, serif',
                        }}
                      >
                        {text}
                      </span>
                    </div>
                  </h2>
                );
              },
              h3: ({ children }) => (
                <h3 className="text-xl font-semibold text-text-primary mt-8 mb-4">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="mb-4 text-text-reading leading-relaxed">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="list-none mb-4 text-text-reading space-y-2 pl-4">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside mb-4 text-text-reading space-y-2">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="relative pl-4 before:content-['›'] before:absolute before:left-0 before:text-accent-gold">
                  {children}
                </li>
              ),
              strong: ({ children }) => (
                <strong className="text-text-primary font-semibold">
                  {children}
                </strong>
              ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  className="text-secondary underline underline-offset-2 hover:text-primary transition-colors"
                >
                  {children}
                </a>
              ),
              blockquote: ({ children }) => (
                <blockquote className="relative pl-6 my-6 text-text-secondary italic border-l-2 border-accent-gold">
                  {children}
                </blockquote>
              ),
            }}
          >
            {article.content}
          </ReactMarkdown>
        </div>

        {/* 文章底部 */}
        <footer className="mt-16 pt-8 border-t border-border-subtle">
          <div className="flex flex-wrap items-center gap-3">
            {article.tags?.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-bg-elevated text-text-secondary text-sm rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </footer>
      </article>
    </div>
  );
}
