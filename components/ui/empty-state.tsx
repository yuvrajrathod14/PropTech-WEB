import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"
import Link from "next/link"

interface EmptyStateProps {
  icon?: LucideIcon
  illustration?: string | React.ReactNode
  title: string
  description: string
  action?: {
    label: string
    onClick?: () => void
    href?: string
    icon?: LucideIcon
  }
  className?: string
}

export function EmptyState({
  icon: Icon,
  illustration,
  title,
  description,
  action,
  className
}: EmptyStateProps) {
  const content = (
    <div className={cn(
      "flex flex-col items-center justify-center p-12 text-center bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50",
      className
    )}>
      {Icon ? (
        <div className="w-20 h-20 rounded-[2rem] bg-slate-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
          <Icon className="w-10 h-10 text-slate-300" />
        </div>
      ) : illustration ? (
        <div className="text-6xl mb-6">
          {illustration}
        </div>
      ) : null}
      
      <h3 className="text-2xl font-black text-slate-900 italic tracking-tight uppercase mb-3">
        {title}
      </h3>
      <p className="text-slate-500 font-bold max-w-sm mb-8">
        {description}
      </p>

      {action && (
        action.href ? (
          <Link href={action.href}>
            <Button className="rounded-2xl px-8 h-12 bg-[#1A56DB] font-black uppercase tracking-widest text-white shadow-lg shadow-[#1A56DB]/20 hover:scale-105 transition-transform gap-2">
              {action.label}
              {action.icon && <action.icon className="w-4 h-4" />}
            </Button>
          </Link>
        ) : (
          <Button 
            onClick={action.onClick}
            className="rounded-2xl px-8 h-12 bg-[#1A56DB] font-black uppercase tracking-widest text-white shadow-lg shadow-[#1A56DB]/20 hover:scale-105 transition-transform gap-2"
          >
            {action.label}
            {action.icon && <action.icon className="w-4 h-4" />}
          </Button>
        )
      )}
    </div>
  )

  return content
}
