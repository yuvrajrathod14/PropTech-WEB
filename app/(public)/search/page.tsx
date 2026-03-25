"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import { 
  Search, 
  Map as MapIcon, 
  Grid, 
  List, 
  Settings2, 
  X,
  MapPin,
  Home,
  Zap,
  LayoutGrid,
  Filter,
  RefreshCcw
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { PropertyCard } from "@/components/shared/property-card"
import { cn, formatIndianPrice } from "@/lib/utils"
import { PropertyCardSkeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/ui/empty-state"
import { ErrorState } from "@/components/ui/error-state"

// Helper to format Indian currency for sliders (simplified for UI)
const formatCurrencyCompact = (val: number) => {
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)} Cr`
  if (val >= 100000) return `₹${(val / 100000).toFixed(0)} L`
  return `₹${val.toLocaleString('en-IN')}`
}

interface FiltersProps {
  isMobile?: boolean;
  city: string;
  setCity: (city: string) => void;
  priceRange: number[];
  setPriceRange: (range: number[]) => void;
  selectedTypes: string[];
  toggleType: (type: string) => void;
  selectedBHK: string[];
  toggleBHK: (bhk: string) => void;
  resetFilters: () => void;
}

const Filters = ({ isMobile = false, city, setCity, priceRange, setPriceRange, selectedTypes, toggleType, selectedBHK, toggleBHK, resetFilters }: FiltersProps) => (
  <div className={cn("space-y-8 pb-8", isMobile ? "px-6" : "sticky top-24")}>
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
        <Filter className="w-5 h-5 text-[#1A56DB]" />
        Filters
      </h2>
      <span 
        role="button"
        onClick={resetFilters}
        className="text-xs font-bold text-slate-400 hover:text-[#1A56DB] transition-colors cursor-pointer"
      >
        Reset All
      </span>
    </div>

    <Accordion type="multiple" defaultValue={["search", "location", "type", "bhk", "budget"]} className="space-y-1">
      
      {/* Search */}
      <AccordionItem value="search" className="border-none">
        <AccordionTrigger className="hover:no-underline py-4 text-sm font-black text-slate-800 uppercase tracking-widest">
          Search
        </AccordionTrigger>
        <AccordionContent className="pt-2">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Developer, project, or keyword..." 
              className="pl-10 h-10 bg-slate-50 border-none rounded-xl text-sm font-bold focus-visible:ring-[#1A56DB]/20"
            />
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Location */}
      <AccordionItem value="location" className="border-none">
        <AccordionTrigger className="hover:no-underline py-4 text-sm font-black text-slate-800 uppercase tracking-widest">
          Location
        </AccordionTrigger>
        <AccordionContent className="pt-2 space-y-4">
          <Select value={city} onValueChange={setCity}>
            <SelectTrigger className="h-10 border-none bg-slate-50 rounded-xl font-bold text-sm">
              <SelectValue placeholder="Select City" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Ahmedabad">Ahmedabad</SelectItem>
              <SelectItem value="Surat">Surat</SelectItem>
              <SelectItem value="Vadodara">Vadodara</SelectItem>
              <SelectItem value="Rajkot">Rajkot</SelectItem>
              <SelectItem value="Mumbai">Mumbai</SelectItem>
            </SelectContent>
          </Select>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search Locality..." 
              className="pl-10 h-10 bg-slate-50 border-none rounded-xl text-sm font-bold"
            />
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Property Type */}
      <AccordionItem value="type" className="border-none">
        <AccordionTrigger className="hover:no-underline py-4 text-sm font-black text-slate-800 uppercase tracking-widest">
          Property Type
        </AccordionTrigger>
        <AccordionContent className="pt-2">
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Flat", icon: Home, id: 'flat' },
              { label: "Villa", icon: Home, id: 'villa' },
              { label: "Plot", icon: LayoutGrid, id: 'plot' },
              { label: "Office", icon: Zap, id: 'office' },
            ].map((item) => (
              <div 
                key={item.id}
                onClick={() => toggleType(item.id)}
                className={cn(
                  "p-3 rounded-xl cursor-pointer border-2 transition-all flex flex-col items-center gap-2",
                  selectedTypes.includes(item.id) 
                    ? "border-[#1A56DB] bg-[#1A56DB]/5 text-[#1A56DB]" 
                    : "border-slate-50 bg-slate-50 text-slate-500 hover:border-slate-200"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* BHK */}
      <AccordionItem value="bhk" className="border-none">
        <AccordionTrigger className="hover:no-underline py-4 text-sm font-black text-slate-800 uppercase tracking-widest">
          BHK Config
        </AccordionTrigger>
        <AccordionContent className="pt-2">
          <div className="flex flex-wrap gap-2">
            {['1', '2', '3', '4', '5+'].map((val) => (
              <div 
                key={val}
                onClick={() => toggleBHK(val)}
                className={cn(
                  "px-4 py-2 rounded-xl cursor-pointer font-bold text-xs transition-all",
                  selectedBHK.includes(val)
                    ? "bg-[#1A56DB] text-white shadow-lg shadow-[#1A56DB]/20"
                    : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                )}
              >
                {val} BHK
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Budget */}
      <AccordionItem value="budget" className="border-none">
        <AccordionTrigger className="hover:no-underline py-4 text-sm font-black text-slate-800 uppercase tracking-widest">
          Budget (₹)
        </AccordionTrigger>
        <AccordionContent className="pt-2 space-y-6">
          <div className="flex items-center justify-between text-xs font-black text-slate-500 tracking-widest uppercase">
            <span>{formatCurrencyCompact(priceRange[0])}</span>
            <span>{formatCurrencyCompact(priceRange[1])}</span>
          </div>
          <Slider 
            min={0} 
            max={100000000} 
            step={100000} 
            value={priceRange} 
            onValueChange={setPriceRange}
            className="py-4"
          />
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Min Price</Label>
              <Input value={priceRange[0]} className="h-10 bg-slate-50 border-none font-bold" />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Max Price</Label>
              <Input value={priceRange[1]} className="h-10 bg-slate-50 border-none font-bold" />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
)

function SearchContent() {
  const router = useRouter()
  const supabase = createClient()
  const searchParams = useSearchParams()
  
  const [view, setView] = useState<"grid" | "list">("grid")
  const [showMap, setShowMap] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [properties, setProperties] = useState<any[]>([])
  
  // Pagination & Wishlist States
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set())
  const pageSize = 12
  
  // Filter States
  const [priceRange, setPriceRange] = useState([500000, 100000000])
  const [selectedBHK, setSelectedBHK] = useState<string[]>([])
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [city, setCity] = useState(searchParams.get("city") || "Ahmedabad")
  const [sortBy, setSortBy] = useState("newest")
  
  const fetchProperties = async () => {
    setLoading(true)
    setError(null)
    try {
      let query = (supabase.from("properties") as any)
        .select("*", { count: 'exact' })
        .eq("status", "live")
      
      if (city) query = query.ilike('address', `%${city}%`)
      if (selectedBHK.length > 0) query = query.in('bhk', selectedBHK.map(b => b.replace('+', '')))
      if (selectedTypes.length > 0) query = query.in('type', selectedTypes)
      
      query = query.gte('price', priceRange[0]).lte('price', priceRange[1])

      const from = (page - 1) * pageSize
      const to = from + pageSize - 1

      const { data, error: fetchError, count } = await query
        .order(sortBy === 'price-low' ? 'price' : 'updated_at', { 
          ascending: sortBy === 'price-low',
          nullsFirst: false 
        })
        .range(from, to)

      if (fetchError) throw fetchError
      setProperties(data || [])
      setTotalCount(count || 0)
    } catch (err: any) {
      console.error("Search error:", err)
      setError(err.message || "Failed to fetch properties")
    } finally {
      setLoading(false)
    }
  }

  const resetFilters = () => {
    setCity("Ahmedabad")
    setSelectedBHK([])
    setSelectedTypes([])
    setPriceRange([500000, 100000000])
    setPage(1)
  }

  // Fetch Wishlist
  useEffect(() => {
    const fetchWishlist = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return
      
      const { data } = await supabase
        .from("wishlist")
        .select("property_id")
        .eq("user_id", session.user.id)
      
      if (data) {
        setWishlistIds(new Set(data.map((w: any) => w.property_id)))
      }
    }
    fetchWishlist()
  }, [supabase])

  const handleToggleWishlist = async (propertyId: string) => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return router.push("/login")

    const isCurrentlyWishlisted = wishlistIds.has(propertyId)
    
    // Optimistic Update
    setWishlistIds(prev => {
      const next = new Set(prev)
      if (isCurrentlyWishlisted) next.delete(propertyId)
      else next.add(propertyId)
      return next
    })

    try {
      if (isCurrentlyWishlisted) {
        await (supabase.from("wishlist") as any)
          .delete()
          .eq("user_id", session.user.id)
          .eq("property_id", propertyId)
      } else {
        await (supabase.from("wishlist") as any)
          .insert({ user_id: session.user.id, property_id: propertyId })
      }
    } catch (error) {
      console.error("Wishlist toggle error:", error)
      // Rollback on error
      setWishlistIds(prev => {
        const next = new Set(prev)
        if (isCurrentlyWishlisted) next.add(propertyId)
        else next.delete(propertyId)
        return next
      })
    }
  }

  useEffect(() => {
    fetchProperties()
  }, [page, city, priceRange, selectedBHK, selectedTypes, sortBy, supabase])

  // Reset page on filter change
  useEffect(() => {
    setPage(1)
  }, [city, priceRange, selectedBHK, selectedTypes, sortBy])

  const toggleBHK = (val: string) => {
    setSelectedBHK(prev => 
      prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]
    )
  }

  const toggleType = (val: string) => {
    setSelectedTypes(prev => 
      prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]
    )
  }

  const filterProps = {
    city, setCity,
    priceRange, setPriceRange,
    selectedTypes, toggleType,
    selectedBHK, toggleBHK,
    resetFilters
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block w-72 shrink-0">
            <Filters {...filterProps} />
          </aside>

          {/* Results Area */}
          <main className={cn("flex-1 space-y-8 transition-all duration-500", showMap && "lg:max-w-xl")}>
            
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  {loading ? "Discovering..." : `${totalCount} Properties in ${city}`}
                </h1>
                <p className="text-slate-500 font-medium text-sm">Hand-picked verified listings matching your search.</p>
              </div>

              <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-100 self-start md:self-center">
                <div className="flex items-center gap-1 border-r border-slate-100 pr-3 mr-2">
                  <Button 
                    size="sm" 
                    variant={view === 'grid' ? 'default' : 'ghost'} 
                    onClick={() => setView('grid')}
                    className="h-9 w-9 p-0 rounded-xl"
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant={view === 'list' ? 'default' : 'ghost'} 
                    onClick={() => setView('list')}
                    className="h-9 w-9 p-0 rounded-xl"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
                
                <Button 
                  onClick={() => setShowMap(!showMap)}
                  size="sm" 
                  variant="ghost" 
                  className={cn("rounded-xl h-9 px-4 font-bold gap-2", showMap && "bg-[#1A56DB] text-white hover:bg-[#1341A8] hover:text-white")}
                >
                  <MapIcon className="w-4 h-4" />
                  {showMap ? "Hide Map" : "Show Map"}
                </Button>

                <div className="hidden sm:block">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="h-9 border-none bg-slate-50 rounded-xl font-bold text-xs min-w-[140px]">
                      <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Drawer>
                  <DrawerTrigger asChild>
                    <div 
                      role="button"
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-bold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-slate-100 hover:text-accent-foreground lg:hidden h-9 px-4 gap-2 cursor-pointer border border-transparent"
                    >
                      <Settings2 className="w-4 h-4" />
                      Filters
                    </div>
                  </DrawerTrigger>
                  <DrawerContent className="h-[90vh]">
                    <div className="mx-auto w-full max-w-sm overflow-y-auto pb-10">
                      <DrawerHeader>
                        <DrawerTitle className="text-3xl font-black p-4">Refine Search</DrawerTitle>
                      </DrawerHeader>
                      <Filters isMobile {...filterProps} />
                      <DrawerFooter className="px-6">
                        <Button className="w-full h-14 rounded-2xl font-black shadow-xl shadow-primary/20">Apply Filters</Button>
                      </DrawerFooter>
                    </div>
                  </DrawerContent>
                </Drawer>
              </div>
            </div>

            {/* Active Filters */}
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-white hover:bg-white text-slate-600 border border-slate-200 rounded-full px-3 py-1 font-bold gap-2 flex items-center">
                {city} <X className="w-3 h-3 cursor-pointer hover:text-red-500" />
              </Badge>
              <Badge className="bg-white hover:bg-white text-slate-600 border border-slate-200 rounded-full px-3 py-1 font-bold gap-2 flex items-center">
                {formatCurrencyCompact(priceRange[0])} - {formatCurrencyCompact(priceRange[1])} <X className="w-3 h-3 cursor-pointer hover:text-red-500" />
              </Badge>
            </div>

            {/* Error State */}
            {error && (
              <ErrorState 
                title="Failed to load properties"
                description={error}
                onRetry={fetchProperties}
              />
            )}

            {/* Main Grid/List View */}
            {!error && (
              <div className={cn(
                "grid gap-8",
                view === 'grid' ? (showMap ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3") : "grid-cols-1"
              )}>
                <AnimatePresence mode="popLayout">
                  {loading ? (
                    Array(6).fill(0).map((_, i) => (view === 'grid' ? <PropertyCardSkeleton key={i} /> : <div key={i} className="bg-white rounded-[32px] h-48 animate-pulse border border-slate-100" />))
                  ) : properties.length > 0 ? (
                    properties.map((property) => (
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        key={property.id}
                      >
                        <PropertyCard 
                          property={property} 
                          variant={view} 
                          isWishlisted={wishlistIds.has(property.id)}
                          onToggleWishlist={() => handleToggleWishlist(property.id)}
                        />
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-full py-12">
                      <EmptyState 
                        title="No properties found"
                        description="We couldn't find any properties matching your current filters. Try adjusting your criteria or resetting all filters."
                        actionLabel="Reset All Filters"
                        onAction={resetFilters}
                        icon={Search}
                      />
                    </div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Pagination */}
            {!loading && !error && totalCount > pageSize && (
              <div className="pt-12 flex justify-center">
                <div className="flex items-center gap-2 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="rounded-xl font-black text-[10px] uppercase tracking-widest px-4 hover:bg-slate-50 disabled:opacity-30"
                  >
                    Prev
                  </Button>
                  <div className="flex items-center gap-1">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
                        Page <span className="text-slate-900">{page}</span> of <span className="text-slate-900">{Math.ceil(totalCount / pageSize)}</span>
                      </span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setPage(p => p + 1)}
                    disabled={page * pageSize >= totalCount}
                    className="rounded-xl font-black text-[10px] uppercase tracking-widest px-4 hover:bg-slate-50 disabled:opacity-30"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </main>

          {/* Map Section - Full Column on Right */}
          {showMap && (
            <div className="hidden lg:block flex-1 h-[calc(100vh-140px)] sticky top-28 rounded-[40px] overflow-hidden border-4 border-white shadow-2xl">
              <div className="w-full h-full bg-slate-200 relative group">
                <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/72.5714,23.0225,12/1200x800?access_token=pk.eyJ1Ijoiam9obmRvZSIsImEiOiJjbDFhMmIzYTRjNWQzM2VwZXF6eGZpMW5oIn0.a1b2c3d4e5f6')] bg-cover bg-center">
                   <div className="absolute top-1/4 left-1/3 p-2 bg-[#1A56DB] text-white font-black text-xs rounded-full shadow-xl shadow-[#1A56DB]/40 flex items-center gap-1 cursor-pointer hover:scale-110 transition-transform">
                      ₹45L
                   </div>
                   <div className="absolute top-1/2 left-1/2 p-2 bg-[#1A56DB] text-white font-black text-xs rounded-full shadow-xl shadow-[#1A56DB]/40 flex items-center gap-1 cursor-pointer hover:scale-110 transition-transform">
                      ₹1.2Cr
                   </div>
                   <div className="absolute top-2/3 left-1/4 p-2 bg-[#1A56DB] text-white font-black text-xs rounded-full shadow-xl shadow-[#1A56DB]/40 flex items-center gap-1 cursor-pointer hover:scale-110 transition-transform">
                      ₹85L
                   </div>
                </div>

                <div className="absolute top-6 left-6 p-4 bg-white/90 backdrop-blur rounded-2xl shadow-xl border border-white/50 max-w-[200px]">
                   <h4 className="text-sm font-black text-slate-900 leading-tight">Live in {city}</h4>
                   <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase">Click markers to view details</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
       <div className="min-h-screen bg-slate-50 pt-24 flex items-center justify-center">
          <RefreshCcw className="w-8 h-8 animate-spin text-[#1A56DB]" />
       </div>
    }>
      <SearchContent />
    </Suspense>
  )
}
