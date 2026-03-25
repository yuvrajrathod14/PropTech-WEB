import { Metadata } from "next"
import { AboutContent } from "@/components/public/about-content"

export const metadata: Metadata = {
  title: "About PropTech | Redefining Real Estate in India",
  description: "Meet the team and discover the mission behind India's most transparent real estate marketplace.",
}

export default function AboutPage() {
  return <AboutContent />
}
