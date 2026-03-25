"use client"

import { useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, ArrowLeft, Loader2, CheckCircle2, Home } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"

export default function ForgotPasswordPage() {
  const { toast } = useToast()
  const supabase = createClient()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (error) throw error
      setIsSubmitted(true)
      toast({ title: "Email Sent", description: "Check your inbox for the reset link." })
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
          {!isSubmitted ? (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-black text-slate-900 leading-tight">Forgot Password?</h2>
                <p className="text-slate-500 font-medium text-sm mt-3">
                  No worries! Enter your email and we&apos;ll send you a reset link.
                </p>
              </div>

              <form onSubmit={handleResetRequest} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-bold text-slate-700 ml-1">Email Address</Label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <Input 
                      id="email"
                      type="email"
                      placeholder="name@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-12 h-12 rounded-2xl bg-white border-slate-200 focus:border-primary focus:ring-primary font-medium"
                      required
                    />
                  </div>
                </div>

                <Button className="w-full h-14 bg-[#1A56DB] hover:bg-[#1341A8] text-white font-black text-lg rounded-2xl shadow-xl shadow-blue-500/20 transition-all active:scale-95" disabled={isLoading}>
                  {isLoading ? <Loader2 className="animate-spin" /> : "Send Reset Link"}
                </Button>
              </form>
            </div>
          ) : (
            <div className="text-center py-4 space-y-6">
              <div className="w-20 h-20 bg-green-50 text-green-500 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-slate-900">Check Your Email</h2>
                <p className="text-slate-500 font-medium pt-2">
                  We&apos;ve sent a password reset link to <br/>
                  <span className="text-slate-900 font-bold">{email}</span>
                </p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setIsSubmitted(false)}
                className="w-full h-12 border-slate-100 hover:bg-slate-50 text-slate-600 font-bold rounded-xl"
              >
                Try different email
              </Button>
            </div>
          )}

          <div className="mt-8 pt-8 border-t border-slate-50">
            <Link href="/login" className="flex items-center justify-center gap-2 text-slate-500 hover:text-primary transition-all font-bold text-sm">
              <ArrowLeft className="w-4 h-4" />
              Back to Sign In
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
