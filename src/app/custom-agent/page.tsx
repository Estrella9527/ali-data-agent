'use client';

import Link from 'next/link';
import { AppLayout } from '@/components/layout';
import { Bot, Plus, FolderOpen } from 'lucide-react';

export default function CustomAgentPage() {
  return (
    <AppLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl font-semibold text-slate-800">自定义 Agent</h1>
            <p className="text-sm text-slate-500 mt-1">创建和管理专属数据分析 Agent</p>
          </div>
          <Link
            href="/custom-agent/create"
            className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white text-sm rounded-lg hover:bg-indigo-600 transition-colors"
          >
            <Plus size={16} />
            创建 Agent
          </Link>
        </div>

        {/* Empty State */}
        <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-slate-50 flex items-center justify-center">
            <FolderOpen size={36} className="text-slate-300" />
          </div>
          <h3 className="text-lg font-medium text-slate-700 mb-2">暂无自定义 Agent</h3>
          <p className="text-sm text-slate-400 mb-6 max-w-sm mx-auto">
            创建专属 Agent，定制数据分析流程和专业领域知识，提升分析效率
          </p>
          <Link
            href="/custom-agent/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-500 text-white text-sm rounded-lg hover:bg-indigo-600 transition-colors"
          >
            <Bot size={16} />
            创建第一个 Agent
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}
