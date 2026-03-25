"use client"

import { 
  User, 
  Bell, 
  Shield, 
  CreditCard, 
  LogOut, 
  Camera, 
  Mail, 
  Phone, 
  MapPin, 
  Lock,
  MessageSquare,
  Calendar,
  TrendingUp
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function SettingsPage() {
  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">Settings</h1>
        <p className="text-slate-500 font-medium">Manage your profile, security and preferences.</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-10">
        <aside className="lg:col-span-1">
            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="flex flex-col h-auto bg-transparent p-0 gap-2">
                    {[
                        { id: "profile", label: "My Profile", icon: User },
                        { id: "notifications", label: "Notifications", icon: Bell },
                        { id: "security", label: "Security", icon: Shield },
                        { id: "billing", label: "Billing", icon: CreditCard },
                    ].map((tab) => (
                        <TabsTrigger 
                            key={tab.id} 
                            value={tab.id}
                            className="w-full justify-start h-14 rounded-2xl px-6 font-black text-xs uppercase tracking-widest gap-4 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-xl transition-all border border-transparent data-[state=active]:border-slate-100"
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>

            <div className="mt-10 p-6 rounded-[32px] bg-red-50 border border-red-100 space-y-4">
                <div className="flex items-center gap-3 text-red-600">
                    <LogOut className="w-5 h-5" />
                    <h4 className="font-black text-xs uppercase tracking-widest">Danger Zone</h4>
                </div>
                <p className="text-[10px] font-bold text-red-500 leading-relaxed italic">Once you log out or delete your account, your active listings will be hidden.</p>
                <Button variant="ghost" className="w-full justify-start h-11 rounded-xl text-red-600 hover:bg-red-100 font-black px-4 text-xs">
                    Logout Account
                </Button>
            </div>
        </aside>

        <div className="lg:col-span-3">
            <Tabs defaultValue="profile">
                <TabsContent value="profile" className="m-0 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                    <Card className="border-none shadow-sm rounded-[40px] bg-white overflow-hidden">
                        <CardHeader className="bg-slate-900 text-white p-10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
                            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                                <div className="relative group">
                                    <Avatar className="w-32 h-32 border-4 border-white shadow-2xl">
                                        <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300" />
                                        <AvatarFallback className="bg-primary text-white text-3xl font-black">PK</AvatarFallback>
                                    </Avatar>
                                    <button className="absolute bottom-1 right-1 w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center text-primary hover:scale-110 transition-transform">
                                        <Camera className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="text-center md:text-left space-y-2">
                                    <h2 className="text-3xl font-black italic tracking-tight">Pankaj Kumar</h2>
                                    <p className="text-white/60 font-medium">Individual Property Owner Since 2022</p>
                                    <div className="flex items-center gap-2 justify-center md:justify-start pt-2">
                                        <Badge className="bg-emerald-500 text-white rounded-full px-3 py-1 font-black text-[10px] uppercase tracking-wider">Verified Profile</Badge>
                                        <Badge className="bg-white/10 text-white border-white/20 rounded-full px-3 py-1 font-black text-[10px] uppercase tracking-wider">Premium Member</Badge>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-10 space-y-10">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Full Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <Input defaultValue="Pankaj Kumar" className="pl-10 h-14 rounded-2xl bg-slate-50 border-none font-bold" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Email Address</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <Input defaultValue="pankaj.kumar@example.com" className="pl-10 h-14 rounded-2xl bg-slate-50 border-none font-bold" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Phone Number</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <Input defaultValue="+91 98765 43210" className="pl-10 h-14 rounded-2xl bg-slate-50 border-none font-bold" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Primary City</Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <Input defaultValue="Ahmedabad" className="pl-10 h-14 rounded-2xl bg-slate-50 border-none font-bold" />
                                    </div>
                                </div>
                            </div>

                            <Separator className="bg-slate-50" />

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-black text-slate-900 tracking-tight italic">Self-Identification</h4>
                                        <p className="text-xs font-medium text-slate-400">Tell us how you manage properties</p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-4">
                                    {['Individual Owner', 'Broker / Agent', 'Builder / Developer'].map(o => (
                                        <button 
                                            key={o} 
                                            className={cn(
                                                "px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all",
                                                o === 'Individual Owner' ? "bg-primary text-white shadow-xl shadow-primary/20" : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                                            )}
                                        >
                                            {o}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-6 flex justify-end gap-4">
                                <Button variant="ghost" className="h-14 px-8 rounded-2xl font-black text-slate-500 uppercase tracking-widest text-xs">Reset All</Button>
                                <Button className="h-14 px-10 rounded-2xl bg-primary hover:bg-primary-dark font-black text-lg shadow-xl shadow-primary/20 transition-all active:scale-95">Save Changes</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="notifications" className="m-0 animate-in fade-in slide-in-from-right-4 duration-500">
                    <Card className="border-none shadow-sm rounded-[40px] bg-white p-10 space-y-10">
                        <div className="space-y-2">
                             <h2 className="text-3xl font-black italic tracking-tight">Notification Preferences</h2>
                             <p className="text-slate-500 font-medium">Control how we notify you about leads and updates.</p>
                        </div>

                        <div className="space-y-8">
                            {[
                                { title: "New Enquiries", desc: "Get notified when a buyer sends a message", icon: MessageSquare, email: true, whatsapp: true, push: true },
                                { title: "Site Visit Requests", desc: "Get notified about scheduled inspections", icon: Calendar, email: true, whatsapp: true, push: true },
                                { title: "Market Updates", desc: "Weekly trends and pricing insights", icon: TrendingUp, email: true, whatsapp: false, push: false },
                                { title: "Security Alerts", desc: "For new login or password changes", icon: Lock, email: true, whatsapp: true, push: true },
                            ].map((n, i) => (
                                <div key={i} className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-3xl bg-slate-50 border border-slate-50 group hover:bg-white hover:border-slate-100 hover:shadow-xl transition-all">
                                    <div className="flex items-start gap-5">
                                        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-primary shadow-sm border border-slate-50">
                                            <n.icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-900 tracking-tight italic">{n.title}</h4>
                                            <p className="text-xs font-medium text-slate-500">{n.desc}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="flex flex-col items-center gap-2">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email</span>
                                            <Switch defaultChecked={n.email} />
                                        </div>
                                        <div className="flex flex-col items-center gap-2">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">WhatsApp</span>
                                            <Switch defaultChecked={n.whatsapp} />
                                        </div>
                                        <div className="flex flex-col items-center gap-2">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Push</span>
                                            <Switch defaultChecked={n.push} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="pt-6 flex justify-end">
                            <Button className="h-14 px-10 rounded-2xl bg-primary hover:bg-primary-dark font-black text-lg shadow-xl shadow-primary/20 transition-all active:scale-95">Update Preferences</Button>
                        </div>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
      </div>
    </div>
  )
}
