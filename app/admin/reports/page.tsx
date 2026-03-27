"use client"

import { useEffect, useState } from "react"
import { Flag, Eye, CheckCircle2, User, Home, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { EmptyState } from "@/components/ui/empty-state"
import { createClient } from "@/lib/supabase/client"

export default function AdminReportsPage() {
  const supabase = createClient()
  const [reports, setReports] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Fetch reports from admin_audit_log where action = 'report'
    // or a dedicated reports table if available
    async function fetchReports() {
      const { data } = await (supabase.from("admin_audit_log") as any)
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50)
      setReports(data || [])
      setIsLoading(false)
    }
    fetchReports()
  }, [])

  return (
    <div className="space-y-8 pb-20">
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <Flag className="w-6 h-6 text-red-500" />
          <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">Reports Queue</h1>
        </div>
        <p className="text-slate-500 font-medium">User-submitted reports and flagged content review.</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">{Array(5).fill(0).map((_, i) => <div key={i} className="h-20 bg-slate-100 animate-pulse rounded-[24px]" />)}</div>
      ) : reports.length === 0 ? (
        <EmptyState
          title="No Reports"
          description="No user reports or flagged content at this time."
          icon={CheckCircle2}
          className="py-32 bg-white rounded-[32px]"
        />
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <Card key={report.id} className="border-none shadow-sm rounded-[24px] bg-white p-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <p className="font-black text-slate-900">{report.action || "Unknown Action"}</p>
                    <p className="text-xs text-slate-400 font-medium">{report.details} · {new Date(report.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {report.property_id && (
                    <Button asChild size="sm" variant="outline" className="rounded-xl border-slate-200 font-bold text-[10px] uppercase tracking-widest gap-1.5">
                      <Link href={`/admin/listings/${report.property_id}`}>
                        <Home className="w-3.5 h-3.5" /> View Listing
                      </Link>
                    </Button>
                  )}
                  {report.admin_id && (
                    <Button asChild size="sm" variant="outline" className="rounded-xl border-slate-200 font-bold text-[10px] uppercase tracking-widest gap-1.5">
                      <Link href={`/admin/users/${report.admin_id}`}>
                        <User className="w-3.5 h-3.5" /> View User
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
