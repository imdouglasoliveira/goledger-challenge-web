import { cn } from '@/lib/utils';

interface AgeBadgeProps {
  age: number;
  className?: string;
}

export function AgeBadge({ age, className }: AgeBadgeProps) {
  const text = age === 0 ? 'L' : `${age}+`;
  
  return (
    <span 
      className={cn(
        "inline-flex items-center justify-center border border-nf-gray-300 text-nf-gray-100 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-sm tracking-widest leading-none",
        className
      )}
    >
      {text}
    </span>
  );
}
