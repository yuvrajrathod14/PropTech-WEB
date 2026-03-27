import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { RefreshCcw } from "lucide-react"
import { SearchResults } from "@/components/search/search-results"

interface SearchPageProps {
  searchParams: {
    city?: string;
    type?: string;
    bhk?: string;
    minPrice?: string;
    maxPrice?: string;
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const supabase = createClient()
  
  const city = searchParams.city || "all"
  
  // Initial server-side fetch
  let query = (supabase.from("properties") as any)
    .select(`
      id, 
      title, 
      price, 
      type, 
      bhk, 
      carpet_area_sqft, 
      furnishing, 
      is_featured, 
      created_at, 
      view_count, 
      city, 
      locality, 
      images
    `, { count: 'exact' })
    .eq("status", "live")
  
  if (city && city !== 'all') query = query.or(`city.ilike.%${city}%,locality.ilike.%${city}%,address.ilike.%${city}%`)
  
  const { data, count } = await query
    .order('created_at', { ascending: false })
    .range(0, 11)

  return (
    <Suspense fallback={
       <div className="min-h-screen bg-slate-50 pt-24 flex items-center justify-center">
          <RefreshCcw className="w-8 h-8 animate-spin text-[#1A56DB]" />
       </div>
    }>
      <SearchResults 
        initialProperties={data || []} 
        initialCount={count || 0} 
      />
    </Suspense>
  )
}
