// components/ui/Card.tsx
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
}

export function Card({ children, className, href }: CardProps) {
  const content = (
    <div className={cn(
      'bg-bg-card border border-text-muted/10 overflow-hidden transition-all hover:border-primary/30',
      className
    )}>
      {children}
    </div>
  );
  return href ? <Link href={href}>{content}</Link> : content;
}

export function CardImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative aspect-video overflow-hidden">
      <Image src={src} alt={alt} fill className="object-cover hover:scale-105 transition-transform duration-300" />
    </div>
  );
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('p-4', className)}>{children}</div>;
}
