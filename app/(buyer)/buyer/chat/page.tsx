"use client"

import { useEffect, useState, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { 
  Send, 
  Search, 
  MessageSquare, 
  User, 
  MoreVertical,
  ChevronLeft,
  Loader2,
  Clock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { formatRelative } from "date-fns"
import { ChatMessageSkeleton } from "@/components/ui/skeleton"

export default function BuyerChatPage() {
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [conversations, setConversations] = useState<any[]>([])
  const [activeConversation, setActiveConversation] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        fetchConversations(user.id)
      }
    }
    init()
  }, [])

  useEffect(() => {
    if (activeConversation) {
      fetchMessages(activeConversation.id)
      
      // Subscribe to real-time messages
      const channel = supabase
        .channel(`messages:${activeConversation.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `conversation_id=eq.${activeConversation.id}`
          },
          (payload) => {
            setMessages((prev) => [...prev, payload.new])
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }, [activeConversation])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const fetchConversations = async (userId: string) => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from("conversations")
        .select(`
          *,
          property:property_id (property_name, images),
          owner:owner_id (full_name, avatar_url)
        `)
        .eq("buyer_id", userId)
        .order("updated_at", { ascending: false })

      if (error) throw error
      setConversations(data || [])
      if (data && data.length > 0) {
        setActiveConversation(data[0])
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchMessages = async (convId: string) => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", convId)
        .order("created_at", { ascending: true })

      if (error) throw error
      setMessages(data || [])
    } catch (e) {
      console.error(e)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !activeConversation || !user) return

    setIsSending(true)
    try {
      const messageObj = {
        conversation_id: activeConversation.id,
        sender_id: user.id,
        content: newMessage.trim(),
      }

      const { error } = await (supabase.from("messages") as any).insert(messageObj)
      if (error) throw error
      
      // Update last message in conversation
      await (supabase.from("conversations") as any).update({
        last_message: newMessage.trim(),
        updated_at: new Date().toISOString()
      }).eq("id", activeConversation.id)

      setNewMessage("")
    } catch (e) {
      console.error(e)
    } finally {
      setIsSending(false)
    }
  }

  if (isLoading) {
    return (
      <div className="pt-24 min-h-screen bg-slate-50 flex flex-col">
        <div className="container mx-auto px-4 flex-1 flex flex-col py-6">
          <div className="flex-1 bg-white rounded-[40px] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden flex flex-col md:flex-row">
            <aside className="w-full md:w-[350px] border-r border-slate-100 flex flex-col bg-slate-50/50 p-6 space-y-4">
              <div className="h-10 w-32 bg-slate-200 animate-pulse rounded-lg mb-4" />
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex gap-4 items-center p-4 bg-white rounded-3xl border border-slate-50">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-24 bg-slate-100 animate-pulse rounded-full" />
                    <div className="h-2 w-32 bg-slate-100 animate-pulse rounded-full" />
                  </div>
                </div>
              ))}
            </aside>
            <main className="flex-1 p-8 space-y-6 bg-white">
              <ChatMessageSkeleton align="left" />
              <ChatMessageSkeleton align="right" />
              <ChatMessageSkeleton align="left" />
              <ChatMessageSkeleton align="left" />
              <ChatMessageSkeleton align="right" />
            </main>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 min-h-screen bg-slate-50 flex flex-col">
      <div className="container mx-auto px-4 flex-1 flex flex-col py-6">
        
        {/* Chat Wrapper */}
        <div className="flex-1 bg-white rounded-[40px] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden flex flex-col md:flex-row h-[calc(100vh-160px)] md:h-[calc(100vh-180px)] mb-20 md:mb-0">
          
          {/* Conversation List */}
          <aside className={cn(
            "w-full md:w-[350px] border-r border-slate-100 flex flex-col bg-slate-50/50",
            activeConversation && "hidden md:flex"
          )}>
            <div className="p-6 border-b border-slate-100 bg-white">
               <h2 className="text-2xl font-black text-slate-900 italic tracking-tight mb-6">Messages</h2>
               <div className="relative">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                 <Input 
                   placeholder="Search chats..." 
                   className="pl-12 h-12 rounded-2xl bg-slate-100 border-none font-bold text-sm"
                 />
               </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setActiveConversation(conv)}
                  className={cn(
                    "w-full p-4 rounded-3xl flex items-center gap-4 transition-all duration-300",
                    activeConversation?.id === conv.id 
                      ? "bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02]" 
                      : "bg-white hover:bg-slate-100 text-slate-900 border border-slate-50"
                  )}
                >
                  <Avatar className="w-14 h-14 border-2 border-white/20">
                    <AvatarImage src={conv.owner?.avatar_url} />
                    <AvatarFallback className="bg-white/20 font-black">
                      {conv.owner?.full_name?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <p className="font-black text-sm truncate">{conv.owner?.full_name}</p>
                    <p className={cn(
                      "text-xs font-bold line-clamp-1 opacity-70",
                      activeConversation?.id === conv.id ? "text-white" : "text-slate-500"
                    )}>
                      {conv.property?.property_name}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </aside>

          {/* Chat Window */}
          <main className={cn(
            "flex-1 flex flex-col bg-white",
            !activeConversation && "hidden md:flex items-center justify-center p-20 text-center"
          )}>
            {!activeConversation ? (
              <div className="space-y-6">
                 <div className="w-24 h-24 rounded-[40px] bg-slate-100 flex items-center justify-center mx-auto">
                    <MessageSquare className="w-10 h-10 text-slate-300" />
                 </div>
                 <div>
                    <h3 className="text-2xl font-black text-slate-900 italic tracking-tight">Your Inbox</h3>
                    <p className="text-slate-500 font-bold mt-2">Connect with property owners instantly.</p>
                 </div>
              </div>
            ) : (
              <>
                {/* Header */}
                <header className="p-4 md:p-6 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="md:hidden rounded-2xl"
                      onClick={() => setActiveConversation(null)}
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </Button>
                    <Avatar className="w-12 h-12 shadow-md">
                      <AvatarImage src={activeConversation.owner?.avatar_url} />
                      <AvatarFallback className="bg-primary text-white font-black">
                        {activeConversation.owner?.full_name?.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-black text-slate-900">{activeConversation.owner?.full_name}</h4>
                      <p className="text-[10px] font-black text-primary uppercase tracking-widest">
                        Re: {activeConversation.property?.property_name}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="rounded-2xl">
                    <MoreVertical className="w-5 h-5" />
                  </Button>
                </header>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
                  {messages.map((msg) => {
                    const isMe = msg.sender_id === user?.id
                    return (
                      <div 
                        key={msg.id} 
                        className={cn(
                          "flex flex-col max-w-[80%]",
                          isMe ? "ml-auto items-end" : "items-start"
                        )}
                      >
                        <div className={cn(
                          "p-4 rounded-3xl text-sm font-bold shadow-sm",
                          isMe 
                            ? "bg-slate-900 text-white rounded-tr-none" 
                            : "bg-white text-slate-900 border border-slate-100 rounded-tl-none"
                        )}>
                          {msg.content}
                        </div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2 px-2 flex items-center gap-1">
                          <Clock className="w-2 h-2" />
                          {formatRelative(new Date(msg.created_at), new Date())}
                        </span>
                      </div>
                    )
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <footer className="p-6 border-t border-slate-100">
                  <form onSubmit={handleSendMessage} className="flex gap-4">
                    <Input 
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..." 
                      className="h-14 rounded-2xl bg-slate-50 border-none font-bold text-sm px-6"
                    />
                    <Button 
                      type="submit" 
                      disabled={isSending || !newMessage.trim()}
                      className="w-14 h-14 rounded-2xl bg-primary text-white shadow-xl shadow-primary/20 transition-all hover:scale-110 shrink-0"
                    >
                      {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-6 h-6" />}
                    </Button>
                  </form>
                </footer>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
