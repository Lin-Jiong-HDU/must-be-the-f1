'use client';

import { usePathname } from 'next/navigation';

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <main key={pathname} className="flex-1 page-fade-in">
      {children}
    </main>
  );
}
