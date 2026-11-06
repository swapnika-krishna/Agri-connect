import React from 'react';

export interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  action,
  breadcrumbs,
}) => {
  return (
    <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-200/60">
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
            {breadcrumbs.map((b, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span className="text-slate-400">/</span>}
                {b.href ? (
                  <a href={b.href} className="hover:text-slate-900 transition-colors">
                    {b.label}
                  </a>
                ) : (
                  <span className="text-slate-700 font-medium">{b.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
        {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
      </div>
      {action && <div className="flex items-center gap-2 shrink-0">{action}</div>}
    </div>
  );
};
