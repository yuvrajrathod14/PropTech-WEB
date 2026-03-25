"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A56DB] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-[#1A56DB] text-white hover:bg-[#1341A8] shadow-lg shadow-blue-500/10",
        destructive: "bg-[#EF4444] text-white hover:bg-[#DC2626] shadow-lg shadow-red-500/10",
        outline: "border border-slate-200 bg-white hover:bg-slate-50 text-slate-700",
        secondary: "bg-white text-[#1A56DB] border border-[#1A56DB] hover:bg-[#EFF6FF]",
        ghost: "bg-transparent text-[#6B7280] hover:bg-[#F3F4F6] hover:text-slate-900",
        link: "text-[#1A56DB] underline-offset-4 hover:underline",
        destructiveOutlined: "border-[#EF4444] text-[#EF4444] hover:bg-[#FEF2F2]",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-9 rounded-md px-4 text-xs",
        md: "h-12 px-6 py-3",
        lg: "h-14 rounded-xl px-10 text-base",
        icon: "h-10 w-10",
        full: "h-12 w-full px-6 py-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }), loading && "relative !text-transparent")}
        ref={ref}
        disabled={loading || props.disabled}
        {...props}
      >
        {asChild ? (
          children
        ) : (
          <>
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-current" />
              </div>
            )}
            {children}
          </>
        )}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
