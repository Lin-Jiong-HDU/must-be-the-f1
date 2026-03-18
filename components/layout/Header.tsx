// components/layout/Header.tsx
import Link from 'next/link';
import { Navigation } from './Navigation';

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-bg-dark/90 backdrop-blur-xl border-b border-border-subtle">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-primary rounded flex items-center justify-center">
              <span className="text-white font-bold text-lg">F1</span>
            </div>
            <span className="text-xl font-medium text-text-primary hidden sm:block tracking-tight"
                  style={{ fontFamily: 'var(--font-serif), var(--font-serif-cn), Georgia, serif' }}>
              Must Be The F1
            </span>
          </Link>
          <Navigation />
        </div>
      </div>
    </header>
  );
}
