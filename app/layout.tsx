import type { Metadata } from 'next';
import { Bebas_Neue, Noto_Sans_SC } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const bebasNeue = Bebas_Neue({ variable: '--font-heading', subsets: ['latin'], weight: '400' });
const notoSansSC = Noto_Sans_SC({ variable: '--font-body', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'F1 资讯站',
  description: 'F1 赛车资讯、赛事深度解读与城市观赛攻略',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className={`${bebasNeue.variable} ${notoSansSC.variable} antialiased min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
