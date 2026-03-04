'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeft,
  ChevronUp,
  ChevronDown,
  Save,
  Wrench,
  FileText,
} from 'lucide-react';

interface SectionProps {
  title: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function Section({ title, expanded, onToggle, children }: SectionProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg mb-4 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-200"
      >
        <span className="text-sm font-semibold text-gray-800 flex items-center gap-2">
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {title}
        </span>
      </button>
      {expanded && <div className="p-4">{children}</div>}
    </div>
  );
}

interface ToggleCardProps {
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function ToggleCard({ title, description, checked, onChange }: ToggleCardProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
      <div>
        <p className="text-sm font-medium text-gray-700">{title}</p>
        {description && <p className="text-xs text-gray-400">{description}</p>}
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onChange}
        className="data-[state=checked]:bg-indigo-500"
      />
    </div>
  );
}

export default function CreateAgentPage() {
  const [basicExpanded, setBasicExpanded] = useState(true);
  const [contextExpanded, setContextExpanded] = useState(true);
  const [moreExpanded, setMoreExpanded] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [dataRangeEnabled, setDataRangeEnabled] = useState(false);
  const [instruction, setInstruction] = useState('');
  const [knowledge, setKnowledge] = useState('');
  const [mcpEnabled, setMcpEnabled] = useState(false);
  const [textReportEnabled, setTextReportEnabled] = useState(false);
  const [webReportEnabled, setWebReportEnabled] = useState(false);

  const [activeNav, setActiveNav] = useState('basic');

  return (
    <AppLayout>
      <div className="flex flex-col h-screen bg-white">
        {/* Header */}
        <div className="h-14 bg-white border-b border-gray-200 flex items-center px-6 gap-4 shrink-0">
          <Link href="/custom-agent">
            <Button variant="ghost" size="icon" className="text-gray-500">
              <ArrowLeft size={18} />
            </Button>
          </Link>
          <div>
            <h1 className="text-sm font-semibold text-gray-800">创建自定义Agent</h1>
            <p className="text-xs text-gray-400">自定义Agent &gt; 创建自定义Agent</p>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Form Area */}
          <div className="flex-1 overflow-y-auto py-6">
            <div className="max-w-[680px] mx-auto px-6">
              {/* Section 1: 基本信息 */}
              <Section
                title="基本信息"
                expanded={basicExpanded}
                onToggle={() => setBasicExpanded(!basicExpanded)}
              >
                {/* 名称 */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-medium text-gray-700">
                      名称 <span className="text-red-500">*</span>
                    </label>
                    <span className={`text-xs ${name.length > 18 ? 'text-red-500' : 'text-gray-400'}`}>
                      {name.length}/20
                    </span>
                  </div>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value.slice(0, 20))}
                    placeholder="请输入自定义Agent名称"
                    className="h-9 text-sm"
                  />
                </div>

                {/* 描述 */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-medium text-gray-700">描述</label>
                    <span className="text-xs text-gray-400">{description.length}/100</span>
                  </div>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value.slice(0, 100))}
                    placeholder="请输入自定义Agent描述"
                    className="h-16 text-sm resize-none"
                  />
                </div>

                {/* 周期运行 */}
                <ToggleCard
                  title="周期运行"
                  description="开启后任务将定时运行"
                  checked={scheduleEnabled}
                  onChange={setScheduleEnabled}
                />
              </Section>

              {/* Section 2: 上下文 */}
              <Section
                title="上下文"
                expanded={contextExpanded}
                onToggle={() => setContextExpanded(!contextExpanded)}
              >
                {/* 选择数据范围 */}
                <ToggleCard
                  title="选择数据范围"
                  description="使用自定义Agent时，仅可使用指定的数据，不可二次选择"
                  checked={dataRangeEnabled}
                  onChange={setDataRangeEnabled}
                />

                {/* 指示 */}
                <div className="mt-4 mb-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-medium text-gray-700">指示</label>
                    <span className="text-xs text-gray-400">{instruction.length}/10000</span>
                  </div>
                  <Textarea
                    value={instruction}
                    onChange={(e) => setInstruction(e.target.value.slice(0, 10000))}
                    placeholder="请输入分析框架和基本指示，如：以SWOT分析框架评估业务现状；关键指标包括月度营收、用户留存率、成本控制率；所有数值保留2位小数；按月度环比和年度同比双向分析；输出结构：现状分析→趋势判断→建议清单"
                    className="h-28 text-sm resize-none font-mono"
                  />
                </div>

                {/* 知识 */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-medium text-gray-700">知识</label>
                    <span className="text-xs text-gray-400">{knowledge.length}/10000</span>
                  </div>
                  <Textarea
                    value={knowledge}
                    onChange={(e) => setKnowledge(e.target.value.slice(0, 10000))}
                    placeholder="补充业务知识和上下文，如：公司财年从4月开始；VIP客户定义为年消费超过5万元；华东区域包含上海、江苏、浙江三省市；产品线包括标准版、专业版、企业版三种"
                    className="h-24 text-sm resize-none font-mono"
                  />
                </div>

                {/* 补充外部知识 */}
                <ToggleCard
                  title="补充外部知识"
                  description="开启后支持以MCP方式接入外部知识库"
                  checked={mcpEnabled}
                  onChange={setMcpEnabled}
                />
              </Section>

              {/* Section 3: 更多配置 */}
              <Section
                title="更多配置"
                expanded={moreExpanded}
                onToggle={() => setMoreExpanded(!moreExpanded)}
              >
                {/* 定制文字报告 */}
                <ToggleCard
                  title="定制文字报告"
                  description=""
                  checked={textReportEnabled}
                  onChange={setTextReportEnabled}
                />

                {/* 定制网页报告 */}
                <ToggleCard
                  title="定制网页报告"
                  description=""
                  checked={webReportEnabled}
                  onChange={setWebReportEnabled}
                />

                {/* 执行计划 */}
                <div className="mt-4 mb-4">
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">执行计划</label>
                  <Select defaultValue="confirm">
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue placeholder="选择执行方式" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="confirm">需要确认</SelectItem>
                      <SelectItem value="auto">自动执行</SelectItem>
                      <SelectItem value="skip">跳过</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 执行查询SQL */}
                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">执行查询SQL</label>
                  <Select defaultValue="confirm">
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue placeholder="选择执行方式" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="confirm">需要确认</SelectItem>
                      <SelectItem value="auto">自动执行</SelectItem>
                      <SelectItem value="skip">跳过</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 输出网页报告 */}
                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">输出网页报告</label>
                  <Select defaultValue="confirm">
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue placeholder="选择执行方式" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="confirm">需要确认</SelectItem>
                      <SelectItem value="auto">自动执行</SelectItem>
                      <SelectItem value="skip">跳过</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 过程询问 */}
                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">过程询问</label>
                  <Select defaultValue="confirm">
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue placeholder="选择执行方式" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="confirm">需要确认</SelectItem>
                      <SelectItem value="auto">自动执行</SelectItem>
                      <SelectItem value="skip">跳过</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </Section>

              {/* Spacer */}
              <div className="h-20" />
            </div>
          </div>

          {/* Right Navigation */}
          <div className="w-[150px] border-l border-gray-200 py-6 px-3 shrink-0">
            <div className="sticky top-6">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-3 px-2">
                页面导航
              </p>
              <div className="space-y-0.5">
                <button
                  onClick={() => {
                    setActiveNav('basic');
                    setBasicExpanded(true);
                  }}
                  className={`w-full text-left px-2 py-2 text-xs rounded transition-colors border-l-2 ${
                    activeNav === 'basic'
                      ? 'text-indigo-600 bg-indigo-50 border-l-indigo-500 font-medium'
                      : 'text-gray-500 hover:bg-gray-50 border-l-transparent'
                  }`}
                >
                  1 基本信息
                </button>
                <button
                  onClick={() => {
                    setActiveNav('context');
                    setContextExpanded(true);
                  }}
                  className={`w-full text-left px-2 py-2 text-xs rounded transition-colors border-l-2 ${
                    activeNav === 'context'
                      ? 'text-indigo-600 bg-indigo-50 border-l-indigo-500 font-medium'
                      : 'text-gray-500 hover:bg-gray-50 border-l-transparent'
                  }`}
                >
                  2 上下文
                </button>
                <button
                  onClick={() => {
                    setActiveNav('more');
                    setMoreExpanded(true);
                  }}
                  className={`w-full text-left px-2 py-2 text-xs rounded transition-colors border-l-2 ${
                    activeNav === 'more'
                      ? 'text-indigo-600 bg-indigo-50 border-l-indigo-500 font-medium'
                      : 'text-gray-500 hover:bg-gray-50 border-l-transparent'
                  }`}
                >
                  3 更多配置
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="h-14 bg-white border-t border-gray-200 flex items-center justify-between px-6 shrink-0">
          <Link href="/custom-agent">
            <Button variant="outline" size="sm" className="gap-1.5">
              <ArrowLeft size={14} />
              取消
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Save size={14} />
              保存
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Wrench size={14} />
              调试
            </Button>
            <Button size="sm" className="gap-1.5 bg-indigo-500 hover:bg-indigo-600">
              <FileText size={14} />
              发布
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
