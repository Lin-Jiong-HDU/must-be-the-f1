// app/news/page.tsx
import { getAllContent } from '@/lib/content';
import { ArticleCard } from '@/components/content/ArticleCard';

export const metadata = {
  title: '围场新闻 - F1 资讯站',
  description: 'F1 围场最新资讯、车队动态、车手新闻',
};

export default function NewsPage() {
  const articles = getAllContent('news');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">围场新闻</h1>
        <p className="text-text-secondary">F1 围场最新资讯、车队动态、车手新闻</p>
      </header>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map(article => <ArticleCard key={article.slug} article={article} />)}
      </div>
      {articles.length === 0 && <div className="text-center py-12 text-text-muted">暂无新闻内容</div>}
    </div>
  );
}
