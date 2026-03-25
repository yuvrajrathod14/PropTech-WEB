import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { BookingSuccessClient } from "./success-client"

export default async function BookingSuccessPage({
  searchParams
}: {
  searchParams: { id: string }
}) {
  if (!searchParams.id) notFound()

  const supabase = createClient()
  const { data: booking, error } = await supabase
    .from("bookings")
    .select("*, properties(title, images, location)")
    .eq("id", searchParams.id)
    .single()

  if (error || !booking) notFound()

  return <BookingSuccessClient booking={booking} />
}
