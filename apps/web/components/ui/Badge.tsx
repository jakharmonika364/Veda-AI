import { cn } from '@/lib/utils';

type BadgeVariant = 'easy' | 'moderate' | 'challenging' | 'pending' | 'processing' | 'completed' | 'failed' | 'default';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  easy: 'bg-green-50 text-green-700 border-green-200',
  moderate: 'bg-amber-50 text-amber-700 border-amber-200',
  challenging: 'bg-red-50 text-red-700 border-red-200',
  pending: 'bg-gray-100 text-gray-600 border-gray-200',
  processing: 'bg-blue-50 text-blue-700 border-blue-200',
  completed: 'bg-green-50 text-green-700 border-green-200',
  failed: 'bg-red-50 text-red-700 border-red-200',
  default: 'bg-gray-100 text-gray-700 border-gray-200',
};

export function Badge({ variant = 'default', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-pill border px-2 py-0.5 text-xs font-medium',
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const map: Record<string, BadgeVariant> = {
    Easy: 'easy',
    Moderate: 'moderate',
    Challenging: 'challenging',
  };
  return <Badge variant={map[difficulty] ?? 'default'}>{difficulty}</Badge>;
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, BadgeVariant> = {
    pending: 'pending',
    processing: 'processing',
    completed: 'completed',
    failed: 'failed',
  };
  return <Badge variant={map[status] ?? 'default'}>{status}</Badge>;
}
