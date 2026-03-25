"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Store, ArrowRight, Loader2, ShieldCheck } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function RoleSwitchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<any>(null)

  const returnUrl = searchParams.get("returnUrl") || "/owner/dashboard"

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/login")
        return
      }
      setUser(user)
    }
    checkUser()
  }, [router, supabase.auth])

  const handleSwitch = async () => {
    setIsLoading(true)
    try {
      const { error } = await (supabase
        .from("profiles")
        .update as any)({ role: "owner" })
        .eq("id", user.id)

      if (error) throw error

      // Update auth metadata as well for faster middleware checks
      const { error: authError } = await supabase.auth.updateUser({
        data: { role: "owner" }
      })

      if (authError) throw authError

      toast({
        title: "Role Switched Successfully",
        description: "You are now in Seller mode.",
      })

      router.push(returnUrl)
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Switch Failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    router.push("/buyer/home")
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <Card className="max-w-md w-full border-none shadow-2xl rounded-[40px] p-10 bg-white space-y-8">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-20 h-20 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mb-2">
            <Store className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight italic">Switch to Seller Mode?</h1>
          <p className="text-slate-500 font-medium leading-relaxed">
            You're currently in Buyer mode. To access owner features and list properties, you need to switch to your Seller profile.
          </p>
        </div>

        <div className="space-y-4">
          <Button 
            onClick={handleSwitch}
            disabled={isLoading}
            className="w-full h-16 rounded-2xl bg-slate-900 text-white font-black text-lg gap-3 hover:scale-[1.02] transition-all italic"
          >
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>Yes, Switch to Seller <ArrowRight className="w-5 h-5" /></>
            )}
          </Button>
          <Button 
            variant="ghost" 
            onClick={handleCancel}
            disabled={isLoading}
            className="w-full h-14 rounded-2xl text-slate-400 font-bold hover:bg-slate-50"
          >
            No, Stay in Buyer Mode
          </Button>
        </div>

        <div className="pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
          <ShieldCheck className="w-4 h-4" /> Secure Profile Transition
        </div>
      </Card>
    </div>
  )
}
