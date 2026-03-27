"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { X, ChevronLeft, ChevronRight, ZoomIn, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function GalleryPage() {
  const params = useParams()
  const router = useRouter()
  const [images, setImages] = useState<string[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isZoomed, setIsZoomed] = useState(false)

  useEffect(() => {
    const fetchImages = async () => {
      const supabase = createClient()
      const { data } = await (supabase.from("properties") as any)
        .select("images, title")
        .eq("id", params.id)
        .single()

      if (data?.images) {
        setImages(Array.isArray(data.images) ? data.images : [data.images])
      }
      setLoading(false)
    }
    fetchImages()
  }, [params.id])

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
    setIsZoomed(false)
  }, [images.length])

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
    setIsZoomed(false)
  }, [images.length])

  const handleClose = useCallback(() => {
    router.back()
  }, [router])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext()
      else if (e.key === "ArrowLeft") goPrev()
      else if (e.key === "Escape") handleClose()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [goNext, goPrev, handleClose])

  // Touch / swipe support
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX)
  }
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return
    const diff = touchStart - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext()
      else goPrev()
    }
    setTouchStart(null)
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black z-[9999] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    )
  }

  if (images.length === 0) {
    return (
      <div className="fixed inset-0 bg-black z-[9999] flex flex-col items-center justify-center text-white gap-4">
        <p className="text-xl font-bold">No photos available</p>
        <Button onClick={handleClose} variant="outline" className="text-white border-white/20 hover:bg-white/10">
          Go Back
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black z-[9999] flex flex-col">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 md:px-8 py-4 bg-gradient-to-b from-black/80 to-transparent absolute top-0 left-0 right-0 z-10">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="text-white hover:bg-white/10 rounded-2xl w-12 h-12"
          >
            <X className="w-6 h-6" />
          </Button>
          <span className="text-white/80 font-black text-sm tracking-widest uppercase">
            {currentIndex + 1} / {images.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsZoomed(!isZoomed)}
            className="text-white hover:bg-white/10 rounded-xl"
          >
            <ZoomIn className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              const a = document.createElement("a")
              a.href = images[currentIndex]
              a.download = `property-${params.id}-photo-${currentIndex + 1}.jpg`
              a.click()
            }}
            className="text-white hover:bg-white/10 rounded-xl"
          >
            <Download className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Main Image */}
      <div
        className="flex-1 flex items-center justify-center relative overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Previous Button */}
        {images.length > 1 && (
          <button
            onClick={goPrev}
            className="absolute left-4 md:left-8 z-10 w-14 h-14 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-2xl flex items-center justify-center transition-all active:scale-90"
          >
            <ChevronLeft className="w-8 h-8 text-white" />
          </button>
        )}

        {/* Image */}
        <div className={cn(
          "w-full h-full flex items-center justify-center transition-transform duration-300",
          isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
        )}>
          <img
            src={images[currentIndex]}
            alt={`Photo ${currentIndex + 1}`}
            className={cn(
              "max-w-full max-h-full object-contain select-none transition-transform duration-300",
              isZoomed ? "scale-150" : "scale-100"
            )}
            onClick={() => setIsZoomed(!isZoomed)}
            draggable={false}
          />
        </div>

        {/* Next Button */}
        {images.length > 1 && (
          <button
            onClick={goNext}
            className="absolute right-4 md:right-8 z-10 w-14 h-14 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-2xl flex items-center justify-center transition-all active:scale-90"
          >
            <ChevronRight className="w-8 h-8 text-white" />
          </button>
        )}
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="bg-gradient-to-t from-black/80 to-transparent px-4 py-6">
          <div className="flex items-center justify-center gap-2 overflow-x-auto max-w-full pb-2 scrollbar-hide">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentIndex(idx)
                  setIsZoomed(false)
                }}
                className={cn(
                  "relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 transition-all duration-200",
                  idx === currentIndex
                    ? "border-white shadow-lg shadow-white/20 scale-110"
                    : "border-transparent opacity-50 hover:opacity-80"
                )}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
