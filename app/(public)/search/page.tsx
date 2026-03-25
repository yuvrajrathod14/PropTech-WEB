"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
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
  Filter
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
// Removed unused formatIndianPrice import
import { mockProperties } from "@/lib/mock-data"
import { PropertyCard } from "@/components/shared/property-card"
import { cn } from "@/lib/utils"

// Helper to format Indian currency for sliders
const formatCurrency = (val: number) => {
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
}

const Filters = ({ isMobile = false, city, setCity, priceRange, setPriceRange, selectedTypes, toggleType, selectedBHK, toggleBHK }: FiltersProps) => (
  <div className={cn("space-y-8 pb-8", isMobile ? "px-6" : "sticky top-24")}>
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
        <Filter className="w-5 h-5 text-primary" />
        Filters
      </h2>
      <span 
        role="button"
        className="text-xs font-bold text-slate-400 hover:text-primary transition-colors cursor-pointer"
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
              className="pl-10 h-10 bg-slate-50 border-none rounded-xl text-sm font-bold focus-visible:ring-primary/20"
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
                    ? "border-primary bg-primary/5 text-primary" 
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
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
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
            <span>{formatCurrency(priceRange[0])}</span>
            <span>{formatCurrency(priceRange[1])}</span>
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

      {/* Area */}
      <AccordionItem value="area" className="border-none">
        <AccordionTrigger className="hover:no-underline py-4 text-sm font-black text-slate-800 uppercase tracking-widest">
          Area (Sq.Ft)
        </AccordionTrigger>
        <AccordionContent className="pt-2 space-y-4">
           <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <span>200 sqft</span>
            <span>10,000 sqft</span>
          </div>
          <Slider 
            min={200} 
            max={10000} 
            step={50} 
            defaultValue={[500, 5000]}
            className="py-4"
          />
        </AccordionContent>
      </AccordionItem>

      {/* Furnishing */}
      <AccordionItem value="furnishing" className="border-none">
        <AccordionTrigger className="hover:no-underline py-4 text-sm font-black text-slate-800 uppercase tracking-widest">
          Furnishing
        </AccordionTrigger>
        <AccordionContent className="pt-2">
          <div className="flex flex-wrap gap-2">
            {['Unfurnished', 'Semi-Furnished', 'Fully Furnished'].map((val) => (
              <Badge 
                key={val}
                variant="outline"
                className="px-4 py-2 rounded-xl cursor-pointer font-bold text-[10px] border-2 uppercase tracking-wider hover:bg-slate-50 transition-all data-[selected=true]:bg-primary data-[selected=true]:text-white data-[selected=true]:border-primary"
                data-selected={false}
              >
                {val}
              </Badge>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Amenities */}
      <AccordionItem value="amenities" className="border-none">
        <AccordionTrigger className="hover:no-underline py-4 text-sm font-black text-slate-800 uppercase tracking-widest">
          Amenities
        </AccordionTrigger>
        <AccordionContent className="pt-2">
          <div className="grid grid-cols-2 gap-y-3 gap-x-4">
            {['Parking', 'Lift', 'Gym', 'Pool', 'Security', 'Power Backup', 'Garden', 'Clubhouse'].map((amenity) => (
              <div key={amenity} className="flex items-center space-x-2">
                <Checkbox id={amenity} className="rounded-md border-2" />
                <label htmlFor={amenity} className="text-xs font-bold text-slate-600 cursor-pointer">{amenity}</label>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Posted Within */}
      <AccordionItem value="posted" className="border-none">
        <AccordionTrigger className="hover:no-underline py-4 text-sm font-black text-slate-800 uppercase tracking-widest">
          Posted Within
        </AccordionTrigger>
        <AccordionContent className="pt-2">
          <RadioGroup defaultValue="any" className="space-y-3">
            {[
              { label: "Last 24h", value: "24h" },
              { label: "Last 7 days", value: "7d" },
              { label: "Last 30 days", value: "30d" },
              { label: "Any time", value: "any" },
            ].map((item) => (
              <div key={item.value} className="flex items-center space-x-3">
                <RadioGroupItem value={item.value} id={item.value} className="border-2" />
                <Label htmlFor={item.value} className="text-xs font-bold text-slate-600 uppercase tracking-widest">{item.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
)

function SearchContent() {
  // Removed unused router
  const searchParams = useSearchParams()
  
  const [view, setView] = useState<"grid" | "list">("grid")
  const [showMap, setShowMap] = useState(false)
  const [loading, setLoading] = useState(true)
  const [properties] = useState(mockProperties)
  
  // Filter States
  const [priceRange, setPriceRange] = useState([500000, 50000000])
  const [selectedBHK, setSelectedBHK] = useState<string[]>([])
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [city, setCity] = useState("Ahmedabad")

  useEffect(() => {
    // Simulate fetching with filters
    setLoading(true)
    const timer = setTimeout(() => {
      setLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [searchParams, city, priceRange, selectedBHK, selectedTypes])

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
    selectedBHK, toggleBHK
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
                  {properties.length} Properties in {city}
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
                  className={cn("rounded-xl h-9 px-4 font-bold gap-2", showMap && "bg-primary text-white hover:bg-primary-dark hover:text-white")}
                >
                  <MapIcon className="w-4 h-4" />
                  {showMap ? "Hide Map" : "Show Map"}
                </Button>

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
                {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])} <X className="w-3 h-3 cursor-pointer hover:text-red-500" />
              </Badge>
            </div>

            {/* Main Grid/List View */}
            <div className={cn(
              "grid gap-8",
              view === 'grid' ? (showMap ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3") : "grid-cols-1"
            )}>
              <AnimatePresence mode="popLayout">
                {loading ? (
                   Array(6).fill(0).map((_, i) => (
                    <div key={i} className="bg-white rounded-[32px] h-96 animate-pulse border border-slate-100" />
                   ))
                ) : properties.length > 0 ? (
                  properties.map((property) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      key={property.id}
                    >
                      <PropertyCard property={property} variant={view} />
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full py-20 flex flex-col items-center justify-center text-center space-y-6">
                    <div className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center">
                      <Search className="w-12 h-12 text-slate-300" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-black text-slate-900">No properties found</h3>
                      <p className="text-slate-500 max-w-md mx-auto font-medium">We couldn&apos;t find any properties matching your current filters. Try adjusting your criteria or resetting all filters.</p>
                    </div>
                    <Button variant="outline" className="rounded-xl font-bold px-8 h-12">Reset All Filters</Button>
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Pagination */}
            <div className="pt-12 flex justify-center">
              <div className="flex items-center gap-2 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
                <Button variant="ghost" size="sm" className="rounded-xl font-bold">Prev</Button>
                {[1, 2, 3].map(i => (
                  <Button 
                    key={i} 
                    size="sm" 
                    variant={i === 1 ? 'default' : 'ghost'} 
                    className="h-9 w-9 rounded-xl font-bold"
                  >
                    {i}
                  </Button>
                ))}
                <span className="text-slate-300 mx-2">•••</span>
                <Button size="sm" variant="ghost" className="h-9 w-9 rounded-xl font-bold">12</Button>
                <Button variant="ghost" size="sm" className="rounded-xl font-bold">Next</Button>
              </div>
            </div>
          </main>

          {/* Map Section - Full Column on Right */}
          {showMap && (
            <div className="hidden lg:block flex-1 h-[calc(100vh-140px)] sticky top-28 rounded-[40px] overflow-hidden border-4 border-white shadow-2xl">
              <div className="w-full h-full bg-slate-200 relative group">
                <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/72.5714,23.0225,12/1200x800?access_token=pk.eyJ1Ijoiam9obmRvZSIsImEiOiJjbDFhMmIzYTRjNWQzM2VwZXF6eGZpMW5oIn0.a1b2c3d4e5f6')] bg-cover bg-center">
                   <div className="absolute top-1/4 left-1/3 p-2 bg-primary text-white font-black text-xs rounded-full shadow-xl shadow-primary/40 flex items-center gap-1 cursor-pointer hover:scale-110 transition-transform">
                      ₹45L
                   </div>
                   <div className="absolute top-1/2 left-1/2 p-2 bg-primary text-white font-black text-xs rounded-full shadow-xl shadow-primary/40 flex items-center gap-1 cursor-pointer hover:scale-110 transition-transform">
                      ₹1.2Cr
                   </div>
                   <div className="absolute top-2/3 left-1/4 p-2 bg-primary text-white font-black text-xs rounded-full shadow-xl shadow-primary/40 flex items-center gap-1 cursor-pointer hover:scale-110 transition-transform">
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
    <Suspense fallback={<div>Loading Search...</div>}>
      <SearchContent />
    </Suspense>
  )
}
