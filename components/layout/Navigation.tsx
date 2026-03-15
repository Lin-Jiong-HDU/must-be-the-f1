// components/layout/Navigation.tsx
import Link from 'next/link';

const navItems = [
  { href: '/news', label: '围场新闻' },
  { href: '/races', label: '赛事深度' },
  { href: '/guides', label: '城市攻略' },
  { href: '/library', label: '资料库' },
];

export function Navigation() {
  return (
    <nav className="flex items-center gap-6">
      {navItems.map(item => (
        <Link key={item.href} href={item.href}
          className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
