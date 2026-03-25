"use client"

import { useEffect } from "react"
import { ErrorState } from "@/components/ui/error-state"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50/30">
      <ErrorState 
        variant="full"
        title="Application Error"
        description="We've encountered an unexpected issue while loading this page. Our team has been notified."
        onRetry={() => reset()}
        technicalError={error.message || "Unknown error occurred"}
      />
    </div>
  )
}
