"use client"

import Image, { ImageProps } from "next/image"
import { useState } from "react"
import { Camera, Home } from "lucide-react"
import { cn } from "@/lib/utils"

interface OptimizedImageProps extends Omit<ImageProps, 'onError'> {
  fallbackType?: "property" | "user" | "generic"
  containerClassName?: string
}

export function OptimizedImage({
  src,
  alt,
  className,
  containerClassName,
  fallbackType = "generic",
  ...props
}: OptimizedImageProps) {
  const [error, setError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  if (error || !src) {
    return (
      <div className={cn(
        "flex items-center justify-center bg-slate-100 text-slate-300 w-full h-full",
        containerClassName
      )}>
        {fallbackType === "property" ? (
          <Home className="w-12 h-12 opacity-50" />
        ) : (
          <Camera className="w-12 h-12 opacity-50" />
        )}
      </div>
    )
  }

  return (
    <div className={cn("relative overflow-hidden bg-slate-100", containerClassName)}>
      <Image
        src={src}
        alt={alt}
        className={cn(
          "transition-all duration-700",
          isLoading ? "scale-110 blur-xl" : "scale-100 blur-0",
          className
        )}
        onLoadingComplete={() => setIsLoading(false)}
        onError={() => setError(true)}
        {...props}
      />
      {isLoading && (
        <div className="absolute inset-0 animate-pulse bg-slate-200/50" />
      )}
    </div>
  )
}
