"use client"

import { motion } from "framer-motion"
import { SearchBar } from "@/components/shared/search-bar"
import { StatCounter } from "@/components/shared/stat-counter"
import { PropertyCard } from "@/components/shared/property-card"
import { 
  Building2, 
  CheckCircle2, 
  Users2, 
  MapPin
} from "lucide-react"
import Link from "next/link"

const popularCities = [
  { name: "Ahmedabad", icon: "🏙️" },
  { name: "Surat", icon: "🏙️" },
  { name: "Vadodara", icon: "🏙️" },
  { name: "Rajkot", icon: "🏙️" },
  { name: "Mumbai", icon: "🏙️" },
  { name: "Pune", icon: "🏙️" },
  { name: "Bengaluru", icon: "🏙️" },
  { name: "Hyderabad", icon: "🏙️" },
]

const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 1, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-24 pb-12 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#1A56DB 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
      </div>

      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center lg:text-left space-y-8"
        >
          <div className="space-y-4">
            <motion.h1 
              variants={itemVariants}
              className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1]"
            >
              Find Your Dream <br />
              <span className="text-primary italic">Property in India</span>
            </motion.h1>
            <motion.p 
              variants={itemVariants}
              className="text-lg md:text-xl text-slate-500 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              Discover verified flats, villas, and plots across India&apos;s fastest growing cities. Buy, rent, or sell with confidence.
            </motion.p>
          </div>

          <motion.div variants={itemVariants} className="w-full">
            <SearchBar />
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Popular Cities</p>
            <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
              {popularCities.map((city) => (
                <Link 
                  key={city.name} 
                  href={`/search?city=${city.name}`}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-pill shadow-sm hover:border-primary hover:text-primary transition-all whitespace-nowrap text-sm font-semibold group"
                >
                  <span className="group-hover:scale-110 transition-transform">{city.icon}</span>
                  {city.name}
                </Link>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Right Content - Mockup */}
        <div className="hidden lg:block relative h-[500px]">
          <motion.div
            initial={{ y: 20, opacity: 1 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="absolute top-0 right-0 z-10"
          >
            <div
              className="w-[320px] transition-transform duration-500 hover:-translate-y-2"
            >
              <PropertyCard
                property={{
                  id: "mock-1",
                  title: "Skyline Residency",
                  location: "Satellite, Ahmedabad",
                  price: 8500000,
                  type: "buy",
                  category: "Apartment",
                  beds: 3,
                  baths: 3,
                  area: 1850,
                  image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800",
                  is_featured: true
                }}
                className="shadow-2xl shadow-primary/10 border-none"
              />
            </div>
          </motion.div>

          {/* Decorative Elements - Simplified */}
          <div className="absolute top-40 right-40 w-64 h-64 bg-primary/5 rounded-full -z-10"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-success/5 rounded-full -z-10"></div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="w-full max-w-6xl mx-auto mt-20 px-4">
        <div className="bg-white rounded-3xl border border-slate-100 p-8 md:p-12 shadow-xl shadow-slate-100/50">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            <StatCounter 
              value={10000} 
              suffix="+" 
              label="Properties" 
              icon={<Building2 className="w-6 h-6" />} 
            />
            <StatCounter 
              value={5000} 
              suffix="+" 
              label="Verified Listings" 
              icon={<CheckCircle2 className="w-6 h-6" />} 
            />
            <StatCounter 
              value={25000} 
              suffix="+" 
              label="Happy Users" 
              icon={<Users2 className="w-6 h-6" />} 
            />
            <StatCounter 
              value={15} 
              suffix="+" 
              label="Cities" 
              icon={<MapPin className="w-6 h-6" />} 
            />
          </div>
        </div>
      </div>
    </section>
  )
}
