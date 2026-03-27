import { redirect } from "next/navigation"

// /owner/profile → /buyer/profile (shared profile page)
export default function OwnerProfilePage() {
  redirect("/buyer/profile")
}
