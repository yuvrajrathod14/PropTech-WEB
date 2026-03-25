"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthShell } from "@/components/auth/auth-shell"
import { Mail, Lock, Loader2, Eye, EyeOff, Smartphone, Key } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()
  
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState("phone")
  console.log("Current tab:", activeTab) // Added to use the variable

  // Email state
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  // Phone state
  const [phone, setPhone] = useState("")

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      toast({ title: "Welcome back!", description: "Successfully logged in." })
      router.push("/")
      router.refresh()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An unexpected error occurred"
      toast({ variant: "destructive", title: "Error", description: message })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone.match(/^[6-9]\d{9}$/)) {
      toast({ variant: "destructive", title: "Invalid Phone", description: "Please enter a valid 10-digit Indian phone number." })
      return
    }
    
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOtp({ 
        phone: `+91${phone}`,
        options: {
          shouldCreateUser: false
        }
      })
      if (error) throw error
      
      toast({ title: "OTP Sent", description: `Verification code sent to +91 ${phone}` })
      // Redirect to verify page with phone as param
      router.push(`/verify?phone=${phone}`)
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An unexpected error occurred"
      toast({ variant: "destructive", title: "Error", description: message })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      if (error) throw error
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An unexpected error occurred"
      toast({ variant: "destructive", title: "Authentication Error", description: message })
    }
  }

  return (
    <AuthShell heading="Welcome Back">
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-slate-900">Sign In to PropTech</h2>
          <p className="text-slate-500 font-medium text-sm mt-2">Choose your preferred login method</p>
        </div>

        <Tabs defaultValue="phone" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-8 bg-slate-100 p-1.5 rounded-2xl h-14">
            <TabsTrigger value="phone" className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm font-bold flex gap-2">
              <Smartphone className="w-4 h-4" />
              Phone OTP
            </TabsTrigger>
            <TabsTrigger value="email" className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm font-bold flex gap-2">
              <Key className="w-4 h-4" />
              Email
            </TabsTrigger>
          </TabsList>

          <TabsContent value="phone">
            <form onSubmit={handlePhoneLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="phone" className="font-bold text-slate-700 ml-1">Phone Number</Label>
                <div className="relative flex group">
                   <div className="flex items-center justify-center px-4 bg-slate-50 border border-r-0 border-slate-200 text-slate-500 font-bold rounded-l-2xl text-sm">
                    +91
                   </div>
                   <Input 
                    id="phone"
                    placeholder="9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="rounded-l-none rounded-r-2xl h-12 bg-white border-slate-200 focus:border-primary focus:ring-primary font-bold text-lg"
                    required
                   />
                </div>
              </div>
              <Button className="w-full h-14 bg-[#1A56DB] hover:bg-[#1341A8] text-white font-black text-lg rounded-2xl shadow-xl shadow-blue-500/20 transition-all active:scale-95" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : "Send OTP"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="email">
            <form onSubmit={handleEmailLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="font-bold text-slate-700 ml-1">Email Address</Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <Input 
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 h-12 rounded-2xl bg-white border-slate-200 focus:border-primary focus:ring-primary font-medium"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <Label htmlFor="password" title="Password" className="font-bold text-slate-700">Password</Label>
                  <Link href="/forgot-password" title="Forgot Password" className="text-xs font-bold text-primary hover:underline">Forgot Password?</Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <Input 
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-12 pr-12 h-12 rounded-2xl bg-white border-slate-200 focus:border-primary focus:ring-primary font-medium"
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <Button className="w-full h-14 bg-[#1A56DB] hover:bg-[#1341A8] text-white font-black text-lg rounded-2xl shadow-xl shadow-blue-500/20 transition-all active:scale-95" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : "Sign In"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-100"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-4 text-slate-400 font-bold">Or continue with</span>
          </div>
        </div>

        <Button 
          variant="outline" 
          onClick={handleGoogleLogin}
          className="w-full h-14 border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-2xl flex gap-3 transition-all active:scale-95"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Sign in with Google
        </Button>

        <p className="text-center text-sm text-slate-500 font-medium">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-[#1A56DB] font-black hover:underline">Register here</Link>
        </p>
      </div>
    </AuthShell>
  )
}
