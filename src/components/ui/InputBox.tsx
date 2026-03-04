'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import { Send, Paperclip, Mic } from 'lucide-react';

interface InputBoxProps {
  onSend?: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function InputBox({
  onSend,
  placeholder = '输入你的数据分析问题...',
  disabled = false,
}: InputBoxProps) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (!value.trim() || disabled) return;
    onSend?.(value.trim());
    setValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 160) + 'px';
    }
  };

  return (
    <div className="relative bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-end gap-2 p-3">
        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
          <Paperclip size={18} />
        </button>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className="flex-1 resize-none outline-none text-sm text-slate-700 placeholder:text-slate-400 max-h-40 py-2"
        />
        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
          <Mic size={18} />
        </button>
        <button
          onClick={handleSend}
          disabled={!value.trim() || disabled}
          className={`p-2 rounded-lg transition-all ${
            value.trim() && !disabled
              ? 'bg-indigo-500 text-white hover:bg-indigo-600 shadow-sm'
              : 'bg-slate-100 text-slate-300 cursor-not-allowed'
          }`}
        >
          <Send size={18} />
        </button>
      </div>
      <div className="px-4 pb-2 flex items-center gap-3 text-xs text-slate-400">
        <span>支持自然语言查询</span>
        <span>·</span>
        <span>Shift+Enter 换行</span>
      </div>
    </div>
  );
}
