"use client";

import React from "react";
import { Navigation } from "@/components/navigation";
import { ContactTracking } from "@/components/contact-tracking";
import type { Project } from "@/lib/actions/projects";
import { isArabic } from "@/lib/locale-utils";
import { AnimatedSection } from "@/components/ui/animated-section";
import { useTranslations } from "next-intl";
import { ParallaxHero } from "@/components/ui/parallax-hero";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type ProjectPageProps = {
  project: Project;
  slug: string;
  locale: string;
};

const ProjectPageClient = ({ project, slug, locale }: ProjectPageProps) => {
  const t = useTranslations("Projects");

  return (
    <div className="flex flex-col">
      <Navigation />

      <main className="flex-1">
        <ParallaxHero backgroundImage={project.images[0] || "/placeholder.svg"}>
          <div className="relative z-10 container mx-auto px-6 py-20">
            <div className="max-w-4xl mx-auto text-center text-white">
              <div className="flex flex-wrap items-center justify-center gap-4 mb-8 text-sm uppercase tracking-[0.3em] text-primary">
                <span className="break-words bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
                  {isArabic(locale)
                    ? project.category_ar || project.category
                    : project.category}
                </span>
                <span className="text-white/60">&bull;</span>
                <span className="break-words bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
                  {isArabic(locale)
                    ? project.location_ar || project.location
                    : project.location}
                </span>
                <span className="text-white/60">&bull;</span>
                <span className="break-words bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
                  {project.year}
                </span>
              </div>

              <h1 className="font-serif text-5xl md:text-7xl font-bold text-balance mb-8 break-words leading-tight">
                {isArabic(locale) ? project.title_ar || project.title : project.title}
              </h1>

              <p className="text-white/90 text-xl md:text-2xl leading-relaxed break-words max-w-3xl mx-auto mb-12">
                {isArabic(locale)
                  ? project.description_ar || project.description
                  : project.description}
              </p>
            </div>
          </div>
        </ParallaxHero>

        <ContactTracking />

        <AnimatedSection>
          <section className="container mx-auto px-6 py-20">
            <div className="grid gap-12 lg:grid-cols-3 items-start">
              <div className="lg:col-span-2 space-y-12">
                <div className="grid gap-8 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-serif text-2xl font-bold text-primary mb-4">
                        {t("project_challenge_title")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed break-words">
                        {isArabic(locale)
                          ? project.challenge_ar || project.challenge
                          : project.challenge}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="font-serif text-2xl font-bold text-primary mb-4">
                        {t("our_solution_title")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed break-words">
                        {isArabic(locale)
                          ? project.solution_ar || project.solution
                          : project.solution}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif text-3xl font-bold text-primary mb-8">
                      {t("project_highlights_title")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 md:grid-cols-2">
                      {(isArabic(locale)
                        ? project.results_ar || project.results
                        : project.results
                      ).map((result, index) => (
                        <div key={index} className="flex gap-4 group">
                          <div className="mt-1 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                            <div className="w-3 h-3 bg-primary rounded-full" />
                          </div>
                          <p className="text-muted-foreground leading-relaxed break-words">
                            {result}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <aside className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif text-2xl font-bold text-primary mb-6">
                      {t("project_details_title")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-6">
                      <div className="flex justify-between items-center py-3 border-b border-primary/10">
                        <dt className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
                          {t("client_label")}
                        </dt>
                        <dd className="text-foreground font-semibold break-words text-right">
                          {isArabic(locale)
                            ? project.client_ar || project.client
                            : project.client}
                        </dd>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-primary/10">
                        <dt className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
                          {t("location_label")}
                        </dt>
                        <dd className="text-foreground font-semibold break-words text-right">
                          {isArabic(locale)
                            ? project.location_ar || project.location
                            : project.location}
                        </dd>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-primary/10">
                        <dt className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
                          {t("year_label")}
                        </dt>
                        <dd className="text-foreground font-semibold break-words text-right">
                          {project.year}
                        </dd>
                      </div>
                      <div className="flex justify-between items-center py-3">
                        <dt className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
                          {t("category_label")}
                        </dt>
                        <dd className="text-foreground font-semibold break-words text-right">
                          {isArabic(locale)
                            ? project.category_ar || project.category
                            : project.category}
                        </dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif text-2xl font-bold text-primary mb-6">
                      {t("materials_used_title")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {(isArabic(locale)
                        ? project.materials_ar || project.materials
                        : project.materials
                      ).map((material, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 group"
                        >
                          <div className="w-2 h-2 bg-primary rounded-full shrink-0 group-hover:scale-125 transition-transform" />
                          <span className="text-muted-foreground break-words">
                            {material}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </aside>
            </div>
          </section>
        </AnimatedSection>

        <AnimatedSection>
          <section className="container mx-auto px-6 py-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-center mb-10">
              {t("project_gallery_title")}
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {project.images.map((image, index) => (
                <div
                  key={index}
                  className="relative overflow-hidden rounded-2xl border border-primary/10"
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${
                      isArabic(locale) ? project.title_ar : project.title
                    } gallery image ${index + 1}`}
                    className="h-64 w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </section>
        </AnimatedSection>

        {project.testimonial && (
          <AnimatedSection>
            <section className="container mx-auto px-6 py-16">
              <Card className="max-w-4xl mx-auto text-center">
                <CardHeader>
                  <CardTitle className="font-serif text-3xl md:text-4xl font-bold mb-8">
                    {t("client_testimonial_title")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <blockquote className="text-2xl md:text-3xl font-serif italic text-foreground/85 leading-relaxed mb-8 break-words">
                    "
                    {isArabic(locale)
                      ? project.testimonial_ar?.quote ||
                        project.testimonial?.quote
                      : project.testimonial?.quote}
                    "
                  </blockquote>
                  <div className="text-sm uppercase tracking-[0.3em] text-foreground/40 mb-2 break-words">
                    {isArabic(locale)
                      ? project.testimonial_ar?.position ||
                        project.testimonial?.position
                      : project.testimonial?.position}
                  </div>
                  <div className="text-lg font-semibold text-primary break-words">
                    {isArabic(locale)
                      ? project.testimonial_ar?.author ||
                        project.testimonial?.author
                      : project.testimonial?.author}
                  </div>
                </CardContent>
              </Card>
            </section>
          </AnimatedSection>
        )}

        <AnimatedSection>
          <section className="container mx-auto px-6 py-20">
            <div className="max-w-4xl mx-auto text-center rounded-3xl border border-primary/30 bg-card/90 p-12">
              <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">
                {t("cta_title_project_detail")}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-10 break-words">
                {t("cta_subtitle_project_detail")}
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button asChild size="lg">
                  <a href={`/${locale}/contact`}>{t("start_your_project")}</a>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a
                    href="tel:+201234567890"
                    onClick={() =>
                      window.dispatchEvent(
                        new CustomEvent("contactClick", {
                          detail: {
                            type: "phone",
                            identifier: "+201234567890",
                            page: `/projects/${slug}`,
                          },
                        })
                      )
                    }
                  >
                    {t("call_expert")}
                  </a>
                </Button>
              </div>
            </div>
          </section>
        </AnimatedSection>
      </main>
    </div>
  );
};

export default ProjectPageClient;