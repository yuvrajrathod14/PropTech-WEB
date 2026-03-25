import * as React from "react"
import { cn } from "@/lib/utils"
import { CheckCircle2, AlertCircle } from "lucide-react"

export interface InputProps extends React.ComponentProps<"input"> {
  error?: string
  success?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, success, ...props }, ref) => {
    return (
      <div className="relative w-full group">
        <input
          type={type}
          className={cn(
            "flex h-12 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm transition-all outline-none",
            "placeholder:text-slate-400 font-medium",
            "focus:border-[#1A56DB] focus:ring-4 focus:ring-[#1A56DB]/5",
            error && "border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/5",
            success && "border-[#10B981] focus:border-[#10B981] focus:ring-[#10B981]/5",
            "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400",
            className
          )}
          ref={ref}
          {...props}
        />
        {success && (
          <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 text-[#10B981] w-5 h-5" />
        )}
        {error && (
          <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 text-[#EF4444] w-5 h-5" />
        )}
        {error && (
          <span className="text-[11px] font-bold text-[#EF4444] mt-1.5 ml-1 block animate-in fade-in slide-in-from-top-1">
            {error}
          </span>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
