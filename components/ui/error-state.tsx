import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCcw, Home } from "lucide-react"
import { cn } from "@/lib/utils"

interface ErrorStateProps {
  title?: string
  description?: string
  onRetry?: () => void
  variant?: "inline" | "full"
  technicalError?: string
}

export function ErrorState({
  title = "Something went wrong",
  description = "We couldn't load the information you're looking for. Please check your connection and try again.",
  onRetry,
  variant = "inline",
  technicalError
}: ErrorStateProps) {
  if (variant === "full") {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-8 border-4 border-white shadow-xl">
          <AlertTriangle size={48} />
        </div>
        <h1 className="text-4xl font-black text-slate-900 italic tracking-tight uppercase mb-4">
          Oops! {title}
        </h1>
        <p className="text-slate-500 font-bold max-w-md mb-10 text-lg">
          {description}
        </p>
        
        {technicalError && (
          <details className="mb-10 w-full max-w-md bg-slate-50 rounded-2xl p-4 text-left border border-slate-100">
            <summary className="text-xs font-black uppercase tracking-widest text-slate-400 cursor-pointer hover:text-slate-600 transition-colors">
              Technical Details
            </summary>
            <code className="text-[10px] text-red-400 mt-2 block break-all font-mono leading-relaxed">
              {technicalError}
            </code>
          </details>
        )}

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
          {onRetry && (
            <Button 
              onClick={onRetry}
              className="flex-1 rounded-2xl h-14 bg-primary font-black uppercase tracking-widest text-white shadow-xl shadow-primary/20 hover:scale-105 transition-transform"
            >
              <RefreshCcw className="w-5 h-5 mr-3" />
              Try Again
            </Button>
          )}
          <Button 
            variant="outline"
            className="flex-1 rounded-2xl h-14 font-black uppercase tracking-widest border-slate-200 hover:bg-slate-50"
            asChild
          >
            <a href="/">
              <Home className="w-5 h-5 mr-3" />
              Go Home
            </a>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-10 bg-red-50/50 rounded-[2.5rem] border border-red-100 text-center animate-in fade-in zoom-in duration-300">
      <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-4" />
      <h3 className="text-lg font-black text-slate-900 tracking-tight mb-2 italic uppercase">{title}</h3>
      <p className="text-sm text-slate-500 font-bold mb-6">{description}</p>
      {onRetry && (
        <Button 
          size="sm" 
          onClick={onRetry}
          className="rounded-xl h-10 bg-red-500 hover:bg-red-600 font-black uppercase tracking-widest text-white px-6"
        >
          <RefreshCcw className="w-4 h-4 mr-2" />
          Retry
        </Button>
      )}
    </div>
  )
}
