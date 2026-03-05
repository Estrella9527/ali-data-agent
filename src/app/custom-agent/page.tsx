'use client';

import Link from 'next/link';
import { AppLayout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Bot, Plus, FolderOpen } from 'lucide-react';

export default function CustomAgentPage() {
  return (
    <AppLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl font-semibold text-foreground">自定义 Agent</h1>
            <p className="text-sm text-muted-foreground mt-1">创建和管理专属数据分析 Agent</p>
          </div>
          <Link href="/custom-agent/create">
            <Button className="gap-2">
              <Plus size={16} />
              创建 Agent
            </Button>
          </Link>
        </div>

        {/* Empty State */}
        <Card className="p-16 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-muted flex items-center justify-center">
            <FolderOpen size={36} className="text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">暂无自定义 Agent</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
            创建专属 Agent，定制数据分析流程和专业领域知识，提升分析效率
          </p>
          <Link href="/custom-agent/create">
            <Button className="gap-2">
              <Bot size={16} />
              创建第一个 Agent
            </Button>
          </Link>
        </Card>
      </div>
    </AppLayout>
  );
}
