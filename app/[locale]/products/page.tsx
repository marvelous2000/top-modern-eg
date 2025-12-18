"use client";

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { getSafeLocale } from '@/lib/locale-utils';
import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"
import { StoneCard } from "@/components/ui/stone-card"
import { PageTransition } from "@/components/ui/page-transition"
import { AnimatedSection } from "@/components/ui/animated-section"
import { StaggerContainer, itemVariants } from "@/components/ui/stagger-container"
import { motion } from "framer-motion"
import Link from "next/link"

export default function ProductsPage() {
  const t = useTranslations('products');
  const params = useParams();
  const currentLocale = getSafeLocale(params.locale);

  const products = [
    {
      id: 1,
      name: t('marbleProducts.calacattaGold.name'),
      category: "marble",
      description: t('marbleProducts.calacattaGold.description'),
      price: t('marbleProducts.calacattaGold.category'),
      image: "/white-marble-with-gold-veins.jpg",
    },
    {
      id: 2,
      name: t('marbleProducts.carraraWhite.name'),
      category: "marble",
      description: t('marbleProducts.carraraWhite.description'),
      price: t('marbleProducts.carraraWhite.category'),
      image: "/carrara-white-marble.jpg",
    },
    {
      id: 3,
      name: t('marbleProducts.neroMarquina.name'),
      category: "marble",
      description: t('marbleProducts.neroMarquina.description'),
      price: t('marbleProducts.neroMarquina.category'),
      image: "/black-marble-with-white-veins.jpg",
    },
    {
      id: 4,
      name: t('graniteProducts.absoluteBlack.name'),
      category: "granite",
      description: t('graniteProducts.absoluteBlack.description'),
      price: t('graniteProducts.absoluteBlack.category'),
      image: "/black-granite-countertop.jpg",
    },
    {
      id: 5,
      name: t('graniteProducts.kashmirWhite.name'),
      category: "granite",
      description: t('graniteProducts.kashmirWhite.description'),
      price: t('graniteProducts.kashmirWhite.category'),
      image: "/white-granite-with-gray-flecks.jpg",
    },
    {
      id: 6,
      name: t('graniteProducts.ubatuba.name'),
      category: "granite",
      description: t('graniteProducts.ubatuba.description'),
      price: t('graniteProducts.ubatuba.category'),
      image: "/dark-green-granite.jpg",
    },
    {
      id: 7,
      name: t('quartzProducts.statuario.name'),
      category: "quartz",
      description: t('quartzProducts.statuario.description'),
      price: t('quartzProducts.statuario.category'),
      image: "/white-quartz-marble-look.jpg",
    },
    {
      id: 8,
      name: t('quartzProducts.concreteGray.name'),
      category: "quartz",
      description: t('quartzProducts.concreteGray.description'),
      price: t('quartzProducts.concreteGray.category'),
      image: "/gray-concrete-quartz.jpg",
    },
    {
      id: 9,
      name: t('quartzProducts.pureWhite.name'),
      category: "quartz",
      description: t('quartzProducts.pureWhite.description'),
      price: t('quartzProducts.pureWhite.category'),
      image: "/pure-white-quartz-countertop.jpg",
    },
  ]

  return (
    <PageTransition>
      <div className="flex flex-col">
        <Navigation />

        <main className="flex-1 pt-16">
          {/* Hero Section */}
          <AnimatedSection>
            <section className="border-b border-border bg-secondary/30 py-20 md:py-24">
              <div className="container mx-auto px-6">
                <div className="mx-auto max-w-2xl text-center">
                  <h1 className="font-serif text-4xl font-bold tracking-tight md:text-5xl">{t('title')}</h1>
                  <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                    {t('subtitle')}
                  </p>
                </div>
              </div>
            </section>
          </AnimatedSection>

          {/* Products Grid */}
          <section className="py-20 md:py-24">
            <div className="container mx-auto px-6">
              {/* Marble Section */}
              <div id="marble" className="mb-20">
                <AnimatedSection className="mb-8">
                  <h2 className="font-serif text-3xl font-bold tracking-tight">{t('collections.marble')}</h2>
                  <p className="mt-2 text-muted-foreground">{t('collections.marbleSubtitle')}</p>
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
                          href={`/products/${product.id}`}
                        />
                      </motion.div>
                    ))}
                </StaggerContainer>
              </div>

              {/* Granite Section */}
              <div id="granite" className="mb-20">
                <AnimatedSection className="mb-8">
                  <h2 className="font-serif text-3xl font-bold tracking-tight">{t('collections.granite')}</h2>
                  <p className="mt-2 text-muted-foreground">{t('collections.graniteSubtitle')}</p>
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
                          href={`/products/${product.id}`}
                        />
                      </motion.div>
                    ))}
                </StaggerContainer>
              </div>

              {/* Quartz Section */}
              <div id="quartz">
                <AnimatedSection className="mb-8">
                  <h2 className="font-serif text-3xl font-bold tracking-tight">{t('collections.quartz')}</h2>
                  <p className="mt-2 text-muted-foreground">{t('collections.quartzSubtitle')}</p>
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
                          href={`/${t('locale')}/products/${product.id}`}
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
                  <h2 className="font-serif text-3xl font-bold tracking-tight">{t('cta.needHelpChoosing')}</h2>
                  <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                    {t('cta.expertsGuide')}
                  </p>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button asChild size="lg" className="mt-8">
                      <Link href={`/${currentLocale}/contact`}>{t('cta.getStarted')}</Link>
                    </Button>
                  </motion.div>
                </div>
              </div>
            </section>
          </AnimatedSection>
        </main>
      </div>
    </PageTransition>
  )
}
