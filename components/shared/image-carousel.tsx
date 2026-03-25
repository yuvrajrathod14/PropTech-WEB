"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Maximize2, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { OptimizedImage } from "@/components/shared/optimized-image"
import { cn } from "@/lib/utils"

interface ImageCarouselProps {
  images: string[]
  className?: string
  aspectRatio?: "video" | "square" | "auto"
}

export function ImageCarousel({ images, className, aspectRatio = "video" }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  }

  const swipeConfidenceThreshold = 10000
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity
  }

  const paginate = (newDirection: number) => {
    setDirection(newDirection)
    setCurrentIndex((prevIndex) => (prevIndex + newDirection + images.length) % images.length)
  }

  return (
    <div className={cn("relative group w-full overflow-hidden rounded-[32px] bg-slate-100", className)}>
      <div className={cn(
        "relative w-full overflow-hidden",
        aspectRatio === "video" ? "aspect-[16/9] md:h-[480px]" : "aspect-square"
      )}>
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x)
              if (swipe < -swipeConfidenceThreshold) {
                paginate(1)
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1)
              }
            }}
            className="absolute inset-0"
          >
            <OptimizedImage
              src={images[currentIndex]}
              alt={`Property image ${currentIndex + 1}`}
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        </AnimatePresence>

        {/* Overlays */}
        <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/60 to-transparent pointer-events-none">
          <div className="flex items-center justify-between">
            <div className="flex gap-1.5">
              {images.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    index === currentIndex ? "w-8 bg-white" : "w-1.5 bg-white/40"
                  )}
                />
              ))}
            </div>
            <Button 
              variant="secondary" 
              size="sm" 
              className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border-white/20 rounded-xl font-bold gap-2 pointer-events-auto"
            >
              <Maximize2 className="w-4 h-4" />
              View All Photos
            </Button>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="secondary"
            size="icon"
            onClick={() => paginate(-1)}
            className="w-12 h-12 rounded-2xl bg-white/90 backdrop-blur-sm shadow-xl hover:bg-white text-slate-900 border-none"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={() => paginate(1)}
            className="w-12 h-12 rounded-2xl bg-white/90 backdrop-blur-sm shadow-xl hover:bg-white text-slate-900 border-none"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Thumbnail Strip */}
      <div className="flex gap-4 p-4 mt-2 overflow-x-auto no-scrollbar pb-6 px-0 md:px-4">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1)
              setCurrentIndex(index)
            }}
            className={cn(
              "relative flex-shrink-0 w-24 aspect-video rounded-xl overflow-hidden border-2 transition-all",
              index === currentIndex ? "border-[#1A56DB] scale-105 shadow-lg" : "border-transparent opacity-60 hover:opacity-100"
            )}
          >
            <OptimizedImage src={img} alt="thumbnail" fill className="object-cover" />
            {index === images.length - 1 && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <Play className="w-6 h-6 text-white fill-white" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
