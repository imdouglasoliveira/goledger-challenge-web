import * as React from 'react';
import { cn } from '@/lib/utils';

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        'flex h-11 sm:h-10 w-full rounded-md border border-nf-gray-400/60 bg-nf-gray-500 px-3 py-2 text-base sm:text-sm text-white placeholder:text-nf-gray-200/75 focus-visible:border-nf-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nf-red/55 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);
Input.displayName = 'Input';

export { Input };
