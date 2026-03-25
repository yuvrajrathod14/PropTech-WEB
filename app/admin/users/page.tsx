"use client"

import { useState, useEffect } from "react"
import { 
  Search, 
  UserPlus, 
  ShieldCheck, 
  Mail, 
  Phone, 
  Calendar,
  Download,
  Ban,
  MoreHorizontal,
  UserCheck,
  History,
  Users
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { TableRowSkeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/ui/empty-state"

export default function AdminUsersPage() {
  const supabase = createClient()
  const [users, setUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      let query = (supabase.from("profiles") as any).select("*")
      
      if (filter === "buyers") query = query.eq("role", "buyer")
      if (filter === "owners") query = query.eq("role", "owner")
      if (filter === "blocked") query = query.eq("is_blocked", true)

      const { data, error } = await query.order("created_at", { ascending: false })
      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error("Error fetching admin users:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [filter])

  const handleToggleBlock = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await (supabase.from("profiles") as any)
        .update({ is_blocked: !currentStatus })
        .eq("id", userId)
      
      if (error) throw error
      
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_blocked: !currentStatus } : u))
    } catch (error) {
      console.error("Toggle block error:", error)
    }
  }

  const filteredUsers = users.filter(user => 
    (user.full_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.email || "").toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">Users</h1>
          <p className="text-slate-500 font-medium">Manage platform users, verify identities, and handle account status.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-12 rounded-2xl border-slate-100 bg-white font-black whitespace-nowrap text-[10px] uppercase tracking-widest gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </Button>
          <Button className="h-12 rounded-2xl bg-[#1A56DB] hover:bg-[#1A56DB]/90 text-white font-black px-6 shadow-xl shadow-[#1A56DB]/20 transition-all active:scale-95 italic">
            <UserPlus className="w-4 h-4 mr-2" /> Add User
          </Button>
        </div>
      </div>

      {/* Filters & Search */}
      <Card className="border-none shadow-sm rounded-[32px] p-4 bg-white flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search name or email..." 
                  className="pl-10 h-12 rounded-2xl bg-slate-50 border-none font-medium text-sm" 
                />
            </div>
            <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-2xl w-full md:w-auto">
                {["All", "Buyers", "Owners", "Blocked"].map((t) => (
                    <Button 
                        key={t}
                        variant={filter === t.toLowerCase() ? "secondary" : "ghost"}
                        onClick={() => setFilter(t.toLowerCase())}
                        className={cn(
                            "rounded-xl px-4 h-10 font-black text-[10px] uppercase tracking-widest transition-all flex-1 md:flex-none",
                            filter === t.toLowerCase() ? "bg-white text-[#1A56DB] shadow-sm" : "text-slate-500"
                        )}
                    >
                        {t}
                    </Button>
                ))}
            </div>
      </Card>

      {/* Users Table */}
      <div className="space-y-4">
          <div className="hidden lg:grid grid-cols-12 gap-4 px-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              <div className="col-span-1">Avatar</div>
              <div className="col-span-4">User Details</div>
              <div className="col-span-2">Role</div>
              <div className="col-span-2">Joined Date</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1 text-right">Actions</div>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {Array(5).fill(0).map((_, i) => <TableRowSkeleton key={i} />)}
            </div>
          ) : filteredUsers.length === 0 ? (
            <EmptyState 
              title="No users found"
              description="Your search criteria yielded no results. Try adjusting your filters or checking your spelling."
              icon={Users}
              className="py-24 bg-white rounded-[32px]"
            />
          ) : (
            filteredUsers.map((user) => (
                <Card key={user.id} className="border-none shadow-sm rounded-[24px] bg-white hover:shadow-xl transition-all group overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center p-6 lg:px-8">
                        <div className="col-span-1">
                            <Avatar className="w-12 h-12 border-2 border-slate-50 shadow-sm">
                                <AvatarFallback className="bg-[#1A56DB]/5 text-[#1A56DB] text-xs font-black">
                                  {user.full_name?.split(' ').map((n: string)=>n[0]).join('') || "U"}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                        
                        <div className="col-span-4 min-w-0">
                            <h4 className="text-base font-black text-slate-900 truncate tracking-tight">{user.full_name || 'No Name'}</h4>
                            <p className="text-xs font-bold text-slate-400 italic lowercase truncate">{user.email}</p>
                        </div>

                        <div className="col-span-2">
                            <Badge className={cn(
                                "rounded-full font-black text-[9px] uppercase tracking-widest px-3 border shadow-none",
                                user.role === 'owner' ? "bg-slate-900 text-white" : "bg-[#1A56DB]/5 text-[#1A56DB] border-[#1A56DB]/10"
                            )}>
                                {user.role}
                            </Badge>
                        </div>

                        <div className="col-span-2 flex items-center gap-2 text-xs font-bold text-slate-500 italic">
                            <Calendar className="w-3.5 h-3.5 text-slate-300" />
                            {new Date(user.created_at).toLocaleDateString()}
                        </div>

                        <div className="col-span-2">
                            <Badge className={cn(
                                "rounded-full font-black text-[9px] uppercase tracking-widest px-3 border shadow-none",
                                !user.is_blocked ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-red-50 text-red-600 border-red-100"
                            )}>
                                {!user.is_blocked ? 'Active' : 'Blocked'}
                            </Badge>
                        </div>

                        <div className="col-span-1 flex justify-end gap-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="rounded-xl hover:bg-slate-50">
                                        <MoreHorizontal className="w-5 h-5 text-slate-400" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 bg-white/80 backdrop-blur-md border-slate-100 shadow-2xl">
                                    <DropdownMenuItem className="rounded-xl font-bold gap-3 px-3 py-2.5 cursor-pointer transition-colors focus:bg-slate-100">
                                        <UserCheck className="w-4 h-4 text-[#1A56DB]" /> Profile Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="rounded-xl font-bold gap-3 px-3 py-2.5 cursor-pointer transition-colors focus:bg-slate-100">
                                        <Mail className="w-4 h-4 text-slate-400" /> Message User
                                    </DropdownMenuItem>
                                    <div className="h-[1px] bg-slate-100 my-1" />
                                    <DropdownMenuItem 
                                        onSelect={() => handleToggleBlock(user.id, !!user.is_blocked)}
                                        className={cn(
                                          "rounded-xl font-bold gap-3 px-3 py-2.5 cursor-pointer transition-colors",
                                          !user.is_blocked ? "focus:bg-red-50 focus:text-red-600" : "focus:bg-emerald-50 focus:text-emerald-600"
                                        )}
                                    >
                                        <Ban className="w-4 h-4" /> {!user.is_blocked ? "Block Account" : "Unblock Account"}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </Card>
            ))
          )}
      </div>
    </div>
  )
}
