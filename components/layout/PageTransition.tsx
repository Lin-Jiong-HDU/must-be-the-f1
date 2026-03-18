'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const [displayChildren, setDisplayChildren] = useState(children);
  const prevPathnameRef = useRef(pathname);

  useEffect(() => {
    // 如果路径没有变化，不需要动画
    if (pathname === prevPathnameRef.current) {
      setDisplayChildren(children);
      return;
    }

    const container = containerRef.current;
    if (!container) {
      setDisplayChildren(children);
      prevPathnameRef.current = pathname;
      return;
    }

    // 退出动画：向下滑动并淡出
    container.style.transition = 'transform 0.3s ease-in, opacity 0.3s ease-in';
    container.style.transform = 'translateY(30px)';
    container.style.opacity = '0';

    // 等待退出动画完成
    const exitTimer = setTimeout(() => {
      // 更新内容
      setDisplayChildren(children);
      prevPathnameRef.current = pathname;

      // 准备进入动画：从上方开始
      container.style.transition = 'none';
      container.style.transform = 'translateY(-30px)';
      container.style.opacity = '0';

      // 强制重绘
      void container.offsetHeight;

      // 进入动画：向下滑动到原位并淡入
      container.style.transition = 'transform 0.4s ease-out, opacity 0.4s ease-out';
      container.style.transform = 'translateY(0)';
      container.style.opacity = '1';
    }, 300);

    return () => clearTimeout(exitTimer);
  }, [pathname, children]);

  return (
    <div
      ref={containerRef}
      className="flex-1"
      style={{
        opacity: 1,
        transform: 'translateY(0)',
      }}
    >
      {displayChildren}
    </div>
  );
}
