// components/content/ArticleContent.tsx
import ReactMarkdown from 'react-markdown';
import type { Article } from '@/types/content';

interface ArticleContentProps {
  article: Article;
}

export function ArticleContent({ article }: ArticleContentProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <article>
      {/* 文章头部 - 杂志风格 */}
      <header className="text-center mb-12 pt-8">
        {/* 分类标签 */}
        <div className="mb-6">
          <span className="inline-block px-3 py-1 text-xs font-medium tracking-widest uppercase text-primary border border-primary/30">
            {article.type === 'news' ? '围场新闻' : article.type}
          </span>
        </div>

        {/* 标题 */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-text-primary mb-6 leading-tight tracking-tight"
            style={{ fontFamily: 'var(--font-serif), var(--font-serif-cn), Georgia, serif' }}>
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
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          <div className="w-12 h-px bg-gradient-to-l from-transparent to-text-muted/50" />
        </div>
      </header>

      {/* 封面图 */}
      {article.cover && (
        <div className="relative mb-16 -mx-4 md:-mx-8 lg:-mx-16">
          <div className="relative aspect-[21/9] overflow-hidden">
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
      <div className="max-w-2xl mx-auto">
        <div className="article-content drop-cap">
          <ReactMarkdown
            components={{
              p: ({ children }) => <p className="mb-6">{children}</p>,
              h2: ({ children }) => <h2>{children}</h2>,
              h3: ({ children }) => <h3>{children}</h3>,
              blockquote: ({ children }) => (
                <blockquote className="relative">
                  <span className="absolute -left-4 top-0 text-4xl text-primary/30 font-serif">"</span>
                  {children}
                </blockquote>
              ),
            }}
          >
            {article.content}
          </ReactMarkdown>
        </div>
      </div>

      {/* 文章底部 */}
      <footer className="mt-16 pt-8 border-t border-border-subtle">
        <div className="flex items-center justify-between text-sm text-text-muted">
          <div className="flex items-center gap-4">
            {article.tags?.map(tag => (
              <span key={tag} className="px-3 py-1 bg-bg-elevated rounded-full text-xs">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </footer>
    </article>
  );
}
