import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-1">
        <div className="min-h-screen bg-background py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-invert max-w-none">
              <h1 className="font-serif text-4xl font-bold text-foreground mb-8">Terms of Service</h1>

              <div className="space-y-6 text-muted-foreground">
                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Acceptance of Terms</h2>
                  <p>
                    By accessing and using this website, you accept and agree to be bound by the terms and provision of
                    this agreement.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Services</h2>
                  <p>
                    Top Modern provides premium marble and granite solutions for commercial and residential projects
                    across the MENA region.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">User Responsibilities</h2>
                  <p>
                    Users must provide accurate information and use our services in compliance with applicable laws and
                    regulations.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Limitation of Liability</h2>
                  <p>
                    Top Modern shall not be liable for any indirect, incidental, or consequential damages arising from
                    the use of our services.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Contact Information</h2>
                  <p>For questions regarding these terms, contact us at legal@topmodern.com.</p>
                </section>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
