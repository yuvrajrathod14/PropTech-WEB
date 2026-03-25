import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Star, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-wider transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-[#1A56DB] text-white",
        outline: "text-foreground",
        // Status Badges
        approved: "border-transparent bg-[#D1FAE5] text-[#065F46]",
        live: "border-transparent bg-[#D1FAE5] text-[#065F46]",
        active: "border-transparent bg-[#D1FAE5] text-[#065F46]",
        pending: "border-transparent bg-[#FEF3C7] text-[#92400E]",
        review: "border-transparent bg-[#FEF3C7] text-[#92400E]",
        rejected: "border-transparent bg-[#FEE2E2] text-[#991B1B]",
        failed: "border-transparent bg-[#FEE2E2] text-[#991B1B]",
        blocked: "border-transparent bg-[#FEE2E2] text-[#991B1B]",
        draft: "border-transparent bg-[#F3F4F6] text-[#374151]",
        sold: "border-transparent bg-[#EDE9FE] text-[#5B21B6]",
        completed: "border-transparent bg-[#EDE9FE] text-[#5B21B6]",
        featured: "border-transparent bg-[#FEF3C7] text-[#92400E] gap-1",
        verified: "border-transparent bg-[#D1FAE5] text-[#065F46] gap-1",
        propertyType: "border-transparent bg-[#EFF6FF] text-[#1A56DB]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {variant === 'featured' && <Star size={10} className="fill-current" />}
      {variant === 'verified' && <CheckCircle2 size={10} />}
      {children}
    </div>
  )
}

export { Badge, badgeVariants }
