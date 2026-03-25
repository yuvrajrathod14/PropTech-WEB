import { Hero } from "@/components/landing/hero"
import { PropertyTypeExplorer } from "@/components/landing/property-type-explorer"
import { FeaturedProperties } from "@/components/landing/featured-properties"
import { HowItWorks } from "@/components/landing/how-it-works"
import { RecentProperties } from "@/components/landing/recent-properties"
import { CityExplorer } from "@/components/landing/city-explorer"
import { WhyChooseUs } from "@/components/landing/why-choose-us"
import { Testimonials } from "@/components/landing/testimonials"
import { CTABanner } from "@/components/landing/cta-banner"

export default function LandingPage() {
  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      <Hero />
      <PropertyTypeExplorer />
      <FeaturedProperties />
      <HowItWorks />
      <RecentProperties />
      <CityExplorer />
      <WhyChooseUs />
      <Testimonials />
      <CTABanner />
    </div>
  )
}
