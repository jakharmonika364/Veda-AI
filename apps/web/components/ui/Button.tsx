import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { Spinner } from './Spinner';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'orange' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, disabled, children, ...props }, ref) => {
    const base =
      'inline-flex items-center justify-center font-medium tracking-tight transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5623] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none';

    const variants = {
      primary:
        'bg-[#181818] text-white rounded-[100px] border-[1.5px] border-[rgba(255,255,255,0.15)] hover:bg-[#252525] active:scale-95',
      secondary:
        'bg-white text-[#303030] border border-[rgba(0,0,0,0.12)] rounded-[100px] hover:bg-gray-50',
      ghost:
        'bg-transparent text-[#303030] hover:bg-black/5 rounded-[100px]',
      orange:
        'bg-[#FF5623] text-white rounded-[100px] hover:bg-[#E04010] active:scale-95 shadow-orange-glow',
      destructive:
        'bg-red-600 text-white rounded-[100px] hover:bg-red-700 active:scale-95',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm gap-1.5',
      md: 'px-5 py-2.5 text-sm gap-2',
      lg: 'px-6 py-3 text-base gap-2',
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Spinner size="sm" className="text-current" />}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
