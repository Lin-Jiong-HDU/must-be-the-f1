// app/guides/page.tsx
import { getAllContent } from '@/lib/content';
import { GuideList } from '@/components/guides/GuideList';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '城市攻略 - F1 资讯站',
  description: 'F1 各站赛事观赛攻略，包含交通指南、看台推荐、住宿美食等信息',
};

export default function GuidesPage() {
  const guides = getAllContent('guide');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-12 text-center">
        <h1
          className="text-4xl md:text-5xl font-semibold text-text-primary mb-4"
          style={{ fontFamily: 'var(--font-serif), var(--font-serif-cn), Georgia, serif' }}
        >
          城市攻略
        </h1>
        <p className="text-text-secondary max-w-2xl mx-auto">
          赛道交通 · 看台推荐 · 住宿美食 · 景点购物
        </p>
      </header>

      <GuideList guides={guides} />
    </div>
  );
}
