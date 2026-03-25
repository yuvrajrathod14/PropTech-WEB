"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { AuthShell } from "@/components/auth/auth-shell"
import { Search, Home as HomeIcon, CheckCircle2, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

export default function RoleSelectionPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const supabase = createClient()
  
  const [isLoading, setIsLoading] = useState(false)
  const [role, setRole] = useState<"buyer" | "owner">("buyer")
  const [user, setUser] = useState<any>(null)

  const redirectPath = searchParams.get("redirect") || "/buyer/home"

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/login")
        return
      }
      
      // Check if profile already exists
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single() as { data: any }
      if (profile) {
        // If profile exists, they shouldn't be here
        router.push(profile.role === 'owner' ? '/owner/dashboard' : '/buyer/home')
        return
      }
      
      setUser(user)
    }
    getUser()
  }, [router, supabase])

  const handleCompleteProfile = async () => {
    if (!user) return
    
    setIsLoading(true)
    try {
      // Create the profile entry
      const { error } = await (supabase.from('profiles') as any).insert({
        id: user.id,
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        email: user.email,
        role: role,
        is_verified: true, // Google users are verified by default
        is_blocked: false
      })

      if (error) throw error

      // Also update auth metadata
      await supabase.auth.updateUser({
        data: { role: role }
      })

      toast({ 
        title: "Profile Set Up!", 
        description: `Welcome to PropTech! You are now signed in as a ${role}.` 
      })
      
      router.push(role === 'owner' ? '/owner/dashboard' : '/buyer/home')
      router.refresh()
    } catch (error: any) {
      toast({ variant: "destructive", title: "Setup Failed", description: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <AuthShell heading="Finish Setting Up">
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-black text-slate-900">Welcome, {user.user_metadata?.full_name || 'there'}!</h2>
          <p className="text-slate-500 font-medium text-sm mt-2">Please select your primary role to continue.</p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div 
              onClick={() => setRole("buyer")}
              className={cn(
                "cursor-pointer p-6 rounded-[32px] border-2 transition-all group relative overflow-hidden flex items-center gap-6",
                role === "buyer" 
                  ? "border-[#1A56DB] bg-blue-50/50 shadow-xl shadow-blue-500/10" 
                  : "border-slate-100 bg-slate-50 hover:border-slate-200"
              )}
            >
              <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center transition-colors shadow-lg",
                role === "buyer" ? "bg-[#1A56DB] text-white shadow-blue-500/20" : "bg-white text-slate-400 group-hover:text-primary"
              )}>
                <Search className="w-7 h-7" />
              </div>
              <div>
                <p className={cn("font-black text-lg leading-none", role === "buyer" ? "text-slate-900" : "text-slate-500")}>I want to Buy/Rent</p>
                <p className="text-xs font-medium text-slate-400 mt-1">Browse and book properties</p>
              </div>
              {role === "buyer" && (
                <div className="absolute top-4 right-4">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                </div>
              )}
            </div>

            <div 
              onClick={() => setRole("owner")}
              className={cn(
                "cursor-pointer p-6 rounded-[32px] border-2 transition-all group relative overflow-hidden flex items-center gap-6",
                role === "owner" 
                  ? "border-[#1A56DB] bg-blue-50/50 shadow-xl shadow-blue-500/10" 
                  : "border-slate-100 bg-slate-50 hover:border-slate-200"
              )}
            >
              <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center transition-colors shadow-lg",
                role === "owner" ? "bg-[#1A56DB] text-white shadow-blue-500/20" : "bg-white text-slate-400 group-hover:text-primary"
              )}>
                <HomeIcon className="w-7 h-7" />
              </div>
              <div>
                <p className={cn("font-black text-lg leading-none", role === "owner" ? "text-slate-900" : "text-slate-500")}>I want to Sell/List</p>
                <p className="text-xs font-medium text-slate-400 mt-1">Manage listings and enquiries</p>
              </div>
              {role === "owner" && (
                <div className="absolute top-4 right-4">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                </div>
              )}
            </div>
          </div>
        </div>

        <Button 
          onClick={handleCompleteProfile}
          className="w-full h-16 bg-[#1A56DB] hover:bg-[#1341A8] text-white font-black text-xl rounded-[24px] shadow-2xl shadow-blue-500/30 transition-all active:scale-95" 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-3 h-6 w-6 animate-spin" />
              Finalizing...
            </>
          ) : "Start Exploring"}
        </Button>
      </div>
    </AuthShell>
  )
}
