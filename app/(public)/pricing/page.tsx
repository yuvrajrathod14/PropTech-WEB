import { Metadata } from "next"
import { PricingContent } from "@/components/public/pricing-content"

export const metadata: Metadata = {
  title: "PropTech Pricing | Affordable Listing & Boost Plans",
  description: "Explore our flexible pricing plans. Free listings, premium boosts, and specialized services for owners.",
}

export default function PricingPage() {
  return <PricingContent />
}
