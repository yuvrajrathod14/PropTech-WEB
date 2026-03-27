"use client"

import { useState } from "react"
import { UserPlus, Shield, Trash2, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const mockAdmins = [
  { id: "1", name: "Super Admin", email: "superadmin@proptech.com", role: "super_admin", status: "active" },
  { id: "2", name: "Content Moderator", email: "mod@proptech.com", role: "admin", status: "active" },
]

export default function AdminSettingsAdminsPage() {
  const [newEmail, setNewEmail] = useState("")
  const [isAdding, setIsAdding] = useState(false)

  return (
    <div className="space-y-8 pb-20">
      <div className="space-y-1">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">Admin Accounts</h1>
        <p className="text-slate-500 font-medium">Manage administrator access to the platform dashboard.</p>
      </div>

      <Card className="border-none shadow-sm rounded-[32px]">
        <CardHeader>
          <CardTitle className="font-black italic flex items-center gap-2"><UserPlus className="w-5 h-5 text-primary" />Invite New Admin</CardTitle>
          <CardDescription>Send an invitation email to grant admin access.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Input
              value={newEmail}
              onChange={e => setNewEmail(e.target.value)}
              placeholder="admin@example.com"
              className="h-12 rounded-2xl bg-slate-50 border-none"
            />
            <Button
              onClick={() => { setIsAdding(true); setTimeout(() => setIsAdding(false), 1500) }}
              disabled={isAdding || !newEmail}
              className="h-12 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black px-8 gap-2 shrink-0"
            >
              <UserPlus className="w-4 h-4" /> Send Invite
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm rounded-[32px]">
        <CardHeader>
          <CardTitle className="font-black italic flex items-center gap-2"><Shield className="w-5 h-5" />Current Admins</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {mockAdmins.map(admin => (
            <div key={admin.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black">
                {admin.name[0]}
              </div>
              <div className="flex-1">
                <p className="font-black text-slate-900">{admin.name}</p>
                <p className="text-sm text-slate-500">{admin.email}</p>
              </div>
              <Badge variant={admin.status === "active" ? "live" : "pending"}>{admin.status}</Badge>
              <Badge variant="draft" className="capitalize">{admin.role.replace("_", " ")}</Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-xl"><MoreHorizontal className="w-4 h-4" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-2xl">
                  <DropdownMenuItem className="rounded-xl text-red-600 gap-2 font-bold focus:bg-red-50">
                    <Trash2 className="w-4 h-4" /> Remove Access
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
