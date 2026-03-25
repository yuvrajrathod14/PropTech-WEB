"use client"

import { useState, useEffect } from "react"
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Camera, 
  Settings, 
  Bell, 
  LogOut, 
  Home as HomeIcon, 
  Heart, 
  ShoppingBag, 
  Calendar,
  ChevronRight,
  Loader2
} from "lucide-react"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { profileSchema, ProfileInput } from "@/lib/validations/auth"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"

const stats = [
  { label: "Saved", value: "24" },
  { label: "Enquiries", value: "12" },
  { label: "Bookings", value: "01" },
]

const navMenu = [
  { icon: HomeIcon, label: "My Properties", href: "/owner/home", badge: "Owner" },
  { icon: Heart, label: "Saved Properties", href: "/wishlist" },
  { icon: ShoppingBag, label: "My Bookings", href: "/bookings" },
  { icon: Calendar, label: "Site Visits", href: "/visits" },
  { icon: Bell, label: "Notifications", href: "/notifications" },
  { icon: Settings, label: "Settings", href: "/profile" },
]

export default function ProfilePage() {
  const { profile, user, signOut } = useAuth()
  const { toast } = useToast()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)
  const [city, setCity] = useState("Ahmedabad")

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    mode: "onBlur",
    defaultValues: {
      fullName: profile?.full_name || "",
      email: user?.email || "",
    }
  })

  // Update form defaults when profile loads
  useEffect(() => {
    if (profile || user) {
      reset({
        fullName: profile?.full_name || "",
        email: user?.email || "",
      })
    }
  }, [profile, user, reset])

  const onUpdateProfile = async (data: ProfileInput) => {
    setIsLoading(true)
    try {
      const { error } = await (supabase
        .from('profiles') as any)
        .update({ 
          full_name: data.fullName,
        })
        .eq('id', user?.id)

      if (error) throw error

      toast({ title: "Profile Updated", description: "Your changes have been saved successfully." })
      reset(data) // Reset dirty state
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to update profile"
      toast({ variant: "destructive", title: "Update Failed", description: message })
    } finally {
      setIsLoading(false)
    }
  }

  const initial = (profile?.full_name || user?.email || "U").charAt(0).toUpperCase()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 min-h-[calc(100vh-160px)]">
      
      {/* Sidebar Profile Info */}
      <div className="lg:col-span-4 space-y-8">
        <section className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm text-center relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-24 bg-primary/5 group-hover:h-28 transition-all" />
          
          {/* Avatar Section */}
          <div className="relative z-10 space-y-4">
            <div className="relative inline-block">
              <div className="w-32 h-32 rounded-[48px] bg-primary flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-primary/30 border-4 border-white">
                {initial}
              </div>
              <button className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-2xl shadow-xl flex items-center justify-center text-slate-400 hover:text-primary hover:scale-110 transition-all border border-slate-100">
                <Camera className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">{profile?.full_name || "User"}</h2>
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
              </div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Premium Member</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-slate-50 relative z-10">
            {stats.map((stat) => (
              <div key={stat.label} className="space-y-1">
                <p className="text-xl font-black text-slate-900 leading-none">{stat.value}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Navigation List */}
        <section className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-4 hidden lg:block">
          <nav className="space-y-1">
            {navMenu.map((item) => (
              <button
                key={item.label}
                className="w-full flex items-center justify-between p-4 rounded-3xl hover:bg-slate-50 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-slate-600 group-hover:text-slate-900 transition-colors uppercase text-[11px] tracking-widest">{item.label}</span>
                </div>
                {item.badge ? (
                  <Badge className="bg-primary/10 text-primary border-none text-[9px] font-black uppercase tracking-widest h-6 px-3">{item.badge}</Badge>
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-200 group-hover:text-slate-400" />
                )}
              </button>
            ))}
            <Separator className="my-4 bg-slate-50 mx-4 w-auto" />
            <button 
              onClick={signOut}
              className="w-full flex items-center gap-4 p-4 rounded-3xl hover:bg-red-50 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-400">
                <LogOut className="w-5 h-5" />
              </div>
              <span className="font-bold text-red-500 uppercase text-[11px] tracking-widest">Sign Out</span>
            </button>
          </nav>
        </section>
      </div>

      {/* Profile Form Content */}
      <div className="lg:col-span-8 flex flex-col">
        <form onSubmit={handleSubmit(onUpdateProfile)} className="flex-1 flex flex-col">
          <section className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-8 md:p-12 space-y-10 flex-1">
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Account Settings</h3>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">
                Update your personal details and how you&apos;d like to be contacted by owners.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</Label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors z-10" />
                  <Input 
                    {...register("fullName")}
                    error={errors.fullName?.message}
                    className="pl-11 h-14 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-primary/20 transition-all font-bold text-slate-700" 
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors z-10" />
                  <Input 
                    {...register("email")}
                    readOnly
                    className="pl-11 h-14 rounded-2xl bg-slate-50 border-transparent text-slate-400 font-bold italic cursor-not-allowed" 
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center justify-between">
                  Mobile Number
                  <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[9px] h-5">Verified</Badge>
                </Label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <Input 
                    value={profile?.phone || "No phone added"}
                    readOnly
                    className="pl-11 h-14 rounded-2xl bg-slate-50/50 border-slate-100 text-slate-400 font-bold cursor-not-allowed italic" 
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">City</Label>
                <div className="relative group">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
                  <Select value={city} onValueChange={setCity}>
                    <SelectTrigger className="pl-11 h-14 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-primary/20 transition-all font-bold text-slate-700">
                      <SelectValue placeholder="Select City" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-slate-100 shadow-2xl">
                      <SelectItem value="Ahmedabad" className="font-bold">Ahmedabad</SelectItem>
                      <SelectItem value="Mumbai" className="font-bold">Mumbai</SelectItem>
                      <SelectItem value="Delhi" className="font-bold">Delhi</SelectItem>
                      <SelectItem value="Bangalore" className="font-bold">Bangalore</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-6 border-t border-slate-50">
              <h4 className="text-sm font-black text-slate-900 tracking-tight uppercase tracking-widest">Connect Accounts</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button type="button" variant="outline" className="h-16 rounded-2xl border-slate-100 hover:bg-slate-50 font-bold text-slate-600 gap-4 justify-start px-6">
                  <Image src="https://www.google.com/favicon.ico" width={20} height={20} alt="Google" className="grayscale group-hover:grayscale-0" />
                  Connected to Google
                </Button>
              </div>
            </div>

            <div className="pt-8 mt-auto flex justify-end gap-4">
              <Button type="button" variant="ghost" onClick={() => reset()} className="rounded-2xl h-14 px-8 font-black text-slate-400" disabled={!isDirty || isLoading}>Discard</Button>
              <Button type="submit" className="rounded-2xl h-14 px-10 font-black gap-2 shadow-xl shadow-primary/20" disabled={!isDirty || isLoading}>
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Changes"}
              </Button>
            </div>
          </section>
        </form>
      </div>

    </div>
  )
}
