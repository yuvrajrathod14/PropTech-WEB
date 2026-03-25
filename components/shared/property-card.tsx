"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { MapPin, Bath, BedDouble, Square, Heart } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatIndianPrice } from "@/lib/utils/formatPrice"
import { cn } from "@/lib/utils"

export interface Property {
  id: string
  title: string
  location: string
  price: number
  type: "buy" | "rent"
  category: string
  beds: number
  baths: number
  area: number
  image: string
  is_featured?: boolean
  owner_name?: string
  created_at?: string
}

export function PropertyCard({ 
  property, 
  className, 
  variant = "grid",
  isWishlisted = false,
  onToggleWishlist
}: { 
  property: Property, 
  className?: string,
  variant?: "grid" | "list" | "mini",
  isWishlisted?: boolean,
  onToggleWishlist?: (e: React.MouseEvent) => void
}) {
  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onToggleWishlist?.(e)
  }

  if (variant === "list") {
    return (
      <motion.div
        whileHover={{ y: -4 }}
        className={cn(
          "group bg-white rounded-[32px] border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300 flex flex-col md:flex-row h-full md:h-64",
          className
        )}
      >
        {/* Image Container */}
        <div className="relative w-full md:w-80 h-48 md:h-full overflow-hidden shrink-0">
          <Image
            src={property.image}
            alt={property.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <Badge className={cn(
              "border-none shadow-md uppercase text-[10px] font-black tracking-wider px-3 py-1 rounded-full",
              property.type === 'buy' ? 'bg-primary text-white' : 'bg-emerald-500 text-white'
            )}>
              For {property.type}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-primary uppercase tracking-widest">{property.category}</p>
                <h3 className="text-xl font-black text-slate-900 line-clamp-1 group-hover:text-primary transition-colors">
                  {property.title}
                </h3>
                <div className="flex items-center text-slate-500 text-sm font-medium">
                  <MapPin className="w-3.5 h-3.5 mr-1.5 shrink-0 text-primary" />
                  <span className="truncate">{property.location}</span>
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900 tracking-tight">{formatIndianPrice(property.price)}</p>
            </div>

            <div className="flex items-center gap-6 text-slate-600">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center">
                  <BedDouble className="w-4 h-4 text-slate-400" />
                </div>
                <span className="text-sm font-bold text-slate-700">{property.beds} <span className="text-[10px] text-slate-400 uppercase">Beds</span></span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center">
                  <Bath className="w-4 h-4 text-slate-400" />
                </div>
                <span className="text-sm font-bold text-slate-700">{property.baths} <span className="text-[10px] text-slate-400 uppercase">Baths</span></span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center">
                  <Square className="w-4 h-4 text-slate-400" />
                </div>
                <span className="text-sm font-bold text-slate-700">{property.area} <span className="text-[10px] text-slate-400 uppercase">Sq.Ft</span></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4 mt-auto">
             <Link href={`/property/${property.id}`} className="flex-1">
               <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black rounded-2xl h-12 shadow-lg shadow-slate-200">
                  View Details
               </Button>
             </Link>
             <Button 
                variant="outline" 
                size="icon" 
                onClick={handleWishlistClick}
                className={cn(
                  "w-12 h-12 rounded-2xl border-2 hover:bg-slate-50 group/heart transition-all",
                  isWishlisted ? "bg-red-50 border-red-100" : "border-slate-100"
                )}
             >
                <Heart className={cn(
                  "w-5 h-5 transition-colors",
                  isWishlisted ? "fill-red-500 text-red-500" : "text-slate-400 group-hover/heart:text-red-500"
                )} />
             </Button>
          </div>
        </div>
      </motion.div>
    )
  }

  // Grid & Mini variants
  return (
    <motion.div
      whileHover={variant !== 'mini' ? { y: -8 } : {}}
      className={cn(
        "group bg-white border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 flex flex-col h-full",
        variant === 'mini' ? 'rounded-2xl p-2' : 'rounded-[32px]',
        className
      )}
    >
      {/* Image Container */}
      <div className={cn(
        "relative overflow-hidden shrink-0",
        variant === 'mini' ? 'aspect-video rounded-xl' : 'aspect-[4/3]'
      )}>
        <Image
          src={property.image}
          alt={property.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
        />
        
        {variant !== 'mini' && (
          <>
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <Badge className={cn(
                "border-none shadow-md uppercase text-[10px] font-black tracking-wider px-3 py-1 rounded-full",
                property.type === 'buy' ? 'bg-primary text-white' : 'bg-emerald-500 text-white'
              )}>
                For {property.type}
              </Badge>
            </div>
            
            <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
              <Button 
                size="icon" 
                onClick={handleWishlistClick}
                className={cn(
                  "w-10 h-10 rounded-2xl bg-white/90 backdrop-blur-sm shadow-xl hover:bg-white transition-all",
                  isWishlisted ? "text-red-500" : "text-slate-900 hover:text-red-500"
                )}
              >
                <Heart className={cn("w-5 h-5", isWishlisted && "fill-current")} />
              </Button>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
              <p className="text-white font-black text-2xl tracking-tight">{formatIndianPrice(property.price)}</p>
            </div>
          </>
        )}
      </div>

      {/* Content */}
      <div className={cn(
        "flex flex-col flex-grow",
        variant === 'mini' ? 'p-2 space-y-1' : 'p-6 space-y-4'
      )}>
        <div>
          <p className={cn(
            "font-black text-primary uppercase tracking-widest",
            variant === 'mini' ? 'text-[8px]' : 'text-[10px] mb-1'
          )}>{property.category}</p>
          <h3 className={cn(
            "font-black text-slate-900 group-hover:text-primary transition-colors",
            variant === 'mini' ? 'text-xs truncate' : 'text-xl'
          )}>
            {property.title}
          </h3>
          <div className="flex items-center text-slate-500 text-xs font-medium mt-1">
            <MapPin className="w-3.5 h-3.5 mr-1.5 shrink-0 text-primary" />
            <span className="truncate">{property.location}</span>
          </div>
        </div>

        {variant !== 'mini' && (
          <div className="pt-4 border-t border-slate-50 flex items-center justify-between text-slate-600">
            <div className="flex flex-col items-center gap-1">
              <BedDouble className="w-5 h-5 text-slate-300" />
              <span className="text-xs font-bold text-slate-900">{property.beds} <span className="text-[10px] text-slate-400 font-medium">Beds</span></span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Bath className="w-5 h-5 text-slate-300" />
              <span className="text-xs font-bold text-slate-900">{property.baths} <span className="text-[10px] text-slate-400 font-medium">Baths</span></span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Square className="w-5 h-5 text-slate-300" />
              <span className="text-xs font-bold text-slate-900">{property.area} <span className="text-[10px] text-slate-400 font-medium">Sq.Ft</span></span>
            </div>
          </div>
        )}

        <div className="pt-2">
          <Link href={`/property/${property.id}`}>
            <Button className={cn(
              "w-full font-black transition-all duration-300",
              variant === 'mini' ? 'h-8 text-[10px] rounded-lg' : 'h-12 bg-slate-50 hover:bg-primary hover:text-white text-slate-900 shadow-sm rounded-2xl'
            )}>
              {variant === 'mini' ? 'View' : 'View Property'}
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
