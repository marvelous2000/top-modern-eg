import { MarbleBackground } from "@/components/marble-background"
import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { ProductsSection } from "@/components/products-section"
import { ProjectsSection } from "@/components/projects-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <main className="relative">
      <MarbleBackground />
      <Navigation />
      <HeroSection />
      <ProductsSection />
      <ProjectsSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
