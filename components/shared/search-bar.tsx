"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, MapPin, Home, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const propertyTypes = ["Flat/Apartment", "Villa", "Plot/Land", "Commercial", "Shop", "PG/Hostel"]
const budgetRanges = ["Under ₹50L", "₹50L - ₹1Cr", "₹1Cr - ₹2Cr", "₹2Cr - ₹5Cr", "Above ₹5Cr"]

export function SearchBar({ className }: { className?: string }) {
  const router = useRouter()
  const [location, setLocation] = useState("")
  const [type, setType] = useState("Property Type")
  const [budget, setBudget] = useState("Budget")

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (location) params.set("location", location)
    if (type !== "Property Type") params.set("type", type)
    if (budget !== "Budget") params.set("budget", budget)
    router.push(`/search?${params.toString()}`)
  }

  return (
    <div className={cn(
      "w-full max-w-4xl bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-2 md:p-3 border border-slate-100 flex flex-col md:flex-row items-stretch md:items-center gap-2",
      className
    )}>
      {/* Location */}
      <div className="flex-1 flex items-center px-4 py-2 border-b md:border-b-0 md:border-r border-slate-100">
        <MapPin className="w-5 h-5 text-primary mr-3 shrink-0" />
        <input
          type="text"
          placeholder="Enter City, Locality or Project..."
          className="w-full bg-transparent border-none outline-none text-sm font-medium text-slate-800 placeholder:text-slate-400"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      {/* Type Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger className="flex-1 flex items-center justify-between px-4 py-2 border-b md:border-b-0 md:border-r border-slate-100 hover:bg-slate-50 transition-colors rounded-lg outline-none">
          <div className="flex items-center text-left">
            <Home className="w-5 h-5 text-primary mr-3 shrink-0" />
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Type</p>
              <p className="text-sm font-semibold text-slate-800 line-clamp-1">{type}</p>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[200px]">
          {propertyTypes.map((t) => (
            <DropdownMenuItem key={t} onClick={() => setType(t)}>
              {t}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Budget Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger className="flex-1 flex items-center justify-between px-4 py-2 hover:bg-slate-50 transition-colors rounded-lg outline-none">
          <div className="flex items-center text-left">
            <span className="w-5 h-5 flex items-center justify-center text-primary font-bold mr-3 shrink-0 text-lg">₹</span>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Budget</p>
              <p className="text-sm font-semibold text-slate-800 line-clamp-1">{budget}</p>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[200px]">
          {budgetRanges.map((b) => (
            <DropdownMenuItem key={b} onClick={() => setBudget(b)}>
              {b}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Search Button */}
      <Button 
        onClick={handleSearch}
        className="bg-primary hover:bg-primary-dark text-white px-8 py-6 rounded-xl font-bold flex items-center gap-2 group shadow-lg shadow-primary/20"
      >
        <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
        <span className="md:hidden lg:inline">Search Properties</span>
      </Button>
    </div>
  )
}
