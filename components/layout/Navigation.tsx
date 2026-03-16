// components/layout/Navigation.tsx
import Link from 'next/link';

const navItems = [
  { href: '/news', label: '新闻' },
  { href: '/races', label: '赛事' },
  { href: '/guides', label: '攻略' },
  { href: '/library', label: '资料' },
];

export function Navigation() {
  return (
    <nav className="flex items-center gap-8">
      {navItems.map((item, index) => (
        <div key={item.href} className="flex items-center gap-8">
          {index > 0 && <span className="text-text-muted/30">|</span>}
          <Link
            href={item.href}
            className="text-sm tracking-wide text-text-secondary hover:text-text-primary transition-colors duration-200"
          >
            {item.label}
          </Link>
        </div>
      ))}
    </nav>
  );
}
