import { Metadata } from "next"
import { TermsContent } from "@/components/public/terms-content"

export const metadata: Metadata = {
  title: "Terms of Service | PropTech India",
  description: "Read our terms and conditions for using the PropTech platform.",
}

export default function TermsPage() {
  return <TermsContent />
}
