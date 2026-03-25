"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { 
  Phone, 
  Paperclip, 
  Send, 
  ArrowLeft, 
  Check, 
  CheckCheck,
  ImageIcon,
  ExternalLink,
  ChevronDown,
  MoreVertical
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"

// Mock data
const mockChats = [
  {
    id: "c1",
    property: {
      name: "3BHK Satellite Apartment",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800",
      price: "₹65 Lakh",
      locality: "Satellite, Ahmedabad"
    },
    owner: { name: "Rajesh Kumar", avatar: "R", phone: "9876543210" },
  }
]

const mockMessages = [
  { id: 1, sender: "owner", text: "Hello! Thank you for your interest in the Satellite apartment.", time: "10:00 AM" },
  { id: 2, sender: "me", text: "Hi Rajesh, I saw the listing and really liked it. Is the price negotiable?", time: "10:05 AM" },
  { id: 3, sender: "owner", text: "Yes, we can discuss it during the visit. Would you like to schedule one?", time: "10:10 AM", status: "read" },
  { id: 4, sender: "me", text: "Is it possible to visit this Sunday morning?", time: "10:15 AM", status: "sent" },
]

export default function ChatDetailPage() {
  const params = useParams()
  const router = useRouter()
  const enquiryId = params.enquiryId as string
  
  // Find chat by ID (mock)
  const selectedChat = mockChats[0] // Defaulting to c1 for demo
  
  const [message, setMessage] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [])

  return (
    <div className="h-[calc(100vh-160px)] bg-white rounded-[40px] border border-slate-100 shadow-2xl overflow-hidden flex flex-col relative max-w-5xl mx-auto">
      {/* Thread Header */}
      <div className="h-24 px-6 border-b flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-xl border border-slate-100"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-primary font-black shadow-sm">
            {selectedChat.owner.avatar}
          </div>
          <div className="space-y-0.5">
            <h3 className="font-black text-slate-900 leading-tight">{selectedChat.owner.name}</h3>
            <Link href={`/property/${selectedChat.id}`} className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
              {selectedChat.property.name} <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" className="rounded-xl h-11 w-11 border-slate-100 hover:bg-slate-50 text-slate-400">
            <Phone className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-xl h-11 w-11 border-slate-100 hover:bg-slate-50 text-slate-400">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Property Mini Banner */}
      <div className="px-6 py-4 bg-slate-50/50 border-b flex items-center justify-between gap-4 group cursor-pointer hover:bg-slate-50 transition-colors">
        <div className="flex items-center gap-4 overflow-hidden">
          <div className="w-12 h-12 rounded-xl overflow-hidden relative shrink-0 border border-white">
            <Image src={selectedChat.property.image} alt="" fill className="object-cover" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-black text-slate-900 truncate tracking-tight">{selectedChat.property.price}</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">{selectedChat.property.locality}</p>
          </div>
        </div>
        <ChevronDown className="w-4 h-4 text-slate-300 group-hover:text-primary transition-all" />
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed opacity-[0.98]"
      >
        <div className="flex justify-center">
          <span className="px-4 py-1.5 rounded-full bg-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest">Today</span>
        </div>

        {mockMessages.map((msg) => (
          <motion.div 
            key={msg.id}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={cn(
              "flex flex-col max-w-[80%]",
              msg.sender === "me" ? "ml-auto items-end" : "mr-auto items-start"
            )}
          >
            <div className={cn(
              "px-5 py-3.5 rounded-[24px] shadow-sm relative group",
              msg.sender === "me" 
                ? "bg-primary text-white rounded-tr-none shadow-primary/20" 
                : "bg-white border border-slate-100 rounded-tl-none text-slate-700"
            )}>
              <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
            </div>
            <div className="flex items-center gap-1.5 mt-2 px-1">
              <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{msg.time}</span>
              {msg.sender === "me" && (
                msg.status === "read" ? <CheckCheck className="w-3 h-3 text-blue-400" /> : <Check className="w-3 h-3 text-slate-300" />
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Message Input */}
      <div className="p-6 bg-white border-t">
        <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-[28px] border border-slate-100 focus-within:bg-white focus-within:border-primary/20 focus-within:shadow-xl focus-within:shadow-slate-200/50 transition-all">
          <Button variant="ghost" size="icon" className="rounded-full h-12 w-12 text-slate-400 hover:text-primary">
            <Paperclip className="w-5 h-5" />
          </Button>
          <Input 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="border-none bg-transparent h-12 shadow-none focus-visible:ring-0 font-medium text-slate-700"
          />
          <Button variant="ghost" size="icon" className="rounded-full h-12 w-12 text-slate-400 hover:text-primary mr-1">
            <ImageIcon className="w-5 h-5" />
          </Button>
          <Button 
            className={cn(
              "rounded-2xl h-12 w-12 p-0 shadow-lg transition-all active:scale-95",
              message.length > 0 ? "bg-primary text-white shadow-primary/30" : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
            )}
            disabled={message.length === 0}
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
