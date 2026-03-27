import { redirect } from "next/navigation"

export default function AdminReportDetailPage({ params }: { params: { id: string } }) {
  // For now, redirect to admin reports list
  // In production, this would show a dedicated report detail with actions
  redirect("/admin/reports")
}
