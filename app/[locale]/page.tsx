import { getTranslations } from "next-intl/server";
import { getSafeLocale } from '@/lib/locale-utils';
import { Navigation } from "@/components/navigation"
import { AnimatedSection } from "@/components/ui/animated-section"
import { PageTransition } from "@/components/ui/page-transition"
// no client-side link needed in server page
import HomeHeroClient from './_components/home-hero-client';
import WhyChooseUsClient from './_components/why-choose-us-client';
import FeaturedProductsClient from './_components/featured-products-client';
import PageCtaClient from './_components/page-cta-client';

// New client component for carousel logic
// import FeaturedProjectsCarouselClient from "./_components/featured-projects-carousel-client" // This import will be removed soon

import FeaturedProjectsCarouselClient from './_components/featured-projects-carousel-client';
import { getFeaturedProjects } from '@/lib/actions/projects';

export default async function HomePage({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: "HomePage" });
  const currentLocale = getSafeLocale(params.locale);


  return (
    <PageTransition>
      <div className="flex flex-col">
        <Navigation />

        <main className="flex-1">
          {/* Hero Section with Parallax */}
          <HomeHeroClient
            heroTitle={t('heroTitle')}
            heroSubtitle={t('heroSubtitle')}
            exploreProductsLabel={t('exploreProducts')}
            contactUsLabel={t('contactUs')}
            currentLocale={currentLocale}
          />

          {/* Recent Projects Carousel - Now handled by client component */}
          <section className="py-20 bg-secondary/20">
            <div className="container mx-auto px-4">
              <div className="mx-auto w-full max-w-[90%] md:max-w-[80%]">
                <div className="text-center mb-12">
                  <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight">{t('recent_projects_title')}</h2>
                  <p className="mt-4 text-lg text-muted-foreground">{t('recent_projects_subtitle')}</p>
                </div>

                {/* Fetch featured projects server-side and pass to the client carousel */}
                {/** Featured projects fetched server-side to avoid using an async child component inside a client tree */}
                <FeaturedProjectsCarouselClient projects={(await getFeaturedProjects()).data || []} currentLocale={currentLocale} />

              </div>
            </div>
          </section>

          {/* Why Choose Us Section */}
          <section className="border-b border-border bg-secondary/30 py-20">
            <div className="container mx-auto px-4">
              <AnimatedSection className="mx-auto max-w-2xl text-center">
                <h2 className="font-serif text-3xl font-bold tracking-tight md:text-4xl">{t('why_choose_us_title')}</h2>
                <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                  {t('why_choose_us_subtitle')}
                </p>
              </AnimatedSection>

              <WhyChooseUsClient
                items={[
                  { title: t('quality_title'), description: t('quality_description') },
                  { title: t('craftsmen_title'), description: t('craftsmen_description') },
                  { title: t('design_title'), description: t('design_description') },
                  { title: t('satisfaction_title'), description: t('satisfaction_description') },
                ]}
              />
            </div>
          </section>

          {/* Featured Products Section */}
          <section className="border-b border-border py-20">
            <div className="container mx-auto px-4">
              <AnimatedSection className="mx-auto max-w-2xl text-center">
                <h2 className="font-serif text-3xl font-bold tracking-tight md:text-4xl">{t('featured_collections_title')}</h2>
                <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                  {t('featured_collections_subtitle')}
                </p>
              </AnimatedSection>

              <FeaturedProductsClient
                products={[
                  { image: "/white-marble-slab.jpg", title: t('product_type_marble'), description: t('product_type_marble_description'), href: "/products#marble" },
                  { image: "/black-granite-countertop.jpg", title: t('product_type_granite'), description: t('product_type_granite_description'), href: "/products#granite" },
                  { image: "/white-quartz-countertop.jpg", title: t('product_type_quartz'), description: t('product_type_quartz_description'), href: "/products#quartz" },
                ]}
              />
            </div>
          </section>

          {/* CTA Section */}
          <AnimatedSection>
            <section className="bg-black py-20 text-white text-center px-4">
              <PageCtaClient title={t('cta_title')} subtitle={t('cta_subtitle')} ctaLabel={t('cta.getStarted')} locale={currentLocale} />
            </section>
          </AnimatedSection>
        </main>
      </div>
    </PageTransition>
  )
}
