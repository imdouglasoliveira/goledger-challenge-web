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
        "inline-flex items-center justify-center rounded-sm border border-nf-gray-200 text-[10px] font-bold uppercase leading-none tracking-widest text-white px-1.5 py-0.5",
        className
      )}
    >
      {text}
    </span>
  );
}
