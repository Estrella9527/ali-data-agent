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
import { Button } from '@/components/ui/button';

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

  return (
    <aside className="fixed left-0 top-0 h-full w-[260px] bg-sidebar-background border-r border-sidebar-border flex flex-col z-50">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-sidebar-border">
        <Link href="/" className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-bold text-base shadow-sm">
            D
          </div>
          <span className="text-sm font-semibold text-sidebar-foreground">Data Agent</span>
        </Link>

        {/* User Space */}
        <Button
          variant="ghost"
          className="w-full justify-between px-3 py-2.5 bg-muted text-muted-foreground hover:bg-accent mb-3"
        >
          <span>个人空间</span>
          <ChevronDown size={14} />
        </Button>

        {/* New Task Button */}
        <Link href="/">
          <Button
            variant="outline"
            className="w-full justify-between px-3 py-2.5"
          >
            <span className="flex items-center gap-1.5">
              <Plus size={14} />
              新任务
            </span>
            <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
              <Command size={10} />P
            </span>
          </Button>
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
                  ? 'bg-primary/10 text-primary font-medium border-l-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground border-l-transparent'
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
