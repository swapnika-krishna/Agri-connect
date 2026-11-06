import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'amber';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 whitespace-nowrap shrink-0 disabled:opacity-50 disabled:cursor-not-allowed';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs focus-visible:ring-emerald-500',
    secondary:
      'bg-slate-100 hover:bg-slate-200 text-slate-800 focus-visible:ring-slate-400',
    outline:
      'border border-slate-300 hover:bg-slate-50 text-slate-700 focus-visible:ring-slate-400',
    danger:
      'bg-red-600 hover:bg-red-700 text-white shadow-xs focus-visible:ring-red-500',
    ghost:
      'text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus-visible:ring-slate-400',
    amber:
      'bg-amber-600 hover:bg-amber-700 text-white shadow-xs focus-visible:ring-amber-500',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};
