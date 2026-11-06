import React from 'react';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  onClick?: () => void;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  onClick,
  className = '',
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs transition-all ${
        onClick ? 'cursor-pointer hover:border-slate-300 hover:shadow-sm' : ''
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</p>
          <div className="text-2xl font-bold text-slate-900 tracking-tight tabular-nums">
            {value}
          </div>
          {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
        </div>
        {icon && (
          <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-700 shrink-0">
            {icon}
          </div>
        )}
      </div>
      {trend && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center text-xs text-slate-500">
          <span
            className={`font-medium ${
              trend.isPositive ? 'text-emerald-700' : 'text-slate-600'
            } mr-1.5`}
          >
            {trend.value}
          </span>
          <span>vs previous cycle</span>
        </div>
      )}
    </div>
  );
};
