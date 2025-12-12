'use client';
import { useTranslations } from 'next-intl';
import { Card, CardContent } from "@/components/ui/card"
import { AnimatedSection } from "@/components/ui/animated-section"
import { StaggerContainer, itemVariants } from "@/components/ui/stagger-container"
import { PageTransition } from "@/components/ui/page-transition"
import { TimelineItem } from "@/components/ui/timeline-item"
import { Award, Users, Target, Heart } from "lucide-react"
import { motion } from "framer-motion"
import { Navigation } from '@/components/navigation';

export default function AboutPage() {
  const t = useTranslations('about');

  return (
    <PageTransition>
      <div className="flex flex-col">
        <Navigation />

        <main className="flex-1 pt-16">
          {/* Hero Section */}
          <AnimatedSection>
            <section className="border-b border border-border bg-secondary/30 py-16 md:py-20">
              <div className="container mx-auto px-4">
                <div className="mx-auto max-w-2xl text-center">
                  <h1 className="font-serif text-4xl font-bold tracking-tight md:text-5xl">{t('title')}</h1>
                  <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                    {t('subtitle')}
                  </p>
                </div>
              </div>
            </section>
          </AnimatedSection>

          {/* Story Section */}
          <AnimatedSection>
            <section className="border-b border border-border py-16">
              <div className="container mx-auto px-4">
                <div className="mx-auto max-w-3xl">
                  <h2 className="font-serif text-3xl font-bold tracking-tight">{t('ourStory')}</h2>
                  <div className="mt-6 space-y-4 text-lg leading-relaxed text-muted-foreground">
                    <p>
                      {t('storyContent.p1')}
                    </p>
                    <p>
                      {t('storyContent.p2')}
                    </p>
                    <p>
                      {t('storyContent.p3')}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </AnimatedSection>

          {/* Our Journey Timeline */}
          <section className="border-b border border-border py-16 md:py-20">
            <div className="container mx-auto px-4">
              <AnimatedSection className="mx-auto mb-12 md:mb-16 max-w-2xl text-center">
                <h2 className="font-serif text-3xl font-bold tracking-tight md:text-4xl">{t('ourJourney')}</h2>
                <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                  {t('journeySubtitle')}
                </p>
              </AnimatedSection>

              <div className="relative mx-auto max-w-4xl">
                <div className="space-y-12 md:space-y-16">
                  <TimelineItem year="1994" title={t('timeline.1994.title')} isLeft={true}>
                    <p>
                      {t('timeline.1994.description')}
                    </p>
                  </TimelineItem>

                  <TimelineItem year="2005" title={t('timeline.2005.title')} isLeft={false}>
                    <p>
                      {t('timeline.2005.description')}
                    </p>
                  </TimelineItem>

                  <TimelineItem year="2015" title={t('timeline.2015.title')} isLeft={true}>
                    <p>
                      {t('timeline.2015.description')}
                    </p>
                  </TimelineItem>

                  <TimelineItem year="2024" title={t('timeline.2024.title')} isLeft={false}>
                    <p>
                      {t('timeline.2024.description')}
                    </p>
                  </TimelineItem>
                </div>
              </div>
            </div>
          </section>

          {/* Values Section */}
          <section className="border-b border-border bg-secondary/30 py-16">
            <div className="container mx-auto px-4">
              <AnimatedSection className="mx-auto mb-12 max-w-2xl text-center">
                <h2 className="font-serif text-3xl font-bold tracking-tight">{t('ourValues')}</h2>
                <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                  {t('valuesSubtitle')}
                </p>
              </AnimatedSection>

              <StaggerContainer className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                {[
                  {
                    icon: Award,
                    title: t('values.excellence.title'),
                    description: t('values.excellence.description'),
                  },
                  {
                    icon: Users,
                    title: t('values.craftsmanship.title'),
                    description: t('values.craftsmanship.description'),
                  },
                  {
                    icon: Target,
                    title: t('values.precision.title'),
                    description: t('values.precision.description'),
                  },
                  {
                    icon: Heart,
                    title: t('values.integrity.title'),
                    description: t('values.integrity.description'),
                  },
                ].map((value, index) => (
                  <motion.div key={index} variants={itemVariants} transition={{ ease: [0.4, 0, 0.2, 1] }}>
                    <Card className="border border-border bg-card">
                      <CardContent className="pt-6">
                        <div className="flex flex-col items-center text-center">
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ duration: 0.3 }}
                            className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/20"
                          >
                            <value.icon className="h-6 w-6 text-accent" />
                          </motion.div>
                          <h3 className="mt-4 font-semibold text-lg">{value.title}</h3>
                          <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-base">{value.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </StaggerContainer>
            </div>
          </section>

          {/* Team Section */}
          <AnimatedSection>
            <section className="border-b border-border py-16">
              <div className="container mx-auto px-4">
                <div className="mx-auto mb-12 max-w-2xl text-center">
                  <h2 className="font-serif text-3xl font-bold tracking-tight">{t('expertise')}</h2>
                  <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                    {t('expertiseSubtitle')}
                  </p>
                </div>

                <div className="mx-auto max-w-3xl space-y-12">
                  {[
                    {
                      number: t('stats.years.number'),
                      title: t('stats.years.title'),
                      description: t('stats.years.description'),
                    },
                    {
                      number: t('stats.projects.number'),
                      title: t('stats.projects.title'),
                      description: t('stats.projects.description'),
                    },
                    {
                      number: t('stats.satisfaction.number'),
                      title: t('stats.satisfaction.title'),
                      description: t('stats.satisfaction.description'),
                    },
                  ].map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-6"
                    >
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/20"
                      >
                        <span className="font-serif text-xl font-bold text-accent">{stat.number}</span>
                      </motion.div>
                      <div>
                        <h3 className="font-semibold text-lg">{stat.title}</h3>
                        <p className="mt-2 leading-relaxed text-muted-foreground text-base">{stat.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          </AnimatedSection>

          {/* CTA Section */}
          <AnimatedSection>
            <section className="bg-black py-16 text-white">
              <div className="container mx-auto px-4">
                <div className="mx-auto max-w-2xl text-center">
                  <h2 className="font-serif text-3xl font-bold tracking-tight">{t('experienceDifference')}</h2>
                  <p className="mt-4 text-lg leading-relaxed opacity-90">
                    {t('experienceDescription')}
                  </p>
                </div>
              </div>
            </section>
          </AnimatedSection>
        </main>
      </div>
    </PageTransition>
  )
}
