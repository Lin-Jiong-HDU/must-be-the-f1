// components/content/ArticleCard.tsx
import { Card, CardImage, CardContent } from '@/components/ui/Card';
import { Tag } from '@/components/ui/Tag';
import { formatDate } from '@/lib/utils';
import type { Frontmatter } from '@/types/content';

interface ArticleCardProps {
  article: Frontmatter;
  size?: 'default' | 'large';
}

export function ArticleCard({ article, size = 'default' }: ArticleCardProps) {
  const typeLabels: Record<string, string> = { news: '新闻', race: '赛事', guide: '攻略', library: '资料' };

  return (
    <Card href={`/${article.type}/${article.slug}`}>
      {article.cover && <CardImage src={article.cover} alt={article.title} />}
      <CardContent className={size === 'large' ? 'p-6' : undefined}>
        <div className="flex items-center gap-2 mb-2">
          <Tag variant="primary">{typeLabels[article.type]}</Tag>
          <span className="text-xs text-text-muted">{formatDate(article.date)}</span>
        </div>
        <h3 className={`font-medium text-text-primary mb-2 line-clamp-2 ${size === 'large' ? 'text-xl' : 'text-base'}`}>
          {article.title}
        </h3>
        {article.excerpt && <p className="text-sm text-text-secondary line-clamp-2">{article.excerpt}</p>}
      </CardContent>
    </Card>
  );
}
