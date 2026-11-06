import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  size?: 'sm' | 'md';
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
  dot = false,
}) => {
  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  const variantStyles = {
    success: 'bg-emerald-50 text-emerald-800 border border-emerald-200/60',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200/60',
    danger: 'bg-red-50 text-red-800 border border-red-200/60',
    info: 'bg-sky-50 text-sky-800 border border-sky-200/60',
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200',
  };

  const dotColors = {
    success: 'bg-emerald-600',
    warning: 'bg-amber-600',
    danger: 'bg-red-600',
    info: 'bg-sky-600',
    neutral: 'bg-slate-500',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-md whitespace-nowrap ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColors[variant]}`} />}
      <span>{children}</span>
    </span>
  );
};
