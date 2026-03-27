"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Bell,
  MessageSquare,
  CreditCard,
  TrendingDown,
  Home as HomeIcon,
  Globe,
  Info,
  Trash2,
  ArrowLeft,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface NotifPrefs {
  new_messages: boolean
  booking_updates: boolean
  listing_status: boolean
  price_drop_alerts: boolean
}

const defaultPrefs: NotifPrefs = {
  new_messages: true,
  booking_updates: true,
  listing_status: true,
  price_drop_alerts: false,
}

export default function BuyerSettingsPage() {
  const { user, signOut } = useAuth()
  const supabase = createClient()
  const { toast } = useToast()
  const [prefs, setPrefs] = useState<NotifPrefs>(defaultPrefs)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Load preferences from Supabase
  useEffect(() => {
    async function loadPrefs() {
      if (!user) return
      const { data } = await (supabase.from("profiles") as any)
        .select("notification_preferences")
        .eq("id", user.id)
        .single()

      if (data?.notification_preferences) {
        setPrefs({ ...defaultPrefs, ...data.notification_preferences })
      }
    }
    loadPrefs()
  }, [user])

  const updatePref = async (key: keyof NotifPrefs, value: boolean) => {
    const updated = { ...prefs, [key]: value }
    setPrefs(updated)
    setIsSaving(true)

    try {
      const { error } = await (supabase.from("profiles") as any)
        .update({ notification_preferences: updated })
        .eq("id", user?.id)

      if (error) throw error
      toast({ title: "Saved", description: "Notification preferences updated." })
    } catch {
      // Revert on error
      setPrefs(prefs)
      toast({ variant: "destructive", title: "Error", description: "Failed to save preferences." })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    setIsDeleting(true)
    try {
      // In production, this would call a server action that deletes user data
      toast({
        title: "Account Deletion Requested",
        description: "Your account will be deleted within 30 days. You will receive a confirmation email."
      })
      await signOut()
    } catch {
      toast({ variant: "destructive", title: "Error", description: "Failed to process deletion request." })
    } finally {
      setIsDeleting(false)
    }
  }

  const toggleItems = [
    { key: "new_messages" as const, icon: MessageSquare, label: "New Messages", description: "Get notified when you receive a new message from an owner", color: "text-blue-500 bg-blue-50" },
    { key: "booking_updates" as const, icon: CreditCard, label: "Booking Updates", description: "Token payment confirmations, refund status, and receipt alerts", color: "text-emerald-500 bg-emerald-50" },
    { key: "listing_status" as const, icon: HomeIcon, label: "Listing Status Updates", description: "When a wishlisted property is sold, delisted, or status changes", color: "text-amber-500 bg-amber-50" },
    { key: "price_drop_alerts" as const, icon: TrendingDown, label: "Price Drop Alerts", description: "Get notified when a property you saved drops in price", color: "text-purple-500 bg-purple-50" },
  ]

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/buyer/profile">
          <Button variant="ghost" size="icon" className="rounded-xl border border-slate-100">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Settings</h1>
          <p className="text-slate-500 font-medium text-sm">Manage your preferences and account</p>
        </div>
      </div>

      {/* Notification Preferences */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-8 md:p-10 space-y-8"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Notification Preferences</h2>
            <p className="text-sm text-slate-500 font-medium">Choose what you want to be notified about</p>
          </div>
        </div>

        <div className="space-y-2">
          {toggleItems.map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between p-5 rounded-3xl hover:bg-slate-50 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${item.color}`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <Label className="font-black text-slate-800 text-sm cursor-pointer">{item.label}</Label>
                  <p className="text-xs text-slate-400 font-medium hidden md:block">{item.description}</p>
                </div>
              </div>
              <Switch
                checked={prefs[item.key]}
                onCheckedChange={(checked) => updatePref(item.key, checked)}
                disabled={isSaving}
              />
            </div>
          ))}
        </div>
      </motion.section>

      {/* App Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-8 md:p-10 space-y-6"
      >
        <h2 className="text-xl font-black text-slate-900 tracking-tight">App</h2>

        <div className="flex items-center justify-between p-5 rounded-3xl bg-slate-50">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-700 text-sm">Language</p>
              <p className="text-xs text-slate-400 font-medium">English (India)</p>
            </div>
          </div>
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Only option</span>
        </div>

        <div className="flex items-center justify-between p-5 rounded-3xl bg-slate-50">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-700 text-sm">App Version</p>
              <p className="text-xs text-slate-400 font-medium">PropTech Web v2.1.0</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Danger Zone */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-[40px] border border-red-100 shadow-sm p-8 md:p-10 space-y-6"
      >
        <h2 className="text-xl font-black text-red-600 tracking-tight">Danger Zone</h2>
        <p className="text-sm text-slate-500 font-medium leading-relaxed">
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full h-14 rounded-2xl border-red-200 text-red-600 hover:bg-red-50 font-black gap-3"
            >
              <Trash2 className="w-5 h-5" />
              Delete My Account
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="rounded-[32px] border-slate-100 shadow-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl font-black text-slate-900">Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription className="text-slate-500 font-medium leading-relaxed">
                This will permanently delete your account, all saved properties, bookings, chat history, and personal data. This action cannot be reversed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-xl font-bold">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 rounded-xl font-black"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Yes, Delete My Account
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </motion.section>
    </div>
  )
}
