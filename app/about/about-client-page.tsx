"use client"

import { MarbleBackground } from "@/components/marble-background"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ContactTracking } from "@/components/contact-tracking"

export function AboutClientPage() {
  return (
    <div className="min-h-screen bg-[#0F0F0F] text-[#FAFAFA] relative overflow-hidden">
      <MarbleBackground />
      <ContactTracking />
      <Navigation />

      <main className="relative z-10 pt-32">
        {/* Hero Section */}
        <section className="container mx-auto px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-playfair text-5xl md:text-7xl font-bold mb-8 text-balance">
              Crafting Luxury with
              <span className="text-[#D4AF37]"> Natural Stone</span>
            </h1>
            <p className="text-xl md:text-2xl text-[#FAFAFA]/80 leading-relaxed">
              For over two decades, Top Modern has been the premier choice for luxury marble and granite solutions
              across the MENA region.
            </p>
          </div>
        </section>

        {/* Company Story */}
        <section className="container mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-8">
                Our <span className="text-[#D4AF37]">Story</span>
              </h2>
              <div className="space-y-6 text-lg leading-relaxed text-[#FAFAFA]/90">
                <p>
                  Founded in 2000, Top Modern began as a vision to bring the world's finest natural stones to the most
                  prestigious projects in Egypt and the broader MENA region.
                </p>
                <p>
                  What started as a small family business has grown into the region's most trusted partner for luxury
                  hotels, high-end restaurants, and premium real estate developments.
                </p>
                <p>
                  Our commitment to excellence, combined with our deep understanding of architectural aesthetics and
                  cultural preferences, has made us the go-to choice for discerning clients who demand nothing but the
                  best.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="/luxury-marble-workshop-with-craftsmen-working-on-p.jpg"
                alt="Top Modern craftsmen working with luxury marble"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </section>

        {/* Mission & Values */}
        <section className="container mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-8">
              Our <span className="text-[#D4AF37]">Mission</span>
            </h2>
            <p className="text-xl text-[#FAFAFA]/80 max-w-3xl mx-auto leading-relaxed">
              To transform spaces with the timeless beauty of natural stone, creating environments that inspire and
              endure for generations.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 border border-[#D4AF37]/20 rounded-lg">
              <div className="w-16 h-16 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-[#0F0F0F] text-2xl font-bold">Q</span>
              </div>
              <h3 className="font-playfair text-2xl font-bold mb-4">Quality Excellence</h3>
              <p className="text-[#FAFAFA]/80 leading-relaxed">
                We source only the finest materials from quarries worldwide, ensuring every project meets the highest
                standards of luxury and durability.
              </p>
            </div>

            <div className="text-center p-8 border border-[#D4AF37]/20 rounded-lg">
              <div className="w-16 h-16 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-[#0F0F0F] text-2xl font-bold">C</span>
              </div>
              <h3 className="font-playfair text-2xl font-bold mb-4">Craftsmanship</h3>
              <p className="text-[#FAFAFA]/80 leading-relaxed">
                Our master craftsmen combine traditional techniques with modern precision to create stunning
                installations that stand the test of time.
              </p>
            </div>

            <div className="text-center p-8 border border-[#D4AF37]/20 rounded-lg">
              <div className="w-16 h-16 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-[#0F0F0F] text-2xl font-bold">S</span>
              </div>
              <h3 className="font-playfair text-2xl font-bold mb-4">Service</h3>
              <p className="text-[#FAFAFA]/80 leading-relaxed">
                From initial consultation to final installation, we provide comprehensive support to ensure your vision
                becomes reality.
              </p>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="container mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-8">
              Two Decades of <span className="text-[#D4AF37]">Excellence</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-[#D4AF37] mb-4">500+</div>
              <p className="text-lg text-[#FAFAFA]/80">Luxury Projects Completed</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-[#D4AF37] mb-4">50+</div>
              <p className="text-lg text-[#FAFAFA]/80">Premium Hotels Served</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-[#D4AF37] mb-4">200+</div>
              <p className="text-lg text-[#FAFAFA]/80">Restaurant Installations</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-[#D4AF37] mb-4">24</div>
              <p className="text-lg text-[#FAFAFA]/80">Years of Experience</p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="container mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-8">
              Meet Our <span className="text-[#D4AF37]">Team</span>
            </h2>
            <p className="text-xl text-[#FAFAFA]/80 max-w-3xl mx-auto leading-relaxed">
              Our success is built on the expertise and dedication of our talented team of designers, craftsmen, and
              project managers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <img
                src="/professional-middle-eastern-business-executive-in-.jpg"
                alt="CEO and Founder"
                className="w-48 h-48 rounded-full mx-auto mb-6 object-cover"
              />
              <h3 className="font-playfair text-2xl font-bold mb-2">Ahmed Hassan</h3>
              <p className="text-[#D4AF37] mb-4">CEO & Founder</p>
              <p className="text-[#FAFAFA]/80 leading-relaxed">
                With over 25 years in the luxury stone industry, Ahmed founded Top Modern with a vision to bring
                world-class natural stone solutions to the MENA region.
              </p>
            </div>

            <div className="text-center">
              <img
                src="/professional-female-architect-with-marble-samples-.jpg"
                alt="Head of Design"
                className="w-48 h-48 rounded-full mx-auto mb-6 object-cover"
              />
              <h3 className="font-playfair text-2xl font-bold mb-2">Layla Mahmoud</h3>
              <p className="text-[#D4AF37] mb-4">Head of Design</p>
              <p className="text-[#FAFAFA]/80 leading-relaxed">
                An award-winning architect with expertise in luxury hospitality design, Layla leads our design team in
                creating stunning stone installations.
              </p>
            </div>

            <div className="text-center">
              <img
                src="/experienced-craftsman-working-with-marble-tools-in.jpg"
                alt="Master Craftsman"
                className="w-48 h-48 rounded-full mx-auto mb-6 object-cover"
              />
              <h3 className="font-playfair text-2xl font-bold mb-2">Omar Farid</h3>
              <p className="text-[#D4AF37] mb-4">Master Craftsman</p>
              <p className="text-[#FAFAFA]/80 leading-relaxed">
                A third-generation stone craftsman, Omar brings traditional techniques and modern precision to every
                project, ensuring flawless execution.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-6 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-8">
              Ready to Transform Your <span className="text-[#D4AF37]">Space?</span>
            </h2>
            <p className="text-xl text-[#FAFAFA]/80 mb-12 leading-relaxed">
              Let's discuss how Top Modern can bring luxury and elegance to your next project with our premium marble
              and granite solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a
                href="/contact"
                className="bg-[#D4AF37] text-[#0F0F0F] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#C41E3A] hover:text-[#FAFAFA] transition-colors duration-300"
              >
                Start Your Project
              </a>
              <a
                href="tel:+201234567890"
                className="border border-[#D4AF37] text-[#D4AF37] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#D4AF37] hover:text-[#0F0F0F] transition-colors duration-300"
                onClick={() =>
                  window.dispatchEvent(
                    new CustomEvent("contactClick", {
                      detail: { type: "phone", identifier: "+201234567890", page: "/about" },
                    }),
                  )
                }
              >
                Call Now
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

