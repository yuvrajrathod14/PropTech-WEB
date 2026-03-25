"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldCheck, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function AdminLoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // In a real app, check if user.role === 'admin'
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single<{ role: string }>()

      if (profile?.role !== 'admin') {
        await supabase.auth.signOut()
        throw new Error("Access denied. Admin credentials required.")
      }

      toast({ title: "Authorized", description: "Welcome to the Command Center." })
      router.push("/admin/dashboard")
    } catch (err) {
      const error = err as Error
      toast({ variant: "destructive", title: "Error", description: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-none shadow-2xl bg-slate-900 text-white rounded-[32px] p-4">
        <CardHeader className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-primary/20">
            <ShieldCheck className="w-10 h-10 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-black tracking-tight">PropTech Admin</CardTitle>
            <CardDescription className="text-slate-400 font-medium">Restricted Access • Authorized Personnel Only</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Admin Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="admin@proptech.in"
                className="bg-slate-800 border-none rounded-xl h-12 text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Security Key</Label>
              <Input 
                id="password" 
                type="password" 
                className="bg-slate-800 border-none rounded-xl h-12 text-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button className="w-full h-12 bg-primary hover:bg-primary-dark font-black rounded-xl gap-2" disabled={isLoading}>
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Access System"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
