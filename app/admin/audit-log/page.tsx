"use client"

import { useEffect, useState } from "react"
import { History, Shield, CheckCircle2, XCircle, Clock, Filter } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { createClient } from "@/lib/supabase/client"

const actionConfig: Record<string, { label: string; icon: any; color: string; badgeVariant: any }> = {
  approve: { label: "Approved", icon: CheckCircle2, color: "text-emerald-500", badgeVariant: "live" },
  reject: { label: "Rejected", icon: XCircle, color: "text-red-500", badgeVariant: "rejected" },
  block: { label: "Blocked User", icon: Shield, color: "text-orange-500", badgeVariant: "blocked" },
  default: { label: "Action", icon: History, color: "text-slate-400", badgeVariant: "draft" },
}

export default function AdminAuditLogPage() {
  const supabase = createClient()
  const [logs, setLogs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchLogs() {
      const { data } = await (supabase.from("admin_audit_log") as any)
        .select("*, admin:profiles!admin_audit_log_admin_id_fkey(full_name)")
        .order("created_at", { ascending: false })
        .limit(100)
      setLogs(data || [])
      setIsLoading(false)
    }
    fetchLogs()
  }, [])

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <History className="w-6 h-6 text-slate-600" />
            <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">Audit Log</h1>
          </div>
          <p className="text-slate-500 font-medium">Complete history of all admin actions taken on the platform.</p>
        </div>
        <Button variant="outline" className="h-12 rounded-2xl border-slate-100 bg-white font-bold gap-2">
          <Filter className="w-4 h-4" /> Filter
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">{Array(8).fill(0).map((_, i) => <div key={i} className="h-16 bg-slate-100 animate-pulse rounded-[16px]" />)}</div>
      ) : logs.length === 0 ? (
        <EmptyState title="No Actions Yet" description="Admin actions will appear here once performed." icon={History} className="py-32 bg-white rounded-[32px]" />
      ) : (
        <div className="space-y-2">
          {logs.map((log) => {
            const cfg = actionConfig[log.action] || actionConfig.default
            const Icon = cfg.icon
            return (
              <Card key={log.id} className="border-none shadow-sm rounded-[16px] bg-white px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center ${cfg.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-slate-900 text-sm">
                      <span className="text-slate-500 font-bold">{log.admin?.full_name || "Admin"}</span>
                      {" "}{cfg.label} a listing
                    </p>
                    {log.details && <p className="text-xs text-slate-400 font-medium truncate">{log.details}</p>}
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <Badge variant={cfg.badgeVariant}>{log.action || "action"}</Badge>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(log.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
