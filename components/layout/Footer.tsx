// components/layout/Footer.tsx
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-bg-card border-t border-text-muted/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary">F1</span>
            <span className="text-sm text-text-muted">资讯站 · 2026</span>
          </div>
          <nav className="flex items-center gap-6 text-sm text-text-muted">
            <Link href="/about" className="hover:text-text-primary">关于我们</Link>
            <Link href="/library" className="hover:text-text-primary">资料库</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
