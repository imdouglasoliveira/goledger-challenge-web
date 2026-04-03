import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Algo deu errado',
  message = 'Nao foi possivel carregar os dados.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
      <h3 className="text-lg font-semibold text-nf-gray-100">{title}</h3>
      <p className="text-sm text-nf-gray-200 mt-1 max-w-sm">{message}</p>
      {onRetry && (
        <Button variant="netflix" onClick={onRetry} className="mt-4">
          Tentar novamente
        </Button>
      )}
    </div>
  );
}
