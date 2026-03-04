'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutGrid,
  Brain,
  Bot,
  Search,
  ChevronDown,
  Command,
  Plus,
} from 'lucide-react';

const navItems = [
  { label: '数据中心', icon: LayoutGrid, href: '/data-source' },
  { label: '记忆管理', icon: Brain, href: '/memory' },
  { label: '自定义Agent', icon: Bot, href: '/custom-agent' },
  { label: '搜索任务', icon: Search, href: '#' },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '#') return false;
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(href + '/');
  };

  const isHomePage = pathname === '/' || pathname.startsWith('/session');

  return (
    <aside className="fixed left-0 top-0 h-full w-[260px] bg-white border-r border-gray-200 flex flex-col z-50">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center text-white font-bold text-base shadow-sm">
            D
          </div>
          <span className="text-sm font-semibold text-gray-800">Data Agent</span>
        </Link>

        {/* User Space */}
        <button className="w-full flex items-center justify-between px-3 py-2.5 bg-gray-50 rounded-md text-sm text-gray-600 hover:bg-gray-100 transition-colors mb-3">
          <span>个人空间</span>
          <ChevronDown size={14} />
        </button>

        {/* New Task Button */}
        <Link
          href="/"
          className="w-full flex items-center justify-between px-3 py-2.5 border border-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <Plus size={14} />
            新任务
          </span>
          <span className="flex items-center gap-0.5 text-xs text-gray-400">
            <Command size={10} />P
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 mx-2 px-3 py-2.5 rounded-md text-sm transition-all border-l-2 ${
                active
                  ? 'bg-purple-50 text-purple-600 font-medium border-l-purple-600'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700 border-l-transparent'
              }`}
            >
              <Icon size={16} strokeWidth={active ? 2 : 1.5} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
