import type { Metadata } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Data Agent for Analytics',
  description: 'AI-powered data analysis agent - 智能数据分析助手',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-slate-50">{children}</body>
    </html>
  );
}
