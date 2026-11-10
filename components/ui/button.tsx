import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'editorial' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';

    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 select-none rounded-sm border';

    const variants = {
      primary:
        'bg-foreground text-background border-foreground hover:bg-foreground/90 active:scale-[0.99]',
      secondary:
        'bg-muted text-foreground border-border hover:bg-muted/80',
      outline:
        'bg-transparent text-foreground border-border hover:bg-muted/50 hover:border-foreground/40',
      ghost:
        'bg-transparent text-muted-foreground border-transparent hover:bg-muted/60 hover:text-foreground',
      editorial:
        'bg-editorial-charcoal text-editorial-bronzeLight border-editorial-borderDark hover:border-editorial-bronze hover:text-white',
      danger:
        'bg-red-950/40 text-red-400 border-red-900/60 hover:bg-red-900/50',
    };

    const sizes = {
      sm: 'h-8 px-2.5 text-xs tracking-wide',
      md: 'h-9 px-3.5 text-xs uppercase tracking-wider',
      lg: 'h-11 px-5 text-sm tracking-wide',
      icon: 'h-8 w-8 p-0',
    };

    return (
      <Comp
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

