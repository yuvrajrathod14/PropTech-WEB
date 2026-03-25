"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, Loader2, Home, Eye, EyeOff, CheckCircle2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import Link from "next/link"

export default function ResetPasswordPage() {
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()
  
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      toast({ variant: "destructive", title: "Mismatch", description: "Passwords do not match." })
      return
    }

    if (password.length < 8) {
      toast({ variant: "destructive", title: "Weak Password", description: "Password must be at least 8 characters." })
      return
    }

    setIsLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      
      setIsSuccess(true)
      toast({ title: "Password Updated", description: "Your password has been reset successfully." })
      
      setTimeout(() => {
        router.push("/login")
      }, 3000)
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An unexpected error occurred"
      toast({ variant: "destructive", title: "Error", description: message })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <Link href="/" className="flex items-center gap-3 mb-10 group">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
          <Home className="text-white w-6 h-6" />
        </div>
        <span className="text-3xl font-black tracking-tight text-slate-900 italic">Prop<span className="text-primary">Tech</span></span>
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[440px]"
      >
        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100">
          {!isSuccess ? (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-black text-slate-900 leading-tight">Create New Password</h2>
                <p className="text-slate-500 font-medium text-sm mt-3">
                  Please enter your new password below.
                </p>
              </div>

              <form onSubmit={handleReset} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="pass" className="font-bold text-slate-700 ml-1">New Password</Label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                      <Input 
                        id="pass"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-12 h-12 rounded-2xl bg-white border-slate-200 focus:border-primary focus:ring-primary font-medium"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm" className="font-bold text-slate-700 ml-1">Confirm New Password</Label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                      <Input 
                        id="confirm"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-12 h-12 rounded-2xl bg-white border-slate-200 focus:border-primary focus:ring-primary font-medium"
                        required
                      />
                    </div>
                  </div>

                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-xs font-bold text-slate-500 flex items-center gap-1.5 hover:text-primary transition-colors justify-end w-full pr-2"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    {showPassword ? "Hide" : "Show"} Passwords
                  </button>
                </div>

                <Button className="w-full h-14 bg-[#1A56DB] hover:bg-[#1341A8] text-white font-black text-lg rounded-2xl shadow-xl shadow-blue-500/20 transition-all active:scale-95" disabled={isLoading}>
                  {isLoading ? <Loader2 className="animate-spin" /> : "Update Password"}
                </Button>
              </form>
            </div>
          ) : (
            <div className="text-center py-6 space-y-6">
              <div className="w-20 h-20 bg-green-50 text-green-500 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-slate-900">Password Success!</h2>
                <p className="text-slate-500 font-medium pt-2">
                  Your password has been updated. <br/>
                  Redirecting to login in 3 seconds...
                </p>
              </div>
              <Link href="/login" className="block">
                <Button className="w-full h-12 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-lg">
                  Go to Login Now
                </Button>
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
