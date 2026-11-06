import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  header,
  footer,
  hoverEffect = false,
  ...props
}) => {
  return (
    <div
      className={`bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden transition-all ${
        hoverEffect ? 'hover:border-slate-300 hover:shadow-sm' : ''
      } ${className}`}
      {...props}
    >
      {header && <div className="px-5 py-4 border-b border-slate-100">{header}</div>}
      <div className="p-5">{children}</div>
      {footer && <div className="px-5 py-3 bg-slate-50 border-t border-slate-100">{footer}</div>}
    </div>
  );
};
