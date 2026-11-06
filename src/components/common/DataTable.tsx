import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T, index: number) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  className?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T, index: number) => string;
  onRowClick?: (item: T) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (columnKey: string) => void;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  isLoading = false,
  emptyMessage = 'No records found',
  sortColumn,
  sortDirection,
  onSort,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="w-full border border-slate-200/80 rounded-xl overflow-hidden bg-white">
        <div className="p-8 text-center text-slate-500 text-sm">
          <div className="inline-block w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mb-2" />
          <p>Loading table data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full border border-slate-200/80 rounded-xl overflow-hidden bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/75 text-xs font-semibold text-slate-600 uppercase tracking-wider">
              {columns.map((col, idx) => {
                const isSorted = col.accessorKey && sortColumn === String(col.accessorKey);
                const alignClass =
                  col.align === 'right'
                    ? 'text-right'
                    : col.align === 'center'
                    ? 'text-center'
                    : 'text-left';

                return (
                  <th
                    key={idx}
                    className={`px-4 py-3 whitespace-nowrap ${alignClass} ${col.className || ''}`}
                  >
                    {col.sortable && col.accessorKey && onSort ? (
                      <button
                        onClick={() => onSort(String(col.accessorKey))}
                        className="inline-flex items-center gap-1 hover:text-slate-900 transition-colors uppercase font-semibold text-xs"
                      >
                        <span>{col.header}</span>
                        {isSorted ? (
                          sortDirection === 'asc' ? (
                            <ArrowUp className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <ArrowDown className="w-3.5 h-3.5 text-emerald-600" />
                          )
                        ) : (
                          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 opacity-60" />
                        )}
                      </button>
                    ) : (
                      <span>{col.header}</span>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-sm text-slate-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item, rowIdx) => (
                <tr
                  key={keyExtractor(item, rowIdx)}
                  onClick={() => onRowClick && onRowClick(item)}
                  className={`transition-colors ${
                    onRowClick ? 'cursor-pointer hover:bg-slate-50/80' : 'hover:bg-slate-50/40'
                  }`}
                >
                  {columns.map((col, colIdx) => {
                    const alignClass =
                      col.align === 'right'
                        ? 'text-right'
                        : col.align === 'center'
                        ? 'text-center'
                        : 'text-left';

                    const content = col.cell
                      ? col.cell(item, rowIdx)
                      : col.accessorKey
                      ? (item[col.accessorKey] as unknown as React.ReactNode)
                      : null;

                    return (
                      <td
                        key={colIdx}
                        className={`px-4 py-3 text-slate-700 whitespace-nowrap ${alignClass} ${
                          col.align === 'right' ? 'tabular-nums' : ''
                        } ${col.className || ''}`}
                      >
                        {content}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
