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
    'inline-flex items-center justify-center px-4 py-2 text-sm font-medium transition-all',
    {
      'bg-primary text-white hover:bg-primary/80 neon-glow': variant === 'primary',
      'bg-secondary text-bg-dark hover:bg-secondary/80 neon-glow-secondary': variant === 'secondary',
      'bg-transparent text-text-primary hover:bg-bg-elevated border border-text-muted/30': variant === 'ghost',
    },
    className
  );

  return href ? <Link href={href} className={styles}>{children}</Link> : <button className={styles}>{children}</button>;
}
