"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthShell } from "@/components/auth/auth-shell"
import { Mail, Lock, User, Phone, Loader2, Search, Home as HomeIcon, CheckCircle2, Eye, EyeOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { registerSchema, RegisterInput } from "@/lib/validations/auth"

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()
  
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [role, setRole] = useState<"buyer" | "owner">("buyer")
  
  // React Hook Form for Registration
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur"
  })

  const onRegister = async (data: RegisterInput) => {
    setIsLoading(true)
    try {
      const { error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            phone: data.phone,
            role: role,
          },
        },
      })

      if (authError) throw authError

      toast({ 
        title: `Welcome to PropTech, ${data.fullName}!`, 
        description: "Your account has been created successfully." 
      })
      
      const redirectPath = role === "owner" ? "/owner/dashboard" : "/buyer/home"
      router.push(redirectPath)
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An unexpected error occurred"
      toast({ variant: "destructive", title: "Registration Failed", description: message })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthShell heading="Create Your Account">
      <form onSubmit={handleSubmit(onRegister)} className="space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-black text-slate-900 leading-tight">Join PropTech</h2>
          <p className="text-slate-500 font-medium text-sm mt-2">Start your property journey today</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="font-bold text-slate-700 ml-1">Full Name</Label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors z-10" />
              <Input 
                placeholder="Enter your full name" 
                {...register("fullName")}
                error={errors.fullName?.message}
                className="pl-12 h-12 rounded-2xl bg-white border-slate-200 focus:border-primary focus:ring-primary font-medium"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-bold text-slate-700 ml-1">Email</Label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors z-10" />
                <Input 
                  type="email"
                  placeholder="name@email.com" 
                  {...register("email")}
                  error={errors.email?.message}
                  className="pl-12 h-12 rounded-2xl bg-white border-slate-200 focus:border-primary focus:ring-primary font-medium"
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="font-bold text-slate-700 ml-1">Phone</Label>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors z-10" />
                <Input 
                  placeholder="9876543210" 
                  {...register("phone")}
                  error={errors.phone?.message}
                  className="pl-12 h-12 rounded-2xl bg-white border-slate-200 focus:border-primary focus:ring-primary font-medium"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-bold text-slate-700 ml-1">Password</Label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors z-10" />
                <Input 
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••" 
                  {...register("password")}
                  error={errors.password?.message}
                  className="pl-12 h-12 rounded-2xl bg-white border-slate-200 focus:border-primary focus:ring-primary font-medium text-lg leading-none"
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="font-bold text-slate-700 ml-1">Confirm Password</Label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors z-10" />
                <Input 
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••" 
                  {...register("confirmPassword")}
                  error={errors.confirmPassword?.message}
                  className="pl-12 h-12 rounded-2xl bg-white border-slate-200 focus:border-primary focus:ring-primary font-medium text-lg leading-none"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end pr-2">
             <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-xs font-bold text-slate-500 flex items-center gap-1.5 hover:text-primary transition-colors"
             >
               {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
               {showPassword ? "Hide" : "Show"} Passwords
             </button>
          </div>
        </div>

        <div className="space-y-3">
          <Label className="font-extrabold text-slate-800 ml-1">I want to:</Label>
          <div className="grid grid-cols-2 gap-4">
            <div 
              onClick={() => !isLoading && setRole("buyer")}
              className={cn(
                "cursor-pointer p-4 rounded-2xl border-2 transition-all group relative overflow-hidden",
                role === "buyer" 
                  ? "border-[#1A56DB] bg-blue-50/50 shadow-lg shadow-blue-500/10" 
                  : "border-slate-100 bg-slate-50 hover:border-slate-200",
                isLoading && "opacity-50 cursor-not-allowed"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors",
                role === "buyer" ? "bg-[#1A56DB] text-white" : "bg-white text-slate-400 group-hover:text-primary"
              )}>
                <Search className="w-5 h-5" />
              </div>
              <p className={cn("font-black text-sm uppercase tracking-tight", role === "buyer" ? "text-slate-900" : "text-slate-500")}>Buy or Rent</p>
              {role === "buyer" && (
                <div className="absolute top-2 right-2">
                  <CheckCircle2 className="w-5 h-5 text-primary animate-in zoom-in" />
                </div>
              )}
            </div>

            <div 
              onClick={() => !isLoading && setRole("owner")}
              className={cn(
                "cursor-pointer p-4 rounded-2xl border-2 transition-all group relative overflow-hidden",
                role === "owner" 
                  ? "border-[#1A56DB] bg-blue-50/50 shadow-lg shadow-blue-500/10" 
                  : "border-slate-100 bg-slate-50 hover:border-slate-200",
                isLoading && "opacity-50 cursor-not-allowed"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors",
                role === "owner" ? "bg-[#1A56DB] text-white" : "bg-white text-slate-400 group-hover:text-primary"
              )}>
                <HomeIcon className="w-5 h-5" />
              </div>
              <p className={cn("font-black text-sm uppercase tracking-tight", role === "owner" ? "text-slate-900" : "text-slate-500")}>Sell or List</p>
              {role === "owner" && (
                <div className="absolute top-2 right-2">
                  <CheckCircle2 className="w-5 h-5 text-primary animate-in zoom-in" />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Checkbox id="terms" className="mt-1 rounded-md border-slate-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary" required disabled={isLoading} />
          <Label htmlFor="terms" className="text-sm font-medium text-slate-500 leading-snug cursor-pointer">
            I agree to the <Link href="/terms" className="text-primary font-bold hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-primary font-bold hover:underline">Privacy Policy</Link>
          </Label>
        </div>

        <Button 
          type="submit" 
          className="w-full h-14 bg-[#1A56DB] hover:bg-[#1341A8] text-white font-black text-lg rounded-2xl shadow-xl shadow-blue-500/20 transition-all active:scale-95 flex items-center justify-center gap-2" 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Creating Account...
            </>
          ) : "Create Account"}
        </Button>

        <p className="text-center text-sm text-slate-500 font-medium pt-2">
          Already have an account?{" "}
          <Link href="/login" className="text-[#1A56DB] font-black hover:underline uppercase tracking-wider text-xs">Sign In</Link>
        </p>
      </form>
    </AuthShell>
  )
}
