// components/guides/SectionNav.tsx
'use client';

import { useEffect, useState } from 'react';

const sections = [
  { id: '交通指南', icon: '🚇', label: '交通' },
  { id: '看台推荐', icon: '🎫', label: '看台' },
  { id: '住宿美食', icon: '🏨', label: '住宿' },
  { id: '景点购物', icon: '🛍️', label: '景点' },
];

export function SectionNav() {
  const [activeSection, setActiveSection] = useState<string>('交通指南');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );

    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // 移动端：底部固定 Tab 栏
  if (isMobile) {
    return (
      <nav className="fixed bottom-0 left-0 right-0 bg-bg-dark/95 backdrop-blur-xl border-t border-border-subtle z-40">
        <div className="flex items-center justify-around py-2">
          {sections.map(({ id, icon, label }) => (
            <button
              key={id}
              onClick={() => scrollToSection(id)}
              className={`flex flex-col items-center py-2 px-3 transition-colors ${
                activeSection === id ? 'text-accent-gold' : 'text-text-muted'
              }`}
            >
              <span className="text-lg">{icon}</span>
              <span className="text-xs mt-1">{label}</span>
            </button>
          ))}
        </div>
      </nav>
    );
  }

  // 桌面端：右侧固定导航
  return (
    <nav className="hidden md:block fixed right-8 top-1/2 -translate-y-1/2 z-40">
      <div className="flex flex-col items-center gap-2 p-3 bg-bg-card/80 backdrop-blur-sm rounded-full border border-border-subtle">
        {sections.map(({ id, icon, label }) => (
          <button
            key={id}
            onClick={() => scrollToSection(id)}
            className={`group relative flex items-center justify-center w-10 h-10 rounded-full transition-all ${
              activeSection === id
                ? 'bg-accent-gold text-bg-dark'
                : 'text-text-muted hover:text-text-primary hover:bg-bg-elevated'
            }`}
            title={label}
          >
            <span className="text-lg">{icon}</span>
            {/* 悬浮提示 */}
            <span className="absolute right-full mr-3 px-2 py-1 bg-bg-elevated text-text-primary text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}
