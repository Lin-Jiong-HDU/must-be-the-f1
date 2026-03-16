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
    <div className="min-h-screen">
      {/* 装饰性头部 */}
      <header className="relative py-16 md:py-24 overflow-hidden">
        {/* 斜条纹背景 */}
        <div className="absolute inset-0 stripe-decoration opacity-30" />

        {/* 角落装饰 */}
        <div className="absolute top-0 left-0 w-32 h-32">
          <div className="absolute top-4 left-4 w-20 h-0.5 bg-accent-gold/40 rotate-45 origin-left" />
          <div className="absolute top-8 left-0 w-16 h-0.5 bg-accent-gold/30 rotate-45 origin-left" />
        </div>

        <div className="absolute bottom-0 right-0 w-32 h-32">
          <div className="absolute bottom-4 right-4 w-20 h-0.5 bg-accent-gold/40 -rotate-45 origin-right" />
          <div className="absolute bottom-8 right-0 w-16 h-0.5 bg-accent-gold/30 -rotate-45 origin-right" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* 小标签 */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-gold/10 border border-accent-gold/30 rounded-full mb-6">
            <span className="w-2 h-2 bg-accent-gold rounded-full animate-pulse" />
            <span className="text-accent-gold text-sm font-medium tracking-wider uppercase">
              City Guides
            </span>
          </div>

          {/* 主标题 */}
          <h1
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-text-primary mb-6 tracking-tight"
            style={{ fontFamily: 'var(--font-serif), var(--font-serif-cn), Georgia, serif' }}
          >
            城市攻略
          </h1>

          {/* 副标题 */}
          <p className="text-xl md:text-2xl text-text-secondary max-w-2xl mx-auto">
            <span className="text-accent-gold">赛道交通</span>
            <span className="mx-3 text-text-muted">·</span>
            <span className="text-accent-gold">看台推荐</span>
            <span className="mx-3 text-text-muted">·</span>
            <span className="text-accent-gold">住宿美食</span>
            <span className="mx-3 text-text-muted">·</span>
            <span className="text-accent-gold">景点购物</span>
          </p>

          {/* 统计 */}
          <div className="mt-8 text-text-muted text-sm">
            共 {guides.length} 篇攻略
          </div>
        </div>

        {/* 底部装饰线 */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-gold/30 to-transparent" />
      </header>

      {/* 内容区域 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        <GuideList guides={guides} />
      </div>
    </div>
  );
}
