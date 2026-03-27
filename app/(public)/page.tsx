import { Hero } from "@/components/landing/hero"
import { PropertyTypeExplorer } from "@/components/landing/property-type-explorer"
import { FeaturedProperties } from "@/components/landing/featured-properties"
import { HowItWorks } from "@/components/landing/how-it-works"
import { RecentProperties } from "@/components/landing/recent-properties"
import { CityExplorer } from "@/components/landing/city-explorer"
import { WhyChooseUs } from "@/components/landing/why-choose-us"
import { Testimonials } from "@/components/landing/testimonials"
import { CTABanner } from "@/components/landing/cta-banner"
import { createClient } from "@/lib/supabase/server"

export default async function LandingPage() {
  const supabase = createClient()

  // Fetch data in parallel on the server
  const [featuredResponse, recentResponse] = await Promise.all([
    supabase
      .from("properties")
      .select("*")
      .eq("is_featured", true)
      .eq("status", "live")
      .limit(6),
    supabase
      .from("properties")
      .select("*")
      .eq("status", "live")
      .order("created_at", { ascending: false })
      .limit(6)
  ])

  const featuredProperties = featuredResponse.data || []
  const recentProperties = recentResponse.data || []
  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      <Hero />
      <PropertyTypeExplorer />
      <FeaturedProperties initialProperties={featuredProperties} />
      <HowItWorks />
      <RecentProperties initialProperties={recentProperties} />
      <CityExplorer />
      <WhyChooseUs />
      <Testimonials />
      <CTABanner />
    </div>
  )
}
