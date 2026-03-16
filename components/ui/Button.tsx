// components/ui/Button.tsx
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  href?: string;
  className?: string;
}

export function Button({ children, variant = 'primary', href, className }: ButtonProps) {
  const styles = cn(
    'inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium transition-all duration-300 rounded-xl',
    {
      // Primary: 柔和的白色背景
      'bg-white/[0.95] text-bg-dark hover:bg-white shadow-lg hover:shadow-xl': variant === 'primary',
      // Secondary: 柔和的边框
      'bg-white/[0.05] text-text-primary hover:bg-white/[0.08] border border-white/[0.1] hover:border-white/[0.15]': variant === 'secondary',
      // Ghost: 透明
      'bg-transparent text-text-secondary hover:text-text-primary hover:bg-white/[0.03]': variant === 'ghost',
    },
    className
  );

  return href ? <Link href={href} className={styles}>{children}</Link> : <button className={styles}>{children}</button>;
}
