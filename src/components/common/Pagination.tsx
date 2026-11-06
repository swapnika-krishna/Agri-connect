import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  pageSize?: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize,
}) => {
  if (totalPages <= 1) return null;

  const startItem = pageSize ? (currentPage - 1) * pageSize + 1 : undefined;
  const endItem = pageSize && totalItems ? Math.min(currentPage * pageSize, totalItems) : undefined;

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-slate-200 text-xs text-slate-600 sm:px-6">
      <div className="hidden sm:block">
        {totalItems !== undefined && startItem !== undefined && endItem !== undefined ? (
          <p className="tabular-nums">
            Showing <span className="font-semibold text-slate-800">{startItem}</span> to{' '}
            <span className="font-semibold text-slate-800">{endItem}</span> of{' '}
            <span className="font-semibold text-slate-800">{totalItems}</span> results
          </p>
        ) : (
          <p className="tabular-nums">
            Page {currentPage} of {totalPages}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2 ml-auto">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-slate-300 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Previous</span>
        </button>
        <span className="text-xs text-slate-600 px-2 tabular-nums">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-slate-300 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <span>Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
