// app/guides/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { getContent, getAllSlugs } from '@/lib/content';
import { GuideDetail } from '@/components/guides/GuideDetail';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  const slugs = getAllSlugs('guide');
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getContent('guide', slug);

  if (!article) {
    return { title: '未找到 - F1 资讯站' };
  }

  return {
    title: `${article.title} - F1 资讯站`,
    description: article.excerpt,
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getContent('guide', slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="py-12 px-4">
      <GuideDetail article={article} />
    </div>
  );
}
