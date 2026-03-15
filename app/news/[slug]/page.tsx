// app/news/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { getContent, getAllSlugs } from '@/lib/content';
import { ArticleContent } from '@/components/content/ArticleContent';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs('news').map(slug => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const article = getContent('news', slug);
  return article ? { title: `${article.title} - F1 资讯站` } : { title: '未找到' };
}

export default async function NewsDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const article = getContent('news', slug);
  if (!article) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <ArticleContent article={article} />
    </div>
  );
}
