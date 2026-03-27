import { redirect } from "next/navigation"

// /buyer/search → /search (public search page)
export default function BuyerSearchPage() {
  redirect("/search")
}
