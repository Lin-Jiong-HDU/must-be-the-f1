// components/content/ArticleContent.tsx
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
      <div className="prose prose-invert prose-lg max-w-none">
        <div dangerouslySetInnerHTML={{ __html: article.content }} />
      </div>
    </article>
  );
}
