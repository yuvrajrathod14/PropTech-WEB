"use client"

import { motion } from "framer-motion"
import { 
  Users, 
  Globe, 
  Building2, 
  ShieldCheck, 
  Heart, 
  Target, 
  MapPin, 
  Mail, 
  Phone,
  Sparkles,
  ArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const stats = [
  { label: "Properties Listed", value: "10k+", icon: Building2 },
  { label: "Happy Customers", value: "25k+", icon: Users },
  { label: "Cities Covered", value: "50+", icon: Globe },
  { label: "Verified Owners", value: "5k+", icon: ShieldCheck },
]

const founders = [
  {
    name: "Yuvraj",
    role: "Co-Founder & CEO",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    bio: "Passionate about revolutionizing real estate through technology and building long-term trust."
  },
  {
    name: "Ananya",
    role: "Co-Founder & CTO",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aria",
    bio: "Expert in scalable architectures and secure payment systems integration."
  },
  {
    name: "Vikram",
    role: "Head of Product",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sam",
    bio: "Building user-centric experiences that simplify complex property transactions for everyone."
  },
  {
    name: "Sanya",
    role: "Head of Operations",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
    bio: "Ensuring every listing and every owner on PropTech is verified and genuine."
  }
]

export function AboutContent() {
  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      {/* Hero Section */}
      <section className="container mx-auto px-4 mb-24">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 font-black text-sm mb-6"
          >
            <Sparkles className="w-4 h-4" />
            Our Mission
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-7xl font-black text-slate-900 mb-8 italic tracking-tight leading-[1.1]"
          >
            We&apos;re on a Mission to Make Real Estate Simple
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl text-slate-500 font-medium leading-relaxed"
          >
            PropTech was built because finding and listing property in India 
            shouldn&apos;t be complicated, expensive, or untrustworthy.
          </motion.p>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="py-24 bg-slate-900 text-white rounded-[64px] mx-4 mb-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url(https://www.transparenttextures.com/patterns/cubes.png)] opacity-10"></div>
        <div className="container mx-auto px-8 md:px-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-black mb-8 italic tracking-tight">The PropTech Story</h2>
              <div className="space-y-6 text-slate-400 text-lg font-medium">
                <p>
                  Founded in 2024, PropTech emerged from a simple observation: the real estate journey was broken. High commissions, fake listings, and poor communication were the norms.
                </p>
                <p>
                  We decided to build a platform that prioritizes transparency over everything else. By connecting buyers directly with verified owners and facilitating secure digital transactions, we&apos;ve eliminated the friction that used to define property deals.
                </p>
                <p>
                  Today, we&apos;re proud to be the fastest-growing property portal in India, helping thousands find their perfect place without the headaches.
                </p>
              </div>
              <div className="flex flex-wrap gap-8 mt-12">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400">
                    <Heart className="w-6 h-6" />
                  </div>
                  <span className="font-black italic tracking-tight text-xl">Transparency first</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400">
                    <Target className="w-6 h-6" />
                  </div>
                  <span className="font-black italic tracking-tight text-xl">User focused</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[32px] hover:bg-white/10 transition-colors"
                >
                  <stat.icon className="w-8 h-8 text-blue-400 mb-4" />
                  <div className="text-4xl font-black text-white mb-2 italic tracking-tight">{stat.value}</div>
                  <div className="text-slate-500 font-bold uppercase tracking-widest text-xs">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 mb-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 italic tracking-tight">Meet Our Founders</h2>
            <p className="text-slate-500 font-bold">The visionary team behind the revolution.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {founders.map((person, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group"
              >
                <div className="relative aspect-square rounded-[40px] overflow-hidden mb-6 bg-slate-100 shadow-xl shadow-slate-100 group-hover:shadow-blue-100 transition-all">
                  <img 
                    src={person.image} 
                    alt={person.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-1 tracking-tight italic">{person.name}</h3>
                <p className="text-blue-600 font-black text-sm mb-4">{person.role}</p>
                <p className="text-slate-500 font-medium text-sm leading-relaxed">{person.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Office Section */}
      <section className="py-24 bg-slate-50 rounded-[64px] mx-4 mb-24">
        <div className="container mx-auto px-8 md:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1">
              <div className="rounded-[40px] overflow-hidden grayscale hover:grayscale-0 transition-all duration-500 shadow-2xl border-8 border-white">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117506.3193268571!2d72.4832598502305!3d23.02024347712497!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e848aba5bd449%3A0x4fccd1170aff2f4!2sAhmedabad%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1711361956543!5m2!1sen!2sin" 
                  width="100%" 
                  height="450" 
                  style={{ border: 0 }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
            
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-8 italic tracking-tight">Our Ahmedabad Office</h2>
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center text-blue-600 shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 mb-1">Address</h4>
                    <p className="text-slate-500 font-medium">123, PropTech Hub, Corporate Road, Ahmedabad, Gujarat 380051</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center text-blue-600 shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 mb-1">Phone</h4>
                    <p className="text-slate-500 font-medium">+91 79000 00000</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center text-blue-600 shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 mb-1">Email</h4>
                    <p className="text-slate-500 font-medium">hello@proptech.com</p>
                  </div>
                </div>
              </div>
              
              <Button className="mt-12 bg-slate-900 text-white font-black h-16 px-10 rounded-2xl hover:bg-slate-800 shadow-xl shadow-slate-200" asChild>
                <Link href="/contact">Visit Us Today <ArrowRight className="w-5 h-5 ml-2" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 border-t border-slate-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-black text-slate-900 mb-12 italic tracking-tight underline decoration-blue-500 underline-offset-8">Join the Movement</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button size="lg" className="bg-blue-600 font-black h-14 rounded-2xl px-10 shadow-xl shadow-blue-100" asChild>
              <Link href="/register">Start Searching</Link>
            </Button>
            <Button size="lg" variant="outline" className="font-black h-14 rounded-2xl px-10 border-slate-200" asChild>
              <Link href="/pricing">List Property</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
