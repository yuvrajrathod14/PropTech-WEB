"use client"

import { useState } from "react"
import { 
  Search, 
  Users, 
  UserPlus, 
  MoreVertical, 
  ShieldCheck, 
  ShieldAlert, 
  Mail, 
  Phone, 
  Calendar,
  Filter,
  ArrowUpRight,
  Download,
  Ban,
  MoreHorizontal
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

const mockUsers = [
  { id: "1", name: "Aryan Kumar", email: "aryan@example.com", phone: "+91 98*** **450", role: "Owner", status: "Active", joined: "12 Mar 2024" },
  { id: "2", name: "Rahul Mehta", email: "rahul@example.com", phone: "+91 87*** **123", role: "Buyer", status: "Active", joined: "15 Mar 2024" },
  { id: "3", name: "Sonal Patel", email: "sonal@example.com", phone: "+91 76*** **890", role: "Owner", status: "Active", joined: "18 Mar 2024" },
  { id: "4", name: "Anish Shah", email: "anish@example.com", phone: "+91 99*** **567", role: "Buyer", status: "Blocked", joined: "20 Mar 2024" },
  { id: "5", name: "Priya Varma", email: "priya@example.com", phone: "+91 91*** **234", role: "Buyer", status: "Active", joined: "22 Mar 2024" },
]

export default function AdminUsersPage() {
  const [filter, setFilter] = useState("all")

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">Users</h1>
          <p className="text-slate-500 font-medium">Manage platform users, verify identities, and handle account status.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-12 rounded-2xl border-slate-100 bg-white font-bold gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </Button>
          <Button className="h-12 rounded-2xl bg-primary hover:bg-primary-dark text-white font-black px-6 shadow-xl shadow-primary/20 transition-all active:scale-95 italic">
            <UserPlus className="w-4 h-4 mr-2" /> Add User
          </Button>
        </div>
      </div>

      {/* Filters & Search */}
      <Card className="border-none shadow-sm rounded-[32px] p-4 bg-white flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input placeholder="Search name, email, or phone..." className="pl-10 h-12 rounded-2xl bg-slate-50 border-none font-medium text-sm" />
            </div>
            <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-2xl w-full md:w-auto">
                {["All", "Buyers", "Owners", "Blocked"].map((t) => (
                    <Button 
                        key={t}
                        variant={filter === t.toLowerCase() ? "secondary" : "ghost"}
                        onClick={() => setFilter(t.toLowerCase())}
                        className={cn(
                            "rounded-xl px-4 h-10 font-black text-[10px] uppercase tracking-widest transition-all flex-1 md:flex-none",
                            filter === t.toLowerCase() ? "bg-white text-primary shadow-sm" : "text-slate-500"
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
              <div className="col-span-1">ID</div>
              <div className="col-span-4">User Details</div>
              <div className="col-span-2">Role</div>
              <div className="col-span-2">Joined Date</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1 text-right">Actions</div>
          </div>

          {mockUsers.map((user) => (
              <Card key={user.id} className="border-none shadow-sm rounded-[24px] bg-white hover:shadow-xl transition-all group overflow-hidden">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center p-6 lg:px-8">
                      <div className="col-span-1 font-black text-slate-300 text-sm italic">#{user.id}</div>
                      
                      <div className="col-span-4 flex items-center gap-4">
                          <Avatar className="w-12 h-12 border-2 border-slate-50 shadow-sm">
                              <AvatarFallback className="bg-primary/5 text-primary text-xs font-black">{user.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                              <h4 className="text-base font-black text-slate-900 truncate tracking-tight">{user.name}</h4>
                              <p className="text-xs font-bold text-slate-400 italic lowercase truncate">{user.email}</p>
                          </div>
                      </div>

                      <div className="col-span-2">
                          <Badge className={cn(
                              "rounded-full font-black text-[9px] uppercase tracking-widest px-3 border shadow-none",
                              user.role === 'Owner' ? "bg-slate-900 text-white" : "bg-primary/5 text-primary border-primary/10"
                          )}>
                              {user.role}
                          </Badge>
                      </div>

                      <div className="col-span-2 flex items-center gap-2 text-xs font-bold text-slate-500 italic">
                          <Calendar className="w-3.5 h-3.5 text-slate-300" />
                          {user.joined}
                      </div>

                      <div className="col-span-2">
                          <Badge className={cn(
                              "rounded-full font-black text-[9px] uppercase tracking-widest px-3 border shadow-none",
                              user.status === 'Active' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-red-50 text-red-600 border-red-100"
                          )}>
                              {user.status}
                          </Badge>
                      </div>

                      <div className="col-span-1 flex justify-end gap-2">
                          <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="rounded-xl hover:bg-slate-50">
                                      <MoreHorizontal className="w-5 h-5 text-slate-400" />
                                  </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 bg-white/80 backdrop-blur-md">
                                  <DropdownMenuItem className="rounded-xl font-bold gap-3 px-3 py-2.5 cursor-pointer transition-colors focus:bg-slate-100">
                                      <ShieldCheck className="w-4 h-4 text-primary" /> View Profile Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="rounded-xl font-bold gap-3 px-3 py-2.5 cursor-pointer transition-colors focus:bg-slate-100">
                                      <Mail className="w-4 h-4 text-slate-400" /> Send Email
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="rounded-xl font-bold gap-3 px-3 py-2.5 cursor-pointer transition-colors focus:bg-slate-100">
                                      <Phone className="w-4 h-4 text-slate-400" /> User History
                                  </DropdownMenuItem>
                                  <div className="h-[1px] bg-slate-100 my-1" />
                                  <DropdownMenuItem className={cn(
                                      "rounded-xl font-bold gap-3 px-3 py-2.5 cursor-pointer transition-colors",
                                      user.status === 'Active' ? "focus:bg-red-50 focus:text-red-600" : "focus:bg-emerald-50 focus:text-emerald-600"
                                  )}>
                                      <Ban className="w-4 h-4" /> {user.status === 'Active' ? "Block Account" : "Unblock Account"}
                                  </DropdownMenuItem>
                              </DropdownMenuContent>
                          </DropdownMenu>
                      </div>
                  </div>
              </Card>
          ))}
      </div>
    </div>
  )
}
