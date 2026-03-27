"use client"

import { useState } from "react"
import { CreditCard, Save, Eye, EyeOff, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function AdminSettingsPaymentsPage() {
  const [showSecret, setShowSecret] = useState(false)
  const [saved, setSaved] = useState(false)
  const [settings, setSettings] = useState({
    keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
    keySecret: "**********************",
    webhookSecret: "**********************",
    tokenAmount: "50000",
    platformFeePercent: "2",
  })

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <CreditCard className="w-6 h-6 text-slate-600" />
          <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">Payment Settings</h1>
        </div>
        <p className="text-slate-500 font-medium">Configure Razorpay API keys and commission structure.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-none shadow-sm rounded-[32px]">
          <CardHeader>
            <CardTitle className="font-black italic">Razorpay Configuration</CardTitle>
            <CardDescription>API keys for payment processing. Keep your secret key confidential.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Key ID (Public)</label>
              <Input
                value={settings.keyId}
                onChange={e => setSettings(p => ({ ...p, keyId: e.target.value }))}
                placeholder="rzp_live_..."
                className="h-12 rounded-2xl bg-slate-50 border-none font-mono"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Key Secret</label>
              <div className="relative">
                <Input
                  type={showSecret ? "text" : "password"}
                  value={settings.keySecret}
                  onChange={e => setSettings(p => ({ ...p, keySecret: e.target.value }))}
                  className="h-12 rounded-2xl bg-slate-50 border-none font-mono pr-12"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowSecret(!showSecret)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl w-8 h-8 text-slate-400"
                >
                  {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Webhook Secret</label>
              <Input
                type="password"
                value={settings.webhookSecret}
                onChange={e => setSettings(p => ({ ...p, webhookSecret: e.target.value }))}
                className="h-12 rounded-2xl bg-slate-50 border-none font-mono"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm rounded-[32px]">
          <CardHeader>
            <CardTitle className="font-black italic">Commission Structure</CardTitle>
            <CardDescription>Configure token amounts and platform fees charged to buyers.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Default Token Amount (₹)</label>
              <Input
                type="number"
                value={settings.tokenAmount}
                onChange={e => setSettings(p => ({ ...p, tokenAmount: e.target.value }))}
                className="h-12 rounded-2xl bg-slate-50 border-none"
              />
              <p className="text-xs text-slate-400">The standard booking token charged to buyers.</p>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Platform Fee (%)</label>
              <Input
                type="number"
                value={settings.platformFeePercent}
                onChange={e => setSettings(p => ({ ...p, platformFeePercent: e.target.value }))}
                className="h-12 rounded-2xl bg-slate-50 border-none"
              />
              <p className="text-xs text-slate-400">Percentage charged on top of token amount.</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Current Total Charge</p>
              <p className="text-2xl font-black text-primary">
                ₹{(parseInt(settings.tokenAmount || "0") + (parseInt(settings.tokenAmount || "0") * parseInt(settings.platformFeePercent || "0") / 100)).toLocaleString("en-IN")}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="h-12 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black px-10 gap-2">
          {saved ? <><CheckCircle2 className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Changes</>}
        </Button>
      </div>
    </div>
  )
}
