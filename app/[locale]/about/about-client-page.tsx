"use client"

import { MarbleBackground } from "@/components/marble-background"
import { Navigation } from "@/components/navigation"
import Footer from "@/components/footer"
import { ContactTracking } from "@/components/contact-tracking"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"

export function AboutClientPage() {
  const heroRef = useRef(null)
  const storyRef = useRef(null)
  const missionRef = useRef(null)
  const statsRef = useRef(null)
  const teamRef = useRef(null)
  const ctaRef = useRef(null)

  const heroInView = useInView(heroRef, { once: true, margin: "-100px" })
  const storyInView = useInView(storyRef, { once: true, margin: "-100px" })
  const missionInView = useInView(missionRef, { once: true, margin: "-100px" })
  const statsInView = useInView(statsRef, { once: true, margin: "-100px" })
  const teamInView = useInView(teamRef, { once: true, margin: "-100px" })
  const ctaInView = useInView(ctaRef, { once: true, margin: "-100px" })

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <MarbleBackground />
      <ContactTracking />
      <Navigation />

      <main className="relative z-10">
        {/* Hero Section */}
        <section
          ref={heroRef}
          className="relative h-screen px-6 bg-cover bg-center bg-no-repeat flex items-center"
          style={{
            backgroundImage: `url('/carrara-marble-white-gray-veining-luxury.jpg')`,
          }}
        >
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="relative z-10 container mx-auto">
            <div className="max-w-4xl mx-auto text-center text-white">
              <motion.h1
                className="text-4xl md:text-6xl font-bold mb-8 text-balance"
                initial="hidden"
                animate={heroInView ? "visible" : "hidden"}
                variants={itemVariants}
              >
                Crafting Luxury with
                <span className="text-primary"> Natural Stone</span>
              </motion.h1>
              <motion.p
                className="text-xl text-white/90 max-w-2xl mx-auto"
                initial="hidden"
                animate={heroInView ? "visible" : "hidden"}
                variants={itemVariants}
                transition={{ delay: 0.2 }}
              >
                For over two decades, Top Modern has been the premier choice for luxury marble and granite solutions
                across the MENA region.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Company Story */}
        <section ref={storyRef} className="container mx-auto px-6 py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              animate={storyInView ? "visible" : "hidden"}
              variants={itemVariants}
            >
              <h2 className="text-h2 mb-12">
                Our <span className="text-primary">Story</span>
              </h2>
              <div className="space-y-6 text-body">
                <motion.p
                  variants={itemVariants}
                  transition={{ delay: 0.1 }}
                >
                  Founded in 2000, Top Modern began as a vision to bring the world's finest natural stones to the most
                  prestigious projects in Egypt and the broader MENA region.
                </motion.p>
                <motion.p
                  variants={itemVariants}
                  transition={{ delay: 0.2 }}
                >
                  What started as a small family business has grown into the region's most trusted partner for luxury
                  hotels, high-end restaurants, and premium real estate developments.
                </motion.p>
                <motion.p
                  variants={itemVariants}
                  transition={{ delay: 0.3 }}
                >
                  Our commitment to excellence, combined with our deep understanding of architectural aesthetics and
                  cultural preferences, has made us the go-to choice for discerning clients who demand nothing but the
                  best.
                </motion.p>
              </div>
            </motion.div>
            <motion.div
              className="relative"
              initial="hidden"
              animate={storyInView ? "visible" : "hidden"}
              variants={itemVariants}
              transition={{ delay: 0.4 }}
            >
              <img
                src="/luxury-marble-workshop-with-craftsmen-working-on-p.jpg"
                alt="Top Modern craftsmen working with luxury marble"
                className="rounded-xl shadow-2xl border border-primary/20"
              />
            </motion.div>
          </div>
        </section>

        {/* Mission & Values */}
        <section ref={missionRef} className="container mx-auto px-6 py-24">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            animate={missionInView ? "visible" : "hidden"}
            variants={itemVariants}
          >
            <h2 className="text-h2 mb-8">
              Our <span className="text-primary">Mission</span>
            </h2>
            <p className="text-body text-muted-foreground max-w-3xl mx-auto">
              To transform spaces with the timeless beauty of natural stone, creating environments that inspire and
              endure for generations.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            initial="hidden"
            animate={missionInView ? "visible" : "hidden"}
            variants={containerVariants}
          >
            <motion.div
              className="bg-card text-card-foreground p-8 border border-primary/20 rounded-xl shadow-lg hover:shadow-primary/10 transition-all duration-300"
              variants={itemVariants}
            >
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-6 font-sans font-bold text-2xl">
                Q
              </div>
              <h3 className="font-sans text-2xl font-bold mb-4 text-center">Quality Excellence</h3>
              <p className="text-muted-foreground leading-relaxed">
                We source only the finest materials from quarries worldwide, ensuring every project meets the highest
                standards of luxury and durability.
              </p>
            </motion.div>

            <motion.div
              className="bg-card text-card-foreground p-8 border border-primary/20 rounded-xl shadow-lg hover:shadow-primary/10 transition-all duration-300"
              variants={itemVariants}
            >
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-6 font-sans font-bold text-2xl">
                C
              </div>
              <h3 className="font-sans text-2xl font-bold mb-4 text-center">Craftsmanship</h3>
              <p className="text-muted-foreground leading-relaxed">
                Our master craftsmen combine traditional techniques with modern precision to create stunning
                installations that stand the test of time.
              </p>
            </motion.div>

            <motion.div
              className="bg-card text-card-foreground p-8 border border-primary/20 rounded-xl shadow-lg hover:shadow-primary/10 transition-all duration-300"
              variants={itemVariants}
            >
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-6 font-sans font-bold text-2xl">
                S
              </div>
              <h3 className="font-sans text-2xl font-bold mb-4 text-center">Service</h3>
              <p className="text-muted-foreground leading-relaxed">
                From initial consultation to final installation, we provide comprehensive support to ensure your vision
                becomes reality.
              </p>
            </motion.div>
          </motion.div>
        </section>

        {/* Statistics */}
        <section ref={statsRef} className="container mx-auto px-6 py-24">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            animate={statsInView ? "visible" : "hidden"}
            variants={itemVariants}
          >
            <h2 className="text-h2 mb-8">
              Two Decades of <span className="text-primary">Excellence</span>
            </h2>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-4 gap-8"
            initial="hidden"
            animate={statsInView ? "visible" : "hidden"}
            variants={containerVariants}
          >
            <motion.div className="text-center" variants={itemVariants}>
              <div className="text-5xl font-bold text-primary mb-4">500+</div>
              <p className="text-body text-muted-foreground">Luxury Projects Completed</p>
            </motion.div>
            <motion.div className="text-center" variants={itemVariants}>
              <div className="text-5xl font-bold text-primary mb-4">50+</div>
              <p className="text-body text-muted-foreground">Premium Hotels Served</p>
            </motion.div>
            <motion.div className="text-center" variants={itemVariants}>
              <div className="text-5xl font-bold text-primary mb-4">200+</div>
              <p className="text-body text-muted-foreground">Restaurant Installations</p>
            </motion.div>
            <motion.div className="text-center" variants={itemVariants}>
              <div className="text-5xl font-bold text-primary mb-4">24</div>
              <p className="text-body text-muted-foreground">Years of Experience</p>
            </motion.div>
          </motion.div>
        </section>

        {/* Team Section */}
        <section ref={teamRef} className="container mx-auto px-6 py-24">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            animate={teamInView ? "visible" : "hidden"}
            variants={itemVariants}
          >
            <h2 className="text-h2 mb-8">
              Meet Our <span className="text-primary">Team</span>
            </h2>
            <p className="text-body text-muted-foreground max-w-3xl mx-auto">
              Our success is built on the expertise and dedication of our talented team of designers, craftsmen, and
              project managers.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            initial="hidden"
            animate={teamInView ? "visible" : "hidden"}
            variants={containerVariants}
          >
            <motion.div
              className="text-center bg-card text-card-foreground p-8 rounded-xl shadow-lg border border-primary/20"
              variants={itemVariants}
            >
              <img
                src="/professional-middle-eastern-business-executive-in-.jpg"
                alt="CEO and Founder"
                className="w-48 h-48 rounded-full mx-auto mb-6 object-cover border-4 border-primary/20"
              />
              <h3 className="font-sans text-2xl font-bold mb-2">Ahmed Hassan</h3>
              <p className="text-primary font-semibold mb-4">CEO & Founder</p>
              <p className="text-muted-foreground leading-relaxed">
                With over 25 years in the luxury stone industry, Ahmed founded Top Modern with a vision to bring
                world-class natural stone solutions to the MENA region.
              </p>
            </motion.div>

            <motion.div
              className="text-center bg-card text-card-foreground p-8 rounded-xl shadow-lg border border-primary/20"
              variants={itemVariants}
            >
              <img
                src="/professional-female-architect-with-marble-samples-.jpg"
                alt="Head of Design"
                className="w-48 h-48 rounded-full mx-auto mb-6 object-cover border-4 border-primary/20"
              />
              <h3 className="font-sans text-2xl font-bold mb-2">Layla Mahmoud</h3>
              <p className="text-primary font-semibold mb-4">Head of Design</p>
              <p className="text-muted-foreground leading-relaxed">
                An award-winning architect with expertise in luxury hospitality design, Layla leads our design team in
                creating stunning stone installations.
              </p>
            </motion.div>

            <motion.div
              className="text-center bg-card text-card-foreground p-8 rounded-xl shadow-lg border border-primary/20"
              variants={itemVariants}
            >
              <img
                src="/experienced-craftsman-working-with-marble-tools-in.jpg"
                alt="Master Craftsman"
                className="w-48 h-48 rounded-full mx-auto mb-6 object-cover border-4 border-primary/20"
              />
              <h3 className="font-sans text-2xl font-bold mb-2">Omar Farid</h3>
              <p className="text-primary font-semibold mb-4">Master Craftsman</p>
              <p className="text-muted-foreground leading-relaxed">
                A third-generation stone craftsman, Omar brings traditional techniques and modern precision to every
                project, ensuring flawless execution.
              </p>
            </motion.div>
          </motion.div>
        </section>

        {/* CTA Section */}
        <section ref={ctaRef} className="container mx-auto px-6 py-24">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial="hidden"
            animate={ctaInView ? "visible" : "hidden"}
            variants={itemVariants}
          >
            <h2 className="text-h2 mb-8">
              Ready to Transform Your <span className="text-primary">Space?</span>
            </h2>
            <p className="text-body text-muted-foreground mb-12">
              Let's discuss how Top Modern can bring luxury and elegance to your next project with our premium marble
              and granite solutions.
            </p>
            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center"
              initial="hidden"
              animate={ctaInView ? "visible" : "hidden"}
              variants={containerVariants}
            >
              <motion.a
                href="/contact"
                className="glass-primary rounded-xl font-sans font-semibold px-8 py-4 text-lg hover:shadow-primary/40 transition-all duration-300"
                variants={itemVariants}
              >
                Start Your Project
              </motion.a>
              <motion.a
                href="tel:+201234567890"
                className="border-2 border-primary text-primary rounded-xl font-sans font-semibold px-8 py-4 text-lg hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                onClick={() =>
                  window.dispatchEvent(
                    new CustomEvent("contactClick", {
                      detail: { type: "phone", identifier: "+201234567890", page: "/about" },
                    }),
                  )
                }
                variants={itemVariants}
              >
                Call Now
              </motion.a>
            </motion.div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
