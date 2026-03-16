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
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // 延迟显示导航
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
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

  // 移动端：底部固定导航
  if (isMobile) {
    return (
      <nav
        className={`fixed bottom-0 left-0 right-0 bg-bg-dark/95 backdrop-blur-xl border-t border-border-subtle z-50 transition-transform duration-300 ${
          isVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="flex items-center justify-around py-3 px-2">
          {sections.map(({ id, icon, label }) => (
            <button
              key={id}
              onClick={() => scrollToSection(id)}
              className={`relative flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-all ${
                activeSection === id
                  ? 'text-accent-gold'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              <span className="text-xl">{icon}</span>
              <span className="text-xs">{label}</span>
              {activeSection === id && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-accent-gold rounded-full" />
              )}
            </button>
          ))}
        </div>
      </nav>
    );
  }

  // 桌面端：右侧圆形导航
  return (
    <nav
      className={`hidden md:block fixed right-8 top-1/2 -translate-y-1/2 z-50 transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
      }`}
    >
      <div className="flex flex-col items-center gap-3 p-3 bg-bg-card/60 backdrop-blur-md rounded-full border border-border-subtle">
        {sections.map(({ id, icon, label }) => (
          <button
            key={id}
            onClick={() => scrollToSection(id)}
            className={`nav-circle-btn group relative ${
              activeSection === id ? 'active' : ''
            }`}
            title={label}
          >
            <span className="text-xl">{icon}</span>

            {/* 悬浮提示 */}
            <span className="absolute right-full mr-4 px-3 py-1.5 bg-bg-elevated text-text-primary text-sm font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg border border-border-subtle">
              {label}
              <span className="absolute left-full top-1/2 -translate-y-1/2 border-8 border-transparent border-l-bg-elevated" />
            </span>

            {/* 激活指示器 */}
            {activeSection === id && (
              <span className="absolute inset-0 rounded-full animate-ping bg-accent-gold/20" />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}
