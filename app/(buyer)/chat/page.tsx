"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { 
  Search, 
  MoreVertical, 
  Phone, 
  Paperclip, 
  Send, 
  ArrowLeft, 
  Check, 
  CheckCheck,
  ImageIcon,
  ExternalLink,
  ChevronDown,
  MessageSquare
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"

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
    lastMessage: "Is it possible to visit this Sunday morning?",
    time: "2h ago",
    unreadCount: 2,
    active: true
  },
  {
    id: "c2",
    property: {
      name: "Luxury Villa in Shela",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800",
      price: "₹2.5 Cr",
      locality: "Shela, Ahmedabad"
    },
    owner: { name: "Sneha Patel", avatar: "S" },
    lastMessage: "The documents are ready for your review.",
    time: "Yesterday",
    unreadCount: 0
  }
]

const mockMessages = [
  { id: 1, sender: "owner", text: "Hello! Thank you for your interest in the Satellite apartment.", time: "10:00 AM" },
  { id: 2, sender: "me", text: "Hi Rajesh, I saw the listing and really liked it. Is the price negotiable?", time: "10:05 AM" },
  { id: 3, sender: "owner", text: "Yes, we can discuss it during the visit. Would you like to schedule one?", time: "10:10 AM", status: "read" },
  { id: 4, sender: "me", text: "Is it possible to visit this Sunday morning?", time: "10:15 AM", status: "sent" },
]

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<typeof mockChats[0]>(mockChats[0])
  const [isMobileThreadOpen, setIsMobileThreadOpen] = useState(false)
  const [message, setMessage] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [selectedChat])

  return (
    <div className="h-[calc(100vh-160px)] lg:h-[calc(100vh-120px)] bg-white rounded-[40px] border border-slate-100 shadow-2xl overflow-hidden flex relative">
      
      {/* Sidebar - Chat List */}
      <div className={cn(
        "w-full lg:w-96 border-r flex flex-col bg-slate-50/30",
        isMobileThreadOpen ? "hidden lg:flex" : "flex"
      )}>
        <div className="p-6 space-y-4 border-b bg-white">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Enquiries</h1>
            <Button variant="ghost" size="icon" className="rounded-xl">
              <MoreVertical className="w-5 h-5 text-slate-400" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search chats..." 
              className="pl-11 h-12 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-primary/20 transition-all font-medium"
            />
          </div>
          <div className="flex gap-2">
            {["All", "Unread", "By Property"].map((f, i) => (
              <Badge key={f} variant={i === 0 ? "default" : "outline"} className="px-4 py-1.5 rounded-lg cursor-pointer font-bold text-[10px] uppercase tracking-wider">
                {f}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {mockChats.map((chat) => (
            <div 
              key={chat.id}
              onClick={() => {
                setSelectedChat(chat)
                setIsMobileThreadOpen(true)
              }}
              className={cn(
                "p-4 rounded-3xl flex gap-4 cursor-pointer transition-all duration-300 group relative",
                selectedChat?.id === chat.id 
                  ? "bg-white shadow-xl shadow-slate-200/50 border border-slate-100" 
                  : "hover:bg-white/50"
              )}
            >
              <div className="w-14 h-14 rounded-2xl overflow-hidden relative shrink-0 shadow-sm">
                <Image src={chat.property.image} alt="" fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-black text-slate-900 truncate tracking-tight">{chat.property.name}</h3>
                  <span className="text-[10px] font-black text-slate-300 uppercase shrink-0">{chat.time}</span>
                </div>
                <p className="text-xs font-bold text-slate-400 truncate">{chat.owner.name}</p>
                <p className="text-[13px] font-medium text-slate-500 truncate group-hover:text-slate-900 transition-colors">
                  {chat.lastMessage}
                </p>
              </div>
              {chat.unreadCount > 0 && (
                <div className="absolute top-4 left-4 w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white shadow-lg -translate-x-1/2 -translate-y-1/2">
                  {chat.unreadCount}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Thread */}
      <div className={cn(
        "flex-1 flex flex-col bg-white",
        !isMobileThreadOpen ? "hidden lg:flex" : "flex"
      )}>
        {selectedChat ? (
          <>
            {/* Thread Header */}
            <div className="h-24 px-6 border-b flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="lg:hidden rounded-xl"
                  onClick={() => setIsMobileThreadOpen(false)}
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
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-6">
            <div className="w-32 h-32 rounded-[40px] bg-slate-50 flex items-center justify-center border-2 border-dashed border-slate-200">
              <MessageSquare className="w-12 h-12 text-slate-200" />
            </div>
            <div className="space-y-2 max-w-sm">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Select an enquiry</h3>
              <p className="text-slate-500 font-medium">Choose a chat from the sidebar to start discussing about properties.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
