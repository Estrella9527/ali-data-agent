'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { AppLayout } from '@/components/layout';
import { InputBox } from '@/components/ui';
import {
  Bot,
  User,
  Database,
  CheckCircle2,
  Loader2,
  Copy,
  ThumbsUp,
  ThumbsDown,
  BarChart3,
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sql?: string;
  chart?: boolean;
  steps?: { label: string; status: 'done' | 'loading' | 'pending' }[];
  timestamp: Date;
}

const mockSteps = [
  { label: '理解查询意图', status: 'done' as const },
  { label: '选择数据源: sales_db', status: 'done' as const },
  { label: '生成 SQL 查询', status: 'done' as const },
  { label: '执行查询并分析', status: 'done' as const },
];

export default function SessionPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (initialQuery && messages.length === 0) {
      const userMsg: Message = {
        id: '1',
        role: 'user',
        content: initialQuery,
        timestamp: new Date(),
      };
      setMessages([userMsg]);

      setTimeout(() => {
        const assistantMsg: Message = {
          id: '2',
          role: 'assistant',
          content: `根据您的查询"${initialQuery}"，我已经分析了相关数据。以下是分析结果：\n\n本月销售总额为 ¥2,847,320，较上月增长 12.3%。其中线上渠道占比 68%，线下渠道占比 32%。\n\n销售额排名前三的产品类别为：电子产品（¥1,230,450）、家居用品（¥780,200）、服饰配件（¥520,670）。`,
          sql: 'SELECT category, SUM(amount) as total\nFROM sales\nWHERE date >= DATE_SUB(NOW(), INTERVAL 1 MONTH)\nGROUP BY category\nORDER BY total DESC\nLIMIT 10;',
          chart: true,
          steps: mockSteps,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      }, 1500);
    }
  }, [initialQuery]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (content: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);

    setTimeout(() => {
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `已收到您的问题："${content}"。正在分析中，这是一个模拟的回复。在实际产品中，这里会连接到 NL2SQL 引擎进行智能查询。`,
        steps: [
          { label: '理解查询意图', status: 'done' },
          { label: '选择数据源', status: 'done' },
          { label: '生成查询结果', status: 'done' },
        ],
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    }, 1200);
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-screen">
        {/* Header */}
        <div className="px-6 py-3 border-b border-slate-100 bg-white/80 backdrop-blur-sm">
          <h1 className="text-sm font-medium text-slate-700">
            {initialQuery || '新对话'}
          </h1>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className="animate-fade-in">
              {msg.role === 'user' ? (
                <div className="flex gap-3 justify-end">
                  <div className="max-w-xl bg-indigo-500 text-white px-4 py-3 rounded-2xl rounded-tr-md text-sm">
                    {msg.content}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                    <User size={16} className="text-slate-500" />
                  </div>
                </div>
              ) : (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0">
                    <Bot size={16} className="text-white" />
                  </div>
                  <div className="max-w-2xl space-y-3 flex-1">
                    {/* Steps */}
                    {msg.steps && (
                      <div className="bg-slate-50 rounded-xl p-3 space-y-2">
                        {msg.steps.map((step, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs">
                            {step.status === 'done' ? (
                              <CheckCircle2 size={14} className="text-green-500" />
                            ) : step.status === 'loading' ? (
                              <Loader2 size={14} className="text-indigo-500 animate-spin" />
                            ) : (
                              <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-300" />
                            )}
                            <span className={step.status === 'done' ? 'text-slate-600' : 'text-slate-400'}>
                              {step.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Content */}
                    <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {msg.content}
                    </div>

                    {/* SQL */}
                    {msg.sql && (
                      <div className="bg-slate-900 rounded-xl p-4 overflow-x-auto">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Database size={12} className="text-slate-400" />
                            <span className="text-xs text-slate-400">SQL Query</span>
                          </div>
                          <button className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1">
                            <Copy size={12} />
                            复制
                          </button>
                        </div>
                        <pre className="text-sm text-green-400 font-mono">{msg.sql}</pre>
                      </div>
                    )}

                    {/* Chart placeholder */}
                    {msg.chart && (
                      <div className="bg-white border border-slate-200 rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <BarChart3 size={16} className="text-indigo-500" />
                          <span className="text-sm font-medium text-slate-700">数据可视化</span>
                        </div>
                        <div className="h-48 bg-gradient-to-b from-indigo-50 to-white rounded-lg flex items-end justify-center gap-4 px-8 pb-4">
                          {[65, 85, 45, 72, 90, 58, 78].map((h, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1">
                              <div
                                className="w-full bg-gradient-to-t from-indigo-500 to-purple-400 rounded-t-md transition-all hover:from-indigo-600 hover:to-purple-500"
                                style={{ height: `${h}%` }}
                              />
                              <span className="text-[10px] text-slate-400">{`${i + 1}月`}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                        <Copy size={14} />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                        <ThumbsUp size={14} />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <ThumbsDown size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="px-6 pb-6 pt-2">
          <InputBox onSend={handleSend} />
        </div>
      </div>
    </AppLayout>
  );
}
