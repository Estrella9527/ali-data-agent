'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TrendingUp, Database, BarChart3, FileSearch, Send, Paperclip } from 'lucide-react';

const quickActions = [
  {
    icon: TrendingUp,
    label: '销售趋势分析',
    desc: '分析近期销售数据变化趋势',
  },
  {
    icon: Database,
    label: '数据源概览',
    desc: '查看已连接的数据源状态',
  },
  {
    icon: BarChart3,
    label: '生成报表',
    desc: '自动生成数据分析报表',
  },
  {
    icon: FileSearch,
    label: '数据探索',
    desc: '探索数据集发现洞察',
  },
];

export default function HomePage() {
  const router = useRouter();
  const [inputValue, setInputValue] = useState('');

  const handleSend = (message: string) => {
    if (!message.trim()) return;
    const sessionId = Date.now().toString();
    router.push(`/session/${sessionId}?q=${encodeURIComponent(message)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(inputValue);
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center min-h-screen px-6 -mt-12">
        {/* Hero */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            D
          </div>
          <h1 className="text-2xl font-semibold text-gray-800 mb-3">
            Hola, I&apos;m <span className="text-purple-600">Data Agent</span>
          </h1>
          <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed">
            智能数据分析助手，通过自然语言对话完成数据查询、分析与可视化
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8 w-full max-w-2xl animate-slide-up">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                onClick={() => handleSend(action.label)}
                className="group p-4 bg-white border border-gray-200 rounded-lg hover:border-purple-200 hover:shadow-sm transition-all text-left"
              >
                <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 mb-3 group-hover:bg-purple-100 transition-colors">
                  <Icon size={18} />
                </div>
                <p className="text-sm font-medium text-gray-700 mb-1">{action.label}</p>
                <p className="text-xs text-gray-400 line-clamp-2">{action.desc}</p>
              </button>
            );
          })}
        </div>

        {/* Input Box */}
        <div className="w-full max-w-2xl animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="relative bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="flex items-center px-4 py-3">
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Paperclip size={18} />
              </button>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="输入您的问题，开始数据分析..."
                className="flex-1 px-3 py-2 text-sm text-gray-700 placeholder-gray-400 bg-transparent outline-none"
              />
              <Button
                onClick={() => handleSend(inputValue)}
                disabled={!inputValue.trim()}
                size="sm"
                className="bg-gray-900 hover:bg-gray-800 text-white rounded-lg px-4"
              >
                <Send size={16} />
              </Button>
            </div>
          </div>
          <p className="text-xs text-gray-400 text-center mt-3">
            按 Enter 发送，Shift + Enter 换行
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
