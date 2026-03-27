"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export function PropertyCardSkeleton({
  variant = "grid",
  className,
}: {
  variant?: "grid" | "list"
  className?: string
}) {
  if (variant === "list") {
    return (
      <div className={cn("bg-white rounded-[32px] border border-slate-100 overflow-hidden flex flex-col md:flex-row h-full md:h-64", className)}>
        <Skeleton className="w-full md:w-80 h-48 md:h-full shrink-0" />
        <div className="p-6 flex-1 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex justify-between">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-3 w-16 rounded-full" />
                <Skeleton className="h-6 w-3/4 rounded-xl" />
                <Skeleton className="h-4 w-1/2 rounded-lg" />
              </div>
              <Skeleton className="h-8 w-28 rounded-xl" />
            </div>
            <div className="flex gap-6">
              <Skeleton className="h-8 w-16 rounded-xl" />
              <Skeleton className="h-8 w-16 rounded-xl" />
              <Skeleton className="h-8 w-20 rounded-xl" />
            </div>
          </div>
          <div className="flex gap-4 pt-4">
            <Skeleton className="flex-1 h-12 rounded-2xl" />
            <Skeleton className="w-12 h-12 rounded-2xl" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("bg-white rounded-[32px] border border-slate-100 overflow-hidden flex flex-col h-full", className)}>
      <Skeleton className="aspect-[4/3] w-full" />
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-3 w-16 rounded-full" />
          <Skeleton className="h-6 w-3/4 rounded-xl" />
          <Skeleton className="h-4 w-1/2 rounded-lg" />
        </div>
        <div className="pt-4 border-t border-slate-50 flex justify-between">
          <Skeleton className="h-10 w-16 rounded-xl" />
          <Skeleton className="h-10 w-16 rounded-xl" />
          <Skeleton className="h-10 w-20 rounded-xl" />
        </div>
        <Skeleton className="h-12 w-full rounded-2xl" />
      </div>
    </div>
  )
}
