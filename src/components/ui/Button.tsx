import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'outline' | 'ghost' | 'crimson';
    size?: 'sm' | 'md' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
        return (
            <button
                className={cn(
                    'inline-flex items-center justify-center font-black uppercase tracking-tight transition-all active:shadow-none active:translate-x-[4px] active:translate-y-[4px] disabled:opacity-50 disabled:pointer-events-none',
                    {
                        // Variants
                        'bg-white border-2 border-dead-black text-black shadow-neo hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-hover':
                            variant === 'primary',
                        'bg-crimson border-2 border-dead-black text-white shadow-neo hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-hover':
                            variant === 'crimson',
                        'bg-transparent border-2 border-dead-black text-black shadow-none hover:bg-muted-cream':
                            variant === 'outline',
                        'bg-transparent text-black hover:bg-muted-cream shadow-none border-none':
                            variant === 'ghost',
                        // Sizes
                        'h-10 px-4 py-2 rounded-xl text-sm': size === 'sm',
                        'h-12 px-6 py-3 rounded-2xl text-base': size === 'md',
                        'h-14 px-8 py-4 rounded-3xl text-lg': size === 'lg',
                        'h-12 w-12 rounded-full': size === 'icon',
                    },
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = 'Button';

export { Button };
