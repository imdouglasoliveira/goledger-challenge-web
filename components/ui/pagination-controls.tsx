'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PaginationControlsProps {
  page: number;
  totalItems: number;
  pageSize: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  className?: string;
  label?: string;
}

export function PaginationControls({
  page,
  totalItems,
  pageSize,
  pageSizeOptions = [10, 20, 30, 50],
  onPageChange,
  onPageSizeChange,
  className,
  label = 'itens',
}: PaginationControlsProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className={cn('flex flex-col gap-3 rounded-lg border border-nf-gray-400/25 bg-nf-card/60 p-3 sm:flex-row sm:items-center sm:justify-between', className)}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
        <p className="text-sm text-nf-gray-100">
          Exibindo <span className="font-semibold text-white">{start}-{end}</span> de{' '}
          <span className="font-semibold text-white">{totalItems}</span> {label}
        </p>

        {onPageSizeChange ? (
          <label className="flex items-center gap-2 text-xs text-nf-gray-200 sm:text-sm">
            Itens por página
            <select
              value={pageSize}
              onChange={(event) => onPageSizeChange(Number(event.target.value))}
              className="rounded-md border border-nf-gray-400/35 bg-nf-surface px-2 py-1 text-sm text-white focus:border-nf-red focus:outline-none focus:ring-1 focus:ring-nf-red"
            >
              {pageSizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        ) : null}
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button
          type="button"
          variant="netflixOutline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </Button>

        <span className="min-w-24 text-center text-sm text-nf-gray-100">
          Página <span className="font-semibold text-white">{currentPage}</span> de{' '}
          <span className="font-semibold text-white">{totalPages}</span>
        </span>

        <Button
          type="button"
          variant="netflixOutline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          Próxima
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
