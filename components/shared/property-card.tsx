"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { MapPin, Bath, BedDouble, Square, Heart } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { OptimizedImage } from "@/components/shared/optimized-image"
import { formatIndianPrice, cn } from "@/lib/utils"

export interface Property {
  id: string
  title?: string
  property_name?: string
  location?: string
  address?: string
  city?: string
  locality?: string
  price: number
  type: "buy" | "rent"
  category: string
  beds?: number
  bhk?: number
  baths?: number
  area?: number
  area_sqft?: number
  total_area_sqft?: number
  image?: string
  images?: string[]
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
  // Field mapping for Suppabase compatibility
  const title = (property.property_name || property.title || "Untitled Property") as string
  const location = (property.address || property.locality || property.city || property.location || "Unknown Location") as string
  const image = ((property.images && property.images.length > 0) ? property.images[0] : (property.image || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800")) as string
  const price = property.price
  const beds = (property.bhk || property.beds || 0) as number
  const area = (property.total_area_sqft || property.area_sqft || property.area || 0) as number
  const baths = (property.baths || 0) as number

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onToggleWishlist?.(e)
  }

  if (variant === "list") {
    return (
      <div
        className={cn(
          "group bg-white rounded-[32px] border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-slate-200/50 transition-[transform,box-shadow,background-color,border-color] duration-300 flex flex-col md:flex-row h-full md:h-64 hover:-translate-y-1",
          className
        )}
      >
        {/* Image Container */}
        <div className="relative w-full md:w-80 h-48 md:h-full overflow-hidden shrink-0">
          <OptimizedImage
            src={image}
            alt={title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <Badge className={cn(
              "border-none shadow-md uppercase text-[10px] font-black tracking-wider px-3 py-1 rounded-full",
              property.type === 'buy' ? 'bg-[#1A56DB] text-white' : 'bg-emerald-500 text-white'
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
                <p className="text-[10px] font-black text-[#1A56DB] uppercase tracking-widest">{property.category}</p>
                <h3 className="text-xl font-black text-slate-900 line-clamp-1 group-hover:text-[#1A56DB] transition-colors">
                  {title}
                </h3>
                <div className="flex items-center text-slate-500 text-sm font-medium">
                  <MapPin className="w-3.5 h-3.5 mr-1.5 shrink-0 text-[#1A56DB]" />
                  <span className="truncate">{location}</span>
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900 tracking-tight">{formatIndianPrice(price)}</p>
            </div>

            <div className="flex items-center gap-6 text-slate-600">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center">
                  <BedDouble className="w-4 h-4 text-slate-400" />
                </div>
                <span className="text-sm font-bold text-slate-700">{beds} <span className="text-[10px] text-slate-400 uppercase">Beds</span></span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center">
                  <Bath className="w-4 h-4 text-slate-400" />
                </div>
                <span className="text-sm font-bold text-slate-700">{baths} <span className="text-[10px] text-slate-400 uppercase">Baths</span></span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center">
                  <Square className="w-4 h-4 text-slate-400" />
                </div>
                <span className="text-sm font-bold text-slate-700">{area} <span className="text-[10px] text-slate-400 uppercase">Sq.Ft</span></span>
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
                  "w-12 h-12 rounded-2xl border-2 hover:bg-slate-50 group/heart transition-[background-color,border-color,transform]",
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
      </div>
    )
  }

  // Grid & Mini variants
  return (
    <div
      className={cn(
        "group bg-white border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-slate-200/50 transition-[transform,box-shadow,border-color] duration-300 flex flex-col h-full",
        variant !== 'mini' && "hover:-translate-y-2",
        variant === 'mini' ? 'rounded-2xl p-2' : 'rounded-[32px]',
        className
      )}
    >
      {/* Image Container */}
      <div className={cn(
        "relative overflow-hidden shrink-0",
        variant === 'mini' ? 'aspect-video rounded-xl' : 'aspect-[4/3]'
      )}>
        <OptimizedImage
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
        />
        
        {variant !== 'mini' && (
          <>
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <Badge className={cn(
                "border-none shadow-md uppercase text-[10px] font-black tracking-wider px-3 py-1 rounded-full",
                property.type === 'buy' ? 'bg-[#1A56DB] text-white' : 'bg-emerald-500 text-white'
              )}>
                For {property.type}
              </Badge>
            </div>
            
            <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
              <Button 
                size="icon" 
                onClick={handleWishlistClick}
                className={cn(
                  "w-10 h-10 rounded-2xl bg-white/95 shadow-xl hover:bg-white transition-all",
                  isWishlisted ? "text-red-500" : "text-slate-900 hover:text-red-500"
                )}
              >
                <Heart className={cn("w-5 h-5", isWishlisted && "fill-current")} />
              </Button>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
              <p className="text-white font-black text-2xl tracking-tight">{formatIndianPrice(price)}</p>
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
            "font-black text-[#1A56DB] uppercase tracking-widest",
            variant === 'mini' ? 'text-[8px]' : 'text-[10px] mb-1'
          )}>{property.category}</p>
          <h3 className={cn(
            "font-black text-slate-900 group-hover:text-[#1A56DB] transition-colors",
            variant === 'mini' ? 'text-xs truncate' : 'text-xl'
          )}>
            {title}
          </h3>
          <div className="flex items-center text-slate-500 text-xs font-medium mt-1">
            <MapPin className="w-3.5 h-3.5 mr-1.5 shrink-0 text-[#1A56DB]" />
            <span className="truncate">{location}</span>
          </div>
        </div>

        {variant !== 'mini' && (
          <div className="pt-4 border-t border-slate-50 flex items-center justify-between text-slate-600">
            <div className="flex flex-col items-center gap-1">
              <BedDouble className="w-5 h-5 text-slate-300" />
              <span className="text-xs font-bold text-slate-900">{beds} <span className="text-[10px] text-slate-400 font-medium">Beds</span></span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Bath className="w-5 h-5 text-slate-300" />
              <span className="text-xs font-bold text-slate-900">{baths} <span className="text-[10px] text-slate-400 font-medium">Baths</span></span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Square className="w-5 h-5 text-slate-300" />
              <span className="text-xs font-bold text-slate-900">{area} <span className="text-[10px] text-slate-400 font-medium">Sq.Ft</span></span>
            </div>
          </div>
        )}

        <div className="pt-2">
          <Link href={`/property/${property.id}`}>
            <Button className={cn(
              "w-full font-black transition-all duration-300",
              variant === 'mini' ? 'h-8 text-[10px] rounded-lg' : 'h-12 bg-slate-50 hover:bg-[#1A56DB] hover:text-white text-slate-900 shadow-sm rounded-2xl transition-[background-color,color,box-shadow]'
            )}>
              {variant === 'mini' ? 'View' : 'View Property'}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
