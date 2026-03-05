'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Plus,
  Search,
  RefreshCw,
  Trash2,
  FileText,
  ChevronRight,
  Database,
  Table2,
} from 'lucide-react';

const dataSources = [
  { id: '1', name: 'internal_data_employees', type: 'RDS', isBuiltin: true },
  { id: '2', name: 'demo_sales_data', type: 'RDS', isBuiltin: false },
  { id: '3', name: 'game_analytics_db', type: 'PostgreSQL', isBuiltin: false },
];

const tableList = [
  { name: 'departments', desc: 'Department information and structure', created: '2025-01-01' },
  { name: 'dept_emp', desc: 'Department-Employee relationships', created: '2025-01-01' },
  { name: 'dept_manager', desc: 'Department manager assignments', created: '2025-01-01' },
  { name: 'employees', desc: 'Employee personal and contact information', created: '2025-01-01' },
  { name: 'salaries', desc: 'Employee salary and compensation data', created: '2025-01-01' },
  { name: 'titles', desc: 'Employee job titles and history', created: '2025-01-01' },
];

const sourceDetail = {
  id: '6fyoqbd8tz4kpu21vtg5f5oj6',
  type: 'RDS',
  isBuiltin: true,
  created: '2025-01-01 00:00:00',
  instance: 'rm-bp1mqg0qh508l42dy',
  description: 'This is a comprehensive employee database containing detailed information about all company personnel. It includes employee profiles, salary information, departmental assignments, and management hierarchies. The database is regularly synchronized to ensure data accuracy and consistency across the organization.',
};

export default function DataSourcePage() {
  const [selected, setSelected] = useState('1');
  const [searchTerm, setSearchTerm] = useState('');
  const [tableSearch, setTableSearch] = useState('');
  const [activeTab, setActiveTab] = useState('sources');

  const current = dataSources.find((d) => d.id === selected);

  return (
    <AppLayout>
      <div className="flex h-screen overflow-hidden">
        {/* Left Panel - Source List */}
        <div className="w-[370px] bg-card border-r border-border flex flex-col">
          {/* Header */}
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">数据中心</h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8">
                <RefreshCw size={14} />
              </Button>
              <Link href="/data-source/import">
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <Plus size={14} />
                </Button>
              </Link>
            </div>
          </div>

          {/* Search */}
          <div className="px-5 py-4 border-b border-border">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="搜索"
                className="pl-9 h-9 text-sm"
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="px-5 border-b border-border">
            <div className="flex gap-5">
              <button
                onClick={() => setActiveTab('sources')}
                className={`py-3 text-sm border-b-2 transition-colors ${
                  activeTab === 'sources'
                    ? 'text-primary border-primary font-medium'
                    : 'text-muted-foreground border-transparent hover:text-foreground'
                }`}
              >
                数据源
              </button>
              <button
                onClick={() => setActiveTab('uploads')}
                className={`py-3 text-sm border-b-2 transition-colors ${
                  activeTab === 'uploads'
                    ? 'text-primary border-primary font-medium'
                    : 'text-muted-foreground border-transparent hover:text-foreground'
                }`}
              >
                上传的数据
              </button>
            </div>
          </div>

          {/* Data Source List */}
          <div className="flex-1 overflow-y-auto">
            {dataSources
              .filter((d) => d.name.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((ds) => (
                <button
                  key={ds.id}
                  onClick={() => setSelected(ds.id)}
                  className={`w-full px-5 py-3 text-left border-b border-border/50 transition-colors flex items-center gap-2 ${
                    selected === ds.id
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  <FileText size={14} />
                  <span className="text-sm">{ds.name}</span>
                </button>
              ))}
          </div>
        </div>

        {/* Right Panel - Detail */}
        <div className="flex-1 bg-card overflow-y-auto">
          {current ? (
            <div className="flex flex-col h-full">
              {/* Detail Header */}
              <div className="px-5 py-5 border-b border-border">
                {/* Breadcrumb */}
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                  <button className="text-primary hover:underline">数据中心</button>
                  <ChevronRight size={12} />
                  <span className="flex items-center gap-1">
                    <FileText size={12} />
                    {current.name}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <FileText size={20} />
                  {current.name}
                </h1>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Button variant="outline" size="sm" className="text-destructive border-destructive/30 hover:bg-destructive/10 gap-1">
                    <Trash2 size={14} />
                    删除
                  </Button>
                  <Button variant="outline" size="sm">
                    同步知识库
                  </Button>
                  <Button size="sm" className="gap-1">
                    <Plus size={14} />
                    去分析
                  </Button>
                </div>
              </div>

              {/* About Section */}
              <div className="px-5 py-5 border-b border-border">
                <h3 className="text-sm font-semibold text-foreground mb-4">关于此库</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">ID</p>
                    <p className="text-xs text-foreground font-mono">{sourceDetail.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">数据源类型</p>
                    <div className="flex gap-2">
                      <Badge variant="secondary">
                        {current.type}
                      </Badge>
                      {current.isBuiltin && (
                        <Badge variant="default">
                          内置数据
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">创建时间</p>
                    <p className="text-xs text-foreground font-mono">{sourceDetail.created}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">所属实例</p>
                    <p className="text-xs text-foreground font-mono">{sourceDetail.instance}</p>
                  </div>
                </div>
              </div>

              {/* Description Section */}
              <div className="px-5 py-5 border-b border-border">
                <h3 className="text-sm font-semibold text-foreground mb-4">描述</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {sourceDetail.description}
                </p>
              </div>

              {/* Tables Section */}
              <div className="px-5 py-5 flex-1 overflow-hidden flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-foreground">
                    表 ({tableList.length})
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Input
                        type="text"
                        value={tableSearch}
                        onChange={(e) => setTableSearch(e.target.value)}
                        placeholder="搜索表名..."
                        className="w-48 h-8 text-sm pl-3"
                      />
                    </div>
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <RefreshCw size={14} />
                    </Button>
                  </div>
                </div>

                <Card className="flex-1 overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="text-xs font-semibold text-muted-foreground">名称</TableHead>
                        <TableHead className="text-xs font-semibold text-muted-foreground">描述</TableHead>
                        <TableHead className="text-xs font-semibold text-muted-foreground">创建时间</TableHead>
                        <TableHead className="text-xs font-semibold text-muted-foreground text-right">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tableList
                        .filter((t) => t.name.toLowerCase().includes(tableSearch.toLowerCase()))
                        .map((table) => (
                          <TableRow key={table.name} className="hover:bg-muted/50">
                            <TableCell className="text-sm text-foreground">
                              <span className="flex items-center gap-2">
                                <Table2 size={14} className="text-muted-foreground" />
                                {table.name}
                              </span>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">{table.desc}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">{table.created}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                                删除
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </Card>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
                <Database size={32} className="text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                请点击添加数据新增数据，从点击左侧已有数据源查看
              </p>
              <Link href="/data-source/import">
                <Button>
                  添加数据
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
