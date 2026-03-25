import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import { BookingClient } from "./booking-client"

export default async function BookingPage({ 
  params 
}: { 
  params: { propertyId: string } 
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Fetch Property Details
  const { data: property, error: propertyError } = await supabase
    .from("properties")
    .select("*, profiles!properties_owner_id_fkey(full_name)")
    .eq("id", params.propertyId)
    .single()

  if (propertyError || !property) {
    notFound()
  }

  // Fetch User Profile for prefill
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="container mx-auto px-4 scale-95 md:scale-100 transition-all">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Token Booking</h1>
            <p className="text-slate-500 font-medium">Home &gt; Property &gt; Book</p>
          </div>

          <BookingClient 
            property={property} 
            user={user} 
            profile={profile} 
          />
        </div>
      </div>
    </div>
  )
}
