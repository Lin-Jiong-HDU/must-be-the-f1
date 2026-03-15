// components/layout/Header.tsx
import Link from 'next/link';
import { Navigation } from './Navigation';

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-bg-dark/80 backdrop-blur-md border-b border-text-muted/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary">F1</span>
            <span className="text-lg font-medium text-text-primary hidden sm:block">资讯站</span>
          </Link>
          <Navigation />
        </div>
      </div>
    </header>
  );
}
