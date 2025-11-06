"use client"

import { Button } from "@/components/ui/button"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { StoneCard } from "@/components/ui/stone-card"
import { PageTransition } from "@/components/ui/page-transition"
import { AnimatedSection } from "@/components/ui/animated-section"
import { StaggerContainer, itemVariants } from "@/components/ui/stagger-container"
import { motion } from "framer-motion"

const products = [
  {
    id: 1,
    name: "Calacatta Gold Marble",
    category: "marble",
    description: "Luxurious white marble with distinctive gold veining",
    price: "Premium",
    image: "/white-marble-with-gold-veins.jpg",
  },
  {
    id: 2,
    name: "Carrara White Marble",
    category: "marble",
    description: "Classic Italian marble with subtle gray veining",
    price: "Premium",
    image: "/carrara-white-marble.jpg",
  },
  {
    id: 3,
    name: "Nero Marquina Marble",
    category: "marble",
    description: "Dramatic black marble with white veining",
    price: "Premium",
    image: "/black-marble-with-white-veins.jpg",
  },
  {
    id: 4,
    name: "Absolute Black Granite",
    category: "granite",
    description: "Deep black granite with consistent color",
    price: "Standard",
    image: "/black-granite-countertop.jpg",
  },
  {
    id: 5,
    name: "Kashmir White Granite",
    category: "granite",
    description: "Light granite with burgundy and gray flecks",
    price: "Standard",
    image: "/white-granite-with-gray-flecks.jpg",
  },
  {
    id: 6,
    name: "Ubatuba Granite",
    category: "granite",
    description: "Dark green granite with gold and white specks",
    price: "Standard",
    image: "/dark-green-granite.jpg",
  },
  {
    id: 7,
    name: "Statuario Quartz",
    category: "quartz",
    description: "Engineered quartz mimicking Statuario marble",
    price: "Premium",
    image: "/white-quartz-marble-look.jpg",
  },
  {
    id: 8,
    name: "Concrete Gray Quartz",
    category: "quartz",
    description: "Modern industrial-style gray quartz",
    price: "Standard",
    image: "/gray-concrete-quartz.jpg",
  },
  {
    id: 9,
    name: "Pure White Quartz",
    category: "quartz",
    description: "Pristine white quartz for contemporary spaces",
    price: "Standard",
    image: "/pure-white-quartz-countertop.jpg",
  },
]

export default function ProductsPage() {
  return (
    <PageTransition>
      <div className="flex flex-col">
        <Header />

        <main className="flex-1">
          {/* Hero Section */}
          <AnimatedSection>
            <section className="border-b border-border bg-secondary/30 py-16">
              <div className="container mx-auto px-4">
                <div className="mx-auto max-w-2xl text-center">
                  <h1 className="font-serif text-4xl font-bold tracking-tight md:text-5xl">Our Products</h1>
                  <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                    Discover our curated collection of premium natural stone and engineered surfaces
                  </p>
                </div>
              </div>
            </section>
          </AnimatedSection>

          {/* Products Grid */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              {/* Marble Section */}
              <div id="marble" className="mb-20">
                <AnimatedSection className="mb-8">
                  <h2 className="font-serif text-3xl font-bold tracking-tight">Marble Collection</h2>
                  <p className="mt-2 text-muted-foreground">Timeless elegance and natural beauty</p>
                </AnimatedSection>
                <StaggerContainer className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {products
                    .filter((p) => p.category === "marble")
                    .map((product) => (
                      <motion.div key={product.id} variants={itemVariants}>
                        <StoneCard
                          image={product.image}
                          title={product.name}
                          description={product.description}
                          badge={product.price}
                        />
                      </motion.div>
                    ))}
                </StaggerContainer>
              </div>

              {/* Granite Section */}
              <div id="granite" className="mb-20">
                <AnimatedSection className="mb-8">
                  <h2 className="font-serif text-3xl font-bold tracking-tight">Granite Collection</h2>
                  <p className="mt-2 text-muted-foreground">Durable strength meets natural sophistication</p>
                </AnimatedSection>
                <StaggerContainer className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {products
                    .filter((p) => p.category === "granite")
                    .map((product) => (
                      <motion.div key={product.id} variants={itemVariants}>
                        <StoneCard
                          image={product.image}
                          title={product.name}
                          description={product.description}
                          badge={product.price}
                        />
                      </motion.div>
                    ))}
                </StaggerContainer>
              </div>

              {/* Quartz Section */}
              <div id="quartz">
                <AnimatedSection className="mb-8">
                  <h2 className="font-serif text-3xl font-bold tracking-tight">Quartz Collection</h2>
                  <p className="mt-2 text-muted-foreground">Engineered perfection for modern living</p>
                </AnimatedSection>
                <StaggerContainer className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {products
                    .filter((p) => p.category === "quartz")
                    .map((product) => (
                      <motion.div key={product.id} variants={itemVariants}>
                        <StoneCard
                          image={product.image}
                          title={product.name}
                          description={product.description}
                          badge={product.price}
                        />
                      </motion.div>
                    ))}
                </StaggerContainer>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <AnimatedSection>
            <section className="border-t border-border bg-secondary/30 py-16">
              <div className="container mx-auto px-4">
                <div className="mx-auto max-w-2xl text-center">
                  <h2 className="font-serif text-3xl font-bold tracking-tight">Need Help Choosing?</h2>
                  <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                    Our stone experts are here to guide you through the selection process
                  </p>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button size="lg" className="mt-8">
                      Schedule Consultation
                    </Button>
                  </motion.div>
                </div>
              </div>
            </section>
          </AnimatedSection>
        </main>

        <Footer />
      </div>
    </PageTransition>
  )
}
