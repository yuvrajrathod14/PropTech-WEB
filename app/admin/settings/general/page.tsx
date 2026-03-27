"use client"

import { useState } from "react"
import { Settings, Save, Globe, Bell, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function AdminSettingsGeneralPage() {
  const [settings, setSettings] = useState({
    platformName: "PropTech",
    supportEmail: "support@proptech.com",
    maxImages: "10",
    tokenAmount: "50000",
    platformFee: "2",
  })
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <Settings className="w-6 h-6 text-slate-600" />
          <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">General Settings</h1>
        </div>
        <p className="text-slate-500 font-medium">Configure core platform settings and defaults.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-none shadow-sm rounded-[32px]">
          <CardHeader>
            <CardTitle className="font-black italic flex items-center gap-2"><Globe className="w-5 h-5 text-primary" />Platform Info</CardTitle>
            <CardDescription>Basic platform identity and branding.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { key: "platformName", label: "Platform Name", placeholder: "PropTech" },
              { key: "supportEmail", label: "Support Email", placeholder: "support@example.com" },
            ].map(f => (
              <div key={f.key} className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{f.label}</label>
                <Input
                  value={settings[f.key as keyof typeof settings]}
                  onChange={e => setSettings(p => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  className="h-12 rounded-2xl bg-slate-50 border-none"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm rounded-[32px]">
          <CardHeader>
            <CardTitle className="font-black italic flex items-center gap-2"><Bell className="w-5 h-5 text-primary" />Platform Defaults</CardTitle>
            <CardDescription>Default values used across the platform.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { key: "maxImages", label: "Max Images Per Listing", placeholder: "10" },
              { key: "tokenAmount", label: "Token Amount (₹)", placeholder: "50000" },
              { key: "platformFee", label: "Platform Fee (%)", placeholder: "2" },
            ].map(f => (
              <div key={f.key} className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{f.label}</label>
                <Input
                  type="number"
                  value={settings[f.key as keyof typeof settings]}
                  onChange={e => setSettings(p => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  className="h-12 rounded-2xl bg-slate-50 border-none"
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="h-12 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black px-10 gap-2">
          <Save className="w-4 h-4" />
          {saved ? "Saved!" : "Save Changes"}
        </Button>
      </div>
    </div>
  )
}
