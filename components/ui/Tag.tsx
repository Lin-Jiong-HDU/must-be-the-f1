// components/ui/Tag.tsx
import { cn } from '@/lib/utils';

interface TagProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary';
  className?: string;
}

export function Tag({ children, variant = 'default', className }: TagProps) {
  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 text-xs font-medium rounded',
      {
        'bg-bg-elevated text-text-secondary': variant === 'default',
        'bg-primary/20 text-primary': variant === 'primary',
        'bg-secondary/20 text-secondary': variant === 'secondary',
      },
      className
    )}>
      {children}
    </span>
  );
}
