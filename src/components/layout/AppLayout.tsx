'use client';

import Sidebar from './Sidebar';

interface AppLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

export default function AppLayout({ children, showSidebar = true }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {showSidebar && <Sidebar />}
      <main className={showSidebar ? 'ml-[260px]' : ''}>{children}</main>
    </div>
  );
}
