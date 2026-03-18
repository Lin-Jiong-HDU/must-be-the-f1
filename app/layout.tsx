import type { Metadata } from 'next';
import { Playfair_Display, Inter, Noto_Serif_SC } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageTransition } from '@/components/layout/PageTransition';
import { NextRaceBar } from '@/components/layout/NextRaceBar';

const playfair = Playfair_Display({
  variable: '--font-serif',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
});

const notoSerifSC = Noto_Serif_SC({
  variable: '--font-serif-cn',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Must Be The F1',
  description: 'F1 赛车资讯、赛事深度解读与城市观赛攻略',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className={`${playfair.variable} ${inter.variable} ${notoSerifSC.variable} antialiased min-h-screen flex flex-col`}>
        <Header />
        <NextRaceBar />
        <PageTransition>{children}</PageTransition>
        <Footer />
      </body>
    </html>
  );
}
