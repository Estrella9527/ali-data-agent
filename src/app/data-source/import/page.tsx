'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ArrowLeft,
  Upload,
  Database,
  Server,
  Cloud,
  ChevronRight,
  RefreshCw,
  Plus,
  Search,
  FileText,
  CheckCircle,
} from 'lucide-react';

const connectionTypes = [
  { id: 'upload', name: '本地上传', desc: '支持CSV/Excel文件格式', icon: Upload, disabled: false },
  { id: 'rds', name: 'RDS数据库', desc: 'MySQL, PostgreSQL, SQL Server', icon: Database, disabled: false },
  { id: 'polardb', name: 'PolarDB数据库', desc: 'MySQL', icon: Server, disabled: false },
  { id: 'adb', name: 'AnalyticDB数据库', desc: 'MySQL', icon: Database, disabled: false },
  { id: 'dms', name: 'DMS托管实例', desc: '通过DMS连接MC/Hologres/ClickHouse', icon: Cloud, disabled: true },
];

const dataSources = [
  { id: '1', name: 'internal_data_employees', type: 'file' },
  { id: '2', name: 'sales_2024', type: 'rds' },
  { id: '3', name: 'customer_db', type: 'polardb' },
];

export default function ImportPage() {
  const [selectedType, setSelectedType] = useState('upload');
  const [dragOver, setDragOver] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

  const isFileType = selectedType === 'upload';

  const handleTestConnection = () => {
    setTestStatus('testing');
    setTimeout(() => {
      setTestStatus('success');
    }, 1500);
  };

  return (
    <AppLayout>
      <div className="flex h-screen overflow-hidden">
        {/* Left Panel */}
        <div className="w-[300px] bg-white border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="px-4 py-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database size={14} className="text-gray-500" />
              <span className="text-sm font-semibold text-gray-800">数据中心</span>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400">
                <RefreshCw size={14} />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400">
                <Plus size={14} />
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="px-4 py-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="搜索"
                className="pl-9 bg-gray-50 border-gray-200 h-9 text-sm"
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="px-4 border-b border-gray-200">
            <div className="flex gap-0">
              <button className="flex-1 py-2 text-xs text-gray-800 border-b-2 border-blue-500 font-medium">
                数据源
              </button>
              <button className="flex-1 py-2 text-xs text-gray-400">
                上传的数据
              </button>
            </div>
          </div>

          {/* Data List */}
          <div className="flex-1 overflow-y-auto p-2">
            {dataSources.map((source) => (
              <div
                key={source.id}
                className="px-3 py-2.5 rounded-md text-sm text-gray-600 hover:bg-gray-50 cursor-pointer flex items-center gap-2"
              >
                <FileText size={14} className="text-gray-400" />
                {source.name}
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex-1 overflow-y-auto bg-white">
          <div className="max-w-[900px] mx-auto px-12 py-8">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-5">
              <span className="flex items-center gap-1">
                <Database size={12} />
                数据中心
              </span>
              <ChevronRight size={12} />
              <span>添加数据</span>
            </div>

            {/* Connection Type Selection */}
            <div className="mb-8">
              <h2 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-1">
                <span className="text-red-500">*</span> 添加方式
              </h2>
              <div className="flex gap-3 flex-wrap">
                {connectionTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      onClick={() => !type.disabled && setSelectedType(type.id)}
                      disabled={type.disabled}
                      className={`flex-1 min-w-[160px] p-4 border-2 rounded-lg text-left transition-all flex items-start gap-3 ${
                        type.disabled
                          ? 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-50'
                          : selectedType === type.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                          selectedType === type.id
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300'
                        }`}
                      >
                        {selectedType === type.id && (
                          <div className="w-1.5 h-1.5 bg-white rounded-full" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800 mb-1">{type.name}</p>
                        <p className="text-xs text-gray-400">{type.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Form Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              {isFileType ? (
                <>
                  <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-1">
                    <span className="text-red-500">*</span> 上传文件
                  </h3>
                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => { e.preventDefault(); setDragOver(false); }}
                    className={`border-2 border-dashed rounded-lg p-10 text-center transition-colors cursor-pointer ${
                      dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="w-12 h-12 bg-white rounded-xl mx-auto mb-4 flex items-center justify-center shadow-sm">
                      <Upload size={24} className="text-gray-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-800 mb-1">
                      点击或将文件拖拽至此上传
                    </p>
                    <p className="text-xs text-gray-400">
                      支持xlsx、xls、csv格式，文件最大200MB
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-1">
                    <span className="text-red-500">*</span> 数据库连接
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                        主机地址 <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        placeholder="例如: db.example.com"
                        className="h-9 text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-2">
                        <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                          数据库名 <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="text"
                          placeholder="数据库名"
                          className="h-9 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                          端口 <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="text"
                          defaultValue="3306"
                          className="h-9 text-sm"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                          用户名 <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="text"
                          placeholder="数据库用户名"
                          className="h-9 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                          密码 <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="password"
                          placeholder="数据库密码"
                          className="h-9 text-sm"
                        />
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleTestConnection}
                      disabled={testStatus === 'testing'}
                      className="gap-2"
                    >
                      <Database size={14} />
                      {testStatus === 'testing' ? '测试中...' : '测试连接'}
                    </Button>
                    {testStatus === 'success' && (
                      <div className="flex items-center gap-2 p-3 bg-green-50 rounded-md text-sm text-green-700">
                        <CheckCircle size={14} />
                        连接成功！
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
              <Link href="/data-source">
                <Button variant="outline" size="sm">
                  取消
                </Button>
              </Link>
              <Button size="sm" className="bg-gray-900 hover:bg-gray-800">
                确认
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
