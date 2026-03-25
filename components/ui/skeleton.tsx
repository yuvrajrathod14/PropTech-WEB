import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-slate-200/60", className)}
      {...props}
    />
  )
}

// Specific Skeleton Variants
export function PropertyCardSkeleton({ variant = "grid" }: { variant?: "grid" | "list" }) {
  if (variant === "list") {
    return (
      <div className="flex flex-col md:flex-row gap-6 p-4 rounded-3xl bg-white border border-slate-100 shadow-sm animate-pulse">
        <Skeleton className="w-full md:w-72 h-48 rounded-2xl shrink-0" />
        <div className="flex-1 space-y-4 py-2">
           <Skeleton className="h-6 w-3/4 rounded-lg" />
           <Skeleton className="h-4 w-1/2 rounded-lg" />
           <div className="flex gap-2 pt-2">
             <Skeleton className="h-4 w-20 rounded-full" />
             <Skeleton className="h-4 w-20 rounded-full" />
           </div>
           <Skeleton className="h-8 w-32 rounded-lg mt-auto" />
        </div>
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-4 rounded-[2rem] bg-white border border-slate-100 p-4 shadow-sm animate-pulse">
      <Skeleton className="w-full h-[220px] rounded-[1.5rem]" />
      <div className="space-y-3 px-2">
        <Skeleton className="h-6 w-3/4 rounded-lg" />
        <Skeleton className="h-4 w-1/2 rounded-lg" />
        <Skeleton className="h-4 w-full rounded-lg" />
      </div>
    </div>
  )
}

export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr className="animate-pulse border-b border-slate-50">
      {Array(columns).fill(0).map((_, i) => (
        <td key={i} className="px-8 py-5">
          <div className="flex flex-col gap-2">
            <Skeleton className={cn(
              "h-4 rounded-lg",
              i === 0 ? "w-8" : i === 1 ? "w-32" : "w-20"
            )} />
            {i === 1 && <Skeleton className="h-3 w-20 rounded-lg opacity-50" />}
          </div>
        </td>
      ))}
    </tr>
  )
}

export function ChatMessageSkeleton({ align = "left" }: { align?: "left" | "right" }) {
  return (
    <div className={cn("flex w-full mb-4 animate-pulse", align === 'right' ? "justify-end" : "justify-start")}>
      <div className={cn(
        "max-w-[70%] p-4 rounded-3xl space-y-2",
        align === 'right' ? "bg-primary/5 rounded-tr-none" : "bg-slate-100 rounded-tl-none"
      )}>
        <Skeleton className="h-3 w-24 rounded-full" />
        <Skeleton className="h-3 w-48 rounded-full opacity-60" />
        <Skeleton className="h-3 w-32 rounded-full opacity-40" />
      </div>
    </div>
  )
}

export function StatCardSkeleton() {
  return (
    <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm animate-pulse space-y-4">
       <Skeleton className="w-10 h-10 rounded-2xl" />
       <div className="space-y-2">
         <Skeleton className="h-4 w-20 rounded-lg" />
         <Skeleton className="h-10 w-32 rounded-xl" />
       </div>
    </div>
  )
}

export function ChartSkeleton() {
  return (
    <div className="w-full h-[350px] rounded-[2.5rem] bg-white border border-slate-100 p-8 shadow-sm animate-pulse flex items-end justify-between gap-4">
      {[...Array(12)].map((_, i) => (
        <Skeleton 
          key={i} 
          className="w-full rounded-t-xl" 
          style={{ height: `${Math.floor(Math.random() * 60) + 20}%` }} 
        />
      ))}
    </div>
  )
}

export function GridRowSkeleton({ columns = 4 }: { columns?: number }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center p-6 lg:px-8 bg-white rounded-3xl animate-pulse border border-slate-50">
      <div className="col-span-1"><Skeleton className="h-3 w-8 rounded-full" /></div>
      <div className="col-span-4 flex items-center gap-4">
        <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32 rounded-lg" />
          <Skeleton className="h-3 w-24 rounded-lg opacity-50" />
        </div>
      </div>
      <div className="col-span-2"><Skeleton className="h-4 w-20 rounded-lg" /></div>
      <div className="col-span-2"><Skeleton className="h-4 w-24 rounded-lg opacity-60" /></div>
      <div className="col-span-2"><Skeleton className="h-6 w-20 rounded-full" /></div>
      <div className="col-span-1 flex justify-end"><Skeleton className="w-10 h-10 rounded-xl" /></div>
    </div>
  )
}

export { Skeleton }
