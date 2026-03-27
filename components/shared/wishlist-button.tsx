"use client"

import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useState, useTransition } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"

export function WishlistButton({
  propertyId,
  initialWishlisted = false,
  size = "default",
  className,
  onToggle,
}: {
  propertyId: string
  initialWishlisted?: boolean
  size?: "default" | "sm" | "lg"
  className?: string
  onToggle?: (wishlisted: boolean) => void
}) {
  const [isWishlisted, setIsWishlisted] = useState(initialWishlisted)
  const [isPending, startTransition] = useTransition()
  const { user } = useAuth()

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      toast.error("Please login to save properties")
      return
    }

    // Optimistic update
    const newState = !isWishlisted
    setIsWishlisted(newState)
    onToggle?.(newState)

    // Sync with DB
    startTransition(async () => {
      const supabase = createClient()
      try {
        if (newState) {
          await (supabase.from("wishlists") as any).insert({
            user_id: user.id,
            property_id: propertyId,
          })
        } else {
          await (supabase.from("wishlists") as any)
            .delete()
            .eq("user_id", user.id)
            .eq("property_id", propertyId)
        }
      } catch {
        // Revert on failure
        setIsWishlisted(!newState)
        onToggle?.(!newState)
        toast.error("Failed to update wishlist")
      }
    })
  }

  const sizeClasses = {
    sm: "w-8 h-8 rounded-lg",
    default: "w-10 h-10 rounded-xl",
    lg: "w-12 h-12 rounded-2xl",
  }

  const iconSize = {
    sm: "w-4 h-4",
    default: "w-5 h-5",
    lg: "w-6 h-6",
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleToggle}
      disabled={isPending}
      className={cn(
        sizeClasses[size],
        "border-2 transition-all duration-200",
        isWishlisted
          ? "bg-red-50 border-red-100 hover:bg-red-100"
          : "border-slate-100 hover:bg-slate-50",
        className
      )}
    >
      <Heart
        className={cn(
          iconSize[size],
          "transition-colors",
          isWishlisted
            ? "fill-red-500 text-red-500"
            : "text-slate-400 hover:text-red-500"
        )}
      />
    </Button>
  )
}
