import { Metadata } from "next"
import { HowItWorksContent } from "@/components/public/how-it-works-content"

export const metadata: Metadata = {
  title: "How PropTech Works | Transparent Real Estate Process",
  description: "Learn about our seamless 4-step process for buyers and sellers. Search, verify, book, and own.",
}

export default function HowItWorksPage() {
  return <HowItWorksContent />
}
