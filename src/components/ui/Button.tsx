import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'soft'
export type ButtonSize = 'sm' | 'md' | 'lg'

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-600 text-white shadow-[0_1px_2px_rgba(16,24,40,.16),inset_0_1px_0_rgba(255,255,255,.14)] hover:bg-brand-700 active:bg-brand-800',
  secondary: 'border border-ink-200 bg-white text-ink-800 shadow-card hover:border-ink-300 hover:bg-ink-50',
  ghost: 'text-ink-600 hover:bg-ink-100/80 hover:text-ink-900',
  danger: 'bg-rose-600 text-white shadow-card hover:bg-rose-700 active:bg-rose-800',
  soft: 'bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-200/70 hover:bg-brand-100',
}

const SIZES: Record<ButtonSize, string> = {
  sm: 'h-8 gap-1.5 px-3 text-[13px]',
  md: 'h-10 gap-2 px-4 text-sm',
  lg: 'h-12 gap-2.5 px-6 text-[15px]',
}

export function buttonStyles(variant: ButtonVariant = 'primary', size: ButtonSize = 'md', className?: string) {
  return cn(
    'inline-flex select-none items-center justify-center whitespace-nowrap rounded-xl font-semibold',
    'transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-smooth',
    'active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50',
    VARIANTS[variant],
    SIZES[size],
    className,
  )
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', loading = false, className, children, disabled, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={buttonStyles(variant, size, className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
      {children}
    </button>
  )
})

/** Square icon-only button — used in card toolbars and dense headers. */
export const IconButton = forwardRef<HTMLButtonElement, ButtonProps & { label: string }>(function IconButton(
  { variant = 'ghost', className, label, children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200 ease-smooth active:scale-95',
        VARIANTS[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
})
