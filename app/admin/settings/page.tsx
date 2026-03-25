"use client"

import { 
  Settings, 
  Globe, 
  Shield, 
  CreditCard, 
  Bell, 
  MapPin, 
  Users, 
  Database,
  ArrowRight,
  Save,
  Lock,
  Search,
  CheckCircle2,
  Trash2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"

const sections = [
  { id: "general", name: "General Settings", icon: Globe, desc: "SEO, Logos, and brand identity" },
  { id: "security", name: "Security & Auth", icon: Shield, desc: "OTP configs, verification levels" },
  { id: "payments", name: "Razorpay Payments", icon: CreditCard, desc: "Keys, commisions, and tax" },
  { id: "locations", name: "Cities & Regions", icon: MapPin, desc: "Manage active areas" },
  { id: "admins", name: "Admin Team", icon: Users, desc: "Permissions and team management" },
]

export default function AdminSettingsPage() {
  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">Settings</h1>
          <p className="text-slate-500 font-medium">Configure platform-wide rules, integration keys, and permissions.</p>
        </div>
        <Button className="h-12 rounded-2xl bg-primary hover:bg-primary-dark font-black px-10 gap-2 shadow-xl shadow-primary/20 transition-all active:scale-95 italic">
          <Save className="w-4 h-4" /> Save All Changes
        </Button>
      </div>

      <div className="grid lg:grid-cols-4 gap-10">
        {/* Navigation */}
        <div className="lg:col-span-1 space-y-2">
            {sections.map((s) => (
                <button 
                    key={s.id} 
                    className="w-full flex items-center gap-4 p-5 rounded-3xl text-left transition-all hover:bg-white hover:shadow-md group"
                >
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                        <s.icon className="w-6 h-6" />
                    </div>
                    <div className="min-w-0">
                        <h4 className="text-sm font-black text-slate-900 tracking-tight">{s.name}</h4>
                        <p className="text-[10px] font-bold text-slate-400 truncate italic">{s.desc}</p>
                    </div>
                </button>
            ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-8">
            <Card className="border-none shadow-sm rounded-[40px] p-10 bg-white space-y-10">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight italic">General Configuration</h3>
                        <p className="text-sm font-medium text-slate-400">Core platform details and SEO setup.</p>
                    </div>
                    <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[10px] px-3 py-1 uppercase tracking-widest">LIVE</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <Label className="text-sm font-black text-slate-900">Platform Name</Label>
                        <Input defaultValue="PropTech" className="h-14 rounded-2xl bg-slate-50 border-none px-6 font-medium text-slate-600" />
                    </div>
                    <div className="space-y-4">
                        <Label className="text-sm font-black text-slate-900">Support Email</Label>
                        <Input defaultValue="support@proptech.com" className="h-14 rounded-2xl bg-slate-50 border-none px-6 font-medium text-slate-600" />
                    </div>
                </div>

                <div className="space-y-6 pt-6 border-t border-slate-50">
                    <h4 className="text-lg font-black text-slate-900 tracking-tight italic">Global Features</h4>
                    <div className="space-y-4">
                        {[
                            { label: "Maintenance Mode", desc: "Show a downtime screen to all users", active: false },
                            { label: "New Listing Approvals", desc: "Require admin audit for all new listings", active: true },
                            { label: "Razorpay Sandbox", desc: "Run all payments in test mode", active: true },
                            { label: "Public Search", desc: "Allow guest users to browse properties", active: true },
                        ].map((f, i) => (
                            <div key={i} className="flex items-center justify-between p-6 rounded-3xl bg-slate-50/50 border border-slate-50 group hover:border-primary/20 transition-all">
                                <div>
                                    <p className="text-sm font-black text-slate-900">{f.label}</p>
                                    <p className="text-[10px] font-bold text-slate-400 italic font-medium">{f.desc}</p>
                                </div>
                                <Switch checked={f.active} />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-50 flex justify-end gap-3">
                    <Button variant="ghost" className="h-12 rounded-xl font-bold text-slate-400">Reset to Defaults</Button>
                    <Button className="h-12 rounded-xl bg-slate-900 text-white font-black px-8">Save Section</Button>
                </div>
            </Card>

            {/* Admin Management Section */}
            <Card className="border-none shadow-sm rounded-[40px] p-10 bg-white space-y-8">
                <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight italic">Admin Team</h3>
                    <Button size="sm" variant="outline" className="h-10 rounded-xl border-slate-100 font-bold gap-2 text-primary">
                        <Users className="w-4 h-4" /> Invite Admin
                    </Button>
                </div>

                <div className="space-y-3">
                    {[
                        { name: "Super Admin", email: "super@proptech.com", role: "Owner" },
                        { name: "Varun Shah", email: "varun@proptech.com", role: "Moderator" },
                        { name: "Ayesha Khan", email: "ayesha@proptech.com", role: "Support" },
                    ].map((admin, i) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-slate-50 hover:bg-slate-50 transition-all group">
                             <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-400 text-xs italic">{admin.name[0]}</div>
                                 <div>
                                     <p className="text-sm font-black text-slate-900">{admin.name}</p>
                                     <p className="text-[10px] font-medium text-slate-400 italic lowercase">{admin.email}</p>
                                 </div>
                             </div>
                             <div className="flex items-center gap-6">
                                 <Badge className="bg-slate-50 text-slate-400 border-none font-bold text-[9px] uppercase tracking-widest px-2">{admin.role}</Badge>
                                 <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all">
                                    <Trash2 className="w-4 h-4" />
                                 </Button>
                             </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
      </div>
    </div>
  )
}
