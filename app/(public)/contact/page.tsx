import { Metadata } from "next"
import { ContactContent } from "@/components/public/contact-content"

export const metadata: Metadata = {
  title: "Contact PropTech | 24/7 Real Estate Support",
  description: "Have questions? Our support team is here to help you with property listings, bookings, and platform support.",
}

export default function ContactPage() {
  return <ContactContent />
}
