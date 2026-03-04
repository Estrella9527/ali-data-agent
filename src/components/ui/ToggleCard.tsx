'use client';

import { useState } from 'react';

interface ToggleCardProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  defaultEnabled?: boolean;
  onChange?: (enabled: boolean) => void;
}

export default function ToggleCard({
  title,
  description,
  icon,
  defaultEnabled = false,
  onChange,
}: ToggleCardProps) {
  const [enabled, setEnabled] = useState(defaultEnabled);

  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    onChange?.(next);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          {icon && (
            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0">
              {icon}
            </div>
          )}
          <div className="flex-1">
            <h3 className="text-sm font-medium text-slate-800">{title}</h3>
            {description && (
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{description}</p>
            )}
          </div>
        </div>
        <button
          onClick={toggle}
          className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
            enabled ? 'bg-indigo-500' : 'bg-slate-200'
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
              enabled ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
    </div>
  );
}
