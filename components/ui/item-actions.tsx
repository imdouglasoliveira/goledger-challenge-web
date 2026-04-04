'use client';

import { Pencil, Trash2 } from 'lucide-react';

interface ItemActionsProps {
  onEdit: () => void;
  onDelete: () => void;
  editLabel: string;
  deleteLabel: string;
}

export function ItemActions({ onEdit, onDelete, editLabel, deleteLabel }: ItemActionsProps) {
  return (
    <div className="flex items-center justify-end gap-2">
      <button
        type="button"
        onClick={onEdit}
        className="touch-target-exempt inline-flex h-8 w-8 items-center justify-center rounded-md border border-nf-gray-400/40 text-nf-gray-100 transition-colors hover:border-white hover:bg-white/10 hover:text-white"
        aria-label={editLabel}
        title={editLabel}
      >
        <Pencil className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="touch-target-exempt inline-flex h-8 w-8 items-center justify-center rounded-md border border-nf-gray-400/40 text-nf-gray-100 transition-colors hover:border-nf-red hover:bg-nf-red/15 hover:text-nf-red"
        aria-label={deleteLabel}
        title={deleteLabel}
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
