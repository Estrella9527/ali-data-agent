'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
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
          <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold shadow-lg">
            D
          </div>
          <h1 className="text-2xl font-semibold text-foreground mb-3">
            Hola, I&apos;m <span className="text-primary">Data Agent</span>
          </h1>
          <p className="text-muted-foreground text-sm max-w-md mx-auto leading-relaxed">
            智能数据分析助手，通过自然语言对话完成数据查询、分析与可视化
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8 w-full max-w-2xl animate-slide-up">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Card
                key={action.label}
                onClick={() => handleSend(action.label)}
                className="group p-4 cursor-pointer hover:border-primary/50 hover:shadow-sm transition-all text-left"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-3 group-hover:bg-primary/20 transition-colors">
                  <Icon size={18} />
                </div>
                <p className="text-sm font-medium text-foreground mb-1">{action.label}</p>
                <p className="text-xs text-muted-foreground line-clamp-2">{action.desc}</p>
              </Card>
            );
          })}
        </div>

        {/* Input Box */}
        <div className="w-full max-w-2xl animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <Card className="shadow-sm">
            <div className="flex items-center px-4 py-3">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <Paperclip size={18} />
              </Button>
              <Input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="输入您的问题，开始数据分析..."
                className="flex-1 border-0 shadow-none focus-visible:ring-0 px-3"
              />
              <Button
                onClick={() => handleSend(inputValue)}
                disabled={!inputValue.trim()}
                size="sm"
                className="rounded-lg px-4"
              >
                <Send size={16} />
              </Button>
            </div>
          </Card>
          <p className="text-xs text-muted-foreground text-center mt-3">
            按 Enter 发送，Shift + Enter 换行
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
