"use client"

import { motion } from "framer-motion"
import { 
  Building2, 
  Home, 
  Warehouse, 
  Map, 
  Building, 
  Store, 
  Bed, 
  Factory 
} from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

const propertyTypes = [
  { name: "Flat/Apartment", count: "2,450", icon: <Building2 className="w-6 h-6" /> },
  { name: "Villa", count: "850", icon: <Home className="w-6 h-6" /> },
  { name: "Independent House", count: "1,200", icon: <Warehouse className="w-6 h-6" /> },
  { name: "Plot/Land", count: "3,100", icon: <Map className="w-6 h-6" /> },
  { name: "Commercial", count: "640", icon: <Building className="w-6 h-6" /> },
  { name: "Shop", count: "420", icon: <Store className="w-6 h-6" /> },
  { name: "PG/Hostel", count: "1,150", icon: <Bed className="w-6 h-6" /> },
  { name: "Warehouse", count: "210", icon: <Factory className="w-6 h-6" /> },
]

export function PropertyTypeExplorer() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <motion.h2 
            initial={{ opacity: 1, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-black text-slate-900 tracking-tight"
          >
            Explore by Property Type
          </motion.h2>
          <motion.p 
            initial={{ opacity: 1, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 font-medium"
          >
            Find exactly what you&apos;re looking for with our curated property categories.
          </motion.p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {propertyTypes.map((type, index) => (
            <Link 
              key={type.name} 
              href={`/search?type=${encodeURIComponent(type.name)}`}
              className="block group"
            >
              <div
                className="bg-slate-50/50 border border-slate-100 rounded-2xl p-6 flex flex-col items-center text-center cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:border-primary hover:bg-white hover:shadow-xl hover:shadow-primary/5"
              >
                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform duration-300">
                  {type.icon}
                </div>
                <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors duration-300">{type.name}</h3>
                <Badge variant="outline" className="mt-3 bg-white text-slate-500 font-semibold border-slate-100">
                  {type.count} listings
                </Badge>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
