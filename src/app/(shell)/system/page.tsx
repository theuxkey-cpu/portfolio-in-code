import { redirect } from "next/navigation"
import { LANDING_SLUG } from "@/lib/registry/meta"

export default function SystemIndexPage() {
  redirect(`/system/${LANDING_SLUG}`)
}
