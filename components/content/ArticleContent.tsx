// components/content/ArticleContent.tsx
import ReactMarkdown from 'react-markdown';
import type { Article } from '@/types/content';

interface ArticleContentProps {
  article: Article;
}

export function ArticleContent({ article }: ArticleContentProps) {
  return (
    <article className="max-w-3xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">{article.title}</h1>
        <div className="flex items-center gap-4 text-sm text-text-secondary">
          <time>{new Date(article.date).toLocaleDateString('zh-CN')}</time>
          {article.tags && article.tags.length > 0 && <span>{article.tags.join(' · ')}</span>}
        </div>
      </header>
      {article.cover && (
        <div className="relative aspect-video mb-8 overflow-hidden rounded-lg">
          <img src={article.cover} alt={article.title} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="prose prose-invert prose-lg max-w-none
        prose-headings:text-text-primary prose-headings:font-bold
        prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
        prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
        prose-p:text-text-secondary prose-p:leading-relaxed
        prose-a:text-secondary prose-a:no-underline hover:prose-a:underline
        prose-strong:text-text-primary
        prose-ul:text-text-secondary prose-ol:text-text-secondary
        prose-li:marker:text-text-muted
        prose-code:text-secondary prose-code:bg-bg-elevated prose-code:px-1 prose-code:py-0.5 prose-code:rounded
        prose-pre:bg-bg-elevated prose-pre:border prose-pre:border-text-muted/10
        prose-blockquote:border-l-secondary prose-blockquote:text-text-secondary">
        <ReactMarkdown>{article.content}</ReactMarkdown>
      </div>
    </article>
  );
}
