import type { Metadata } from "next"
import { AboutClientPage } from "./about-client-page"

export const metadata: Metadata = {
  title: "About Us - Top Modern | Luxury Marble & Granite",
  description:
    "Learn about Top Modern's journey in providing premium marble and granite solutions to luxury hotels, restaurants, and real estate projects across the MENA region.",
}

export default function AboutPage() {
  return <AboutClientPage />
}
