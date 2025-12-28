import type { Metadata } from "next";
import ContactClientPage from "./contact-client-page";

export const metadata: Metadata = {
  title: "Contact Us - Top Modern | Get Your Luxury Marble Quote",
  description: "Contact Top Modern for premium marble and granite solutions. Get expert consultation and quotes for your luxury hotel, restaurant, or real estate project.",
};

export default function ContactPage() {
  return <ContactClientPage />;
}