import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' }>(
  ({ className, variant = 'primary', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-full text-sm font-medium transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-stone-100 dark:ring-offset-stone-950",
          "h-14 py-2 px-6",
          variant === 'primary' && "bg-stone-900 text-white hover:bg-stone-800 shadow-md dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200",
          variant === 'secondary' && "bg-stone-200 text-stone-900 hover:bg-stone-300 dark:bg-stone-800 dark:text-stone-100 dark:hover:bg-stone-700",
          variant === 'outline' && "border border-stone-300 hover:bg-stone-200 text-stone-900 dark:border-stone-700 dark:hover:bg-stone-800 dark:text-stone-100",
          variant === 'ghost' && "hover:bg-stone-200 text-stone-900 dark:hover:bg-stone-800 dark:text-stone-100",
          variant === 'danger' && "bg-rose-600 text-white hover:bg-rose-700 shadow-md",
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        className={cn(
          "flex h-14 w-full rounded-2xl border-none bg-stone-200/50 dark:bg-stone-800/50 px-5 py-2 text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-500 dark:placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900 dark:focus:ring-stone-100 focus:bg-white dark:focus:bg-stone-800 transition-all disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("rounded-[32px] bg-white dark:bg-stone-900 text-stone-950 dark:text-stone-50 shadow-sm", className)}
      {...props}
    />
  )
);
Card.displayName = "Card";
