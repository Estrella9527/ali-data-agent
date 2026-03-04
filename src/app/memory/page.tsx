'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Search,
  Trash2,
  RefreshCw,
  Pencil,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  Info,
  ArrowUpDown,
} from 'lucide-react';

const memoryData = [
  {
    id: 'MEM-001',
    source: '自动生成',
    content: '用户经常分析电商渠道的 GMV 和转化率数据，偏好使用柱状图和折线图',
    heat: 92,
    status: '生效中',
    created: '2026-02-12',
    modified: '2026-02-12',
  },
  {
    id: 'MEM-002',
    source: '自动生成',
    content: '数据库 sales_db 中 orders 表的 total_amount 字段单位为分',
    heat: 85,
    status: '生效中',
    created: '2026-02-11',
    modified: '2026-02-12',
  },
  {
    id: 'MEM-003',
    source: '用户确认',
    content: '公司的财年起始月份为 4 月，Q1 为 4-6 月，Q2 为 7-9 月',
    heat: 78,
    status: '生效中',
    created: '2026-02-10',
    modified: '2026-02-10',
  },
  {
    id: 'MEM-004',
    source: '自动生成',
    content: '用户偏好在分析报告中包含：核心指标卡片（3-4个KPI）、趋势图表',
    heat: 65,
    status: '生效中',
    created: '2026-02-09',
    modified: '2026-02-11',
  },
  {
    id: 'MEM-005',
    source: '自动生成',
    content: 'customer_segments 表中 segment_name 为 "VIP" 的客户是指近 12 个月消费金额超过 50000 元',
    heat: 45,
    status: '生效中',
    created: '2026-02-08',
    modified: '2026-02-08',
  },
  {
    id: 'MEM-006',
    source: '自动生成',
    content: '分析结果导出时，用户习惯使用 Excel 格式，并要求包含数据源表名',
    heat: 38,
    status: '已停用',
    created: '2026-02-05',
    modified: '2026-02-07',
  },
  {
    id: 'MEM-007',
    source: '用户手动',
    content: '华东区域包含：上海、江苏、浙江、安徽、山东。华南区域包含：广东、广西',
    heat: 55,
    status: '生效中',
    created: '2026-02-04',
    modified: '2026-02-04',
  },
  {
    id: 'MEM-008',
    source: '自动生成',
    content: '当分析涉及用户画像时，需要关联 customer_profiles 表进行分群分析',
    heat: 30,
    status: '生效中',
    created: '2026-02-02',
    modified: '2026-02-02',
  },
  {
    id: 'MEM-009',
    source: '自动生成',
    content: '旧版本的促销活动数据在 legacy_promotions 表中，2025 年 6 月以前的数据',
    heat: 12,
    status: '已停用',
    created: '2026-01-28',
    modified: '2026-01-28',
  },
];

export default function MemoryPage() {
  const [generateMemory, setGenerateMemory] = useState(true);
  const [useMemory, setUseMemory] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = memoryData.filter(
    (item) =>
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSourceBadgeStyle = (source: string) => {
    switch (source) {
      case '自动生成':
        return 'bg-blue-50 text-blue-600 hover:bg-blue-50';
      case '用户确认':
        return 'bg-purple-50 text-purple-600 hover:bg-purple-50';
      case '用户手动':
        return 'bg-green-50 text-green-600 hover:bg-green-50';
      default:
        return 'bg-gray-50 text-gray-600';
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    return status === '生效中'
      ? 'bg-green-50 text-green-600 hover:bg-green-50'
      : 'bg-gray-100 text-gray-500 hover:bg-gray-100';
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-screen bg-gray-50">
        {/* Header */}
        <div className="px-10 py-7 bg-white border-b border-gray-200 flex items-center gap-3">
          <ClipboardList size={20} className="text-gray-600" />
          <h1 className="text-xl font-semibold text-gray-800">记忆管理</h1>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-10 py-8">
          {/* Toggle Cards */}
          <div className="grid grid-cols-2 gap-5 mb-8">
            <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-xl">
                  <ClipboardList size={24} className="text-gray-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-800 mb-1">生成记忆</h3>
                  <p className="text-xs text-gray-400">让Data Agent自主判断生成记忆</p>
                </div>
              </div>
              <Switch
                checked={generateMemory}
                onCheckedChange={setGenerateMemory}
                className="data-[state=checked]:bg-gray-900"
              />
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-xl">
                  <ClipboardList size={24} className="text-gray-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-800 mb-1">使用记忆</h3>
                  <p className="text-xs text-gray-400">让Data Agent 在回复时使用相关记忆</p>
                </div>
              </div>
              <Switch
                checked={useMemory}
                onCheckedChange={setUseMemory}
                className="data-[state=checked]:bg-gray-900"
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mb-5">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="搜索..."
                className="w-72 pl-9 bg-white border-gray-200 h-9 text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1.5 text-gray-600">
                <Trash2 size={14} />
                删除
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5 text-gray-600">
                <RefreshCw size={14} />
                刷新
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 border-b border-gray-200">
                  <TableHead className="w-10">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    记忆ID
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    来源
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    内容
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    <span className="flex items-center gap-1">
                      热度 <Info size={10} /> <ArrowUpDown size={10} />
                    </span>
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    状态
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    <span className="flex items-center gap-1">
                      创建时间 <ArrowUpDown size={10} />
                    </span>
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    修改时间
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-gray-400 uppercase tracking-wide text-right">
                    操作
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item) => (
                  <TableRow key={item.id} className="hover:bg-gray-50 border-b border-gray-100">
                    <TableCell>
                      <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                    </TableCell>
                    <TableCell className="text-xs text-gray-500 font-mono">{item.id}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={getSourceBadgeStyle(item.source)}>
                        {item.source}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600 max-w-[250px] truncate">
                      {item.content}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-purple-600 rounded-full"
                            style={{ width: `${item.heat}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-400 w-6">{item.heat}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={getStatusBadgeStyle(item.status)}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">{item.created}</TableCell>
                    <TableCell className="text-sm text-gray-500">{item.modified}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-gray-600">
                          <Pencil size={14} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-red-500">
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-xs text-gray-400">
              <span>
                共 <strong className="text-gray-600">{filteredData.length}</strong> 条记忆
              </span>
              <div className="flex items-center gap-2">
                <span>每页展示 <strong className="text-gray-600">10</strong> 行</span>
                <Button variant="outline" size="icon" className="h-6 w-6">
                  <ChevronLeft size={12} />
                </Button>
                <Button variant="outline" size="icon" className="h-6 w-6 bg-purple-600 text-white border-purple-600">
                  1
                </Button>
                <Button variant="outline" size="icon" className="h-6 w-6">
                  <ChevronRight size={12} />
                </Button>
                <span>1/1</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
