"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AuthShell } from "@/components/auth/auth-shell"
import { Loader2, Smartphone, ArrowLeft, RotateCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

function VerifyOTPContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const supabase = createClient()
  
  const phone = searchParams.get("phone")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [timer, setTimer] = useState(45)
  const [canResend, setCanResend] = useState(false)
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (!phone) {
      router.push("/login")
    }
    
    let interval: NodeJS.Timeout
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1)
      }, 1000)
    } else {
      setCanResend(true)
    }
    
    return () => clearInterval(interval)
  }, [timer, phone, router])

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1)
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-advance
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleVerify = async (e?: React.FormEvent) => {
    e?.preventDefault()
    const code = otp.join("")
    if (code.length !== 6) {
      toast({ variant: "destructive", title: "Invalid Code", description: "Please enter all 6 digits." })
      return
    }

    setIsLoading(true)
    try {
      const { error } = await supabase.auth.verifyOtp({
        phone: `+91${phone}`,
        token: code,
        type: 'sms'
      })

      if (error) throw error

      toast({ title: "Verified!", description: "Logging you in..." })
      router.push("/")
      router.refresh()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An unexpected error occurred"
      toast({ variant: "destructive", title: "Verification Failed", description: message })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    if (!canResend) return
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOtp({ phone: `+91${phone}` })
      if (error) throw error
      
      setTimer(45)
      setCanResend(false)
      toast({ title: "OTP Resent", description: `A new code has been sent to +91 ${phone}` })
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An unexpected error occurred"
      toast({ variant: "destructive", title: "Error", description: message })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
       <div className="text-center">
        <div className="w-16 h-16 bg-blue-50 text-[#1A56DB] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
          <Smartphone className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 leading-tight">Enter 6-Digit Code</h2>
        <p className="text-slate-500 font-medium text-sm mt-3 flex items-center justify-center gap-1.5">
          Sent to <span className="text-slate-900 font-bold">+91 {phone?.slice(0,5)} XXX{phone?.slice(-2)}</span>
        </p>
      </div>

      <form onSubmit={handleVerify} className="space-y-8 mt-10">
        <div className="flex justify-between gap-2.5">
          {otp.map((digit, index) => (
            <Input
              key={index}
              ref={(el) => { inputRefs.current[index] = el }}
              type="text"
              inputMode="numeric"
              pattern="\d*"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-14 text-center text-xl font-black rounded-xl bg-slate-50 border-slate-200 focus:bg-white focus:border-primary transition-all p-0"
              required
            />
          ))}
        </div>

        <div className="space-y-4 pt-4">
          <Button className="w-full h-14 bg-[#1A56DB] hover:bg-[#1341A8] text-white font-black text-lg rounded-2xl shadow-xl shadow-blue-500/20 transition-all active:scale-95" disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" /> : "Verify OTP"}
          </Button>

          <div className="text-center">
            {canResend ? (
              <button 
                type="button"
                onClick={handleResend}
                className="text-primary font-black hover:underline flex items-center justify-center gap-2 mx-auto"
              >
                <RotateCw className="w-4 h-4" />
                Resend Code
              </button>
            ) : (
              <p className="text-slate-400 font-bold text-sm">
                Resend in <span className="text-slate-600">0:{timer.toString().padStart(2, '0')}</span>
              </p>
            )}
          </div>
        </div>
      </form>

      <Link href="/login" className="flex items-center justify-center gap-2 text-slate-500 hover:text-primary transition-all font-bold text-sm pt-4">
        <ArrowLeft className="w-4 h-4" />
        Back to Login
      </Link>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <AuthShell heading="Verify OTP">
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="text-slate-500 font-bold">Initializing verification...</p>
        </div>
      }>
        <VerifyOTPContent />
      </Suspense>
    </AuthShell>
  )
}
