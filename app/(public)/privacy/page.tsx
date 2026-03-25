import { Metadata } from "next"
import { PrivacyContent } from "@/components/public/privacy-content"

export const metadata: Metadata = {
  title: "Privacy Policy | PropTech India",
  description: "Your data security is our priority. Learn how we protect your personal information.",
}

export default function PrivacyPage() {
  return <PrivacyContent />
}
