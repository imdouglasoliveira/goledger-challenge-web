import * as React from 'react';
import { cn } from '@/lib/utils';

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        'flex h-10 w-full rounded-md bg-nf-gray-500 border border-nf-gray-400 px-3 py-2 text-sm text-white placeholder:text-nf-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nf-red/50 focus-visible:border-nf-red disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);
Input.displayName = 'Input';

export { Input };
