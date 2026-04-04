import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
}

export function EmptyState({
  title = 'Nenhum item encontrado',
  description = 'Não há itens para exibir ainda.',
  children,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Inbox className="mb-4 h-12 w-12 text-nf-gray-200" />
      <h3 className="text-lg font-semibold text-nf-gray-100">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-nf-gray-100">{description}</p>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
