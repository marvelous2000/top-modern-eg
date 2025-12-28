"use client";

import { useMemo, useState } from "react";
import type { Project } from "@/lib/actions/projects";
import { Navigation } from "@/components/navigation";
import { ContactTracking } from "@/components/contact-tracking";
import { AnimatedSection } from "@/components/ui/animated-section";
import {
  StaggerContainer,
  itemVariants,
} from "@/components/ui/stagger-container";
import { useTranslations } from "next-intl";
import { ProjectCard } from "@/components/ui/project-card";
import { ParallaxHero } from "@/components/ui/parallax-hero";
import { Button } from "@/components/ui/button";

type ProjectsPageClientProps = {
  projects: Project[];
  locale: string;
};

export function ProjectsPageClient({
  projects,
  locale,
}: ProjectsPageClientProps) {
  const t = useTranslations("Projects");

  const categories = useMemo(
    () =>
      Array.from(
        new Set(
          projects
            .map((project) => project.category)
            .filter((category) => category && category.trim() !== "")
        )
      ),
    [projects]
  );
  const locations = useMemo(
    () =>
      Array.from(
        new Set(
          projects
            .map((project) => project.location)
            .filter((location) => location && location.trim() !== "")
        )
      ),
    [projects]
  );

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");

  const filteredProjects = useMemo(
    () =>
      projects.filter((project) => {
        const categoryMatch =
          selectedCategory === "all" ||
          project.category?.toLowerCase().trim() === selectedCategory.toLowerCase().trim();
        const locationMatch =
          selectedLocation === "all" ||
          project.location?.toLowerCase().trim() === selectedLocation.toLowerCase().trim();
        return categoryMatch && locationMatch;
      }),
    [projects, selectedCategory, selectedLocation]
  );

  return (
    <div className="flex flex-col">
      <Navigation />

      <main className="flex-1">
        <ParallaxHero
          backgroundImage="/luxury-marble-kitchen.png"
          className="border-b border-border bg-gradient-to-b from-secondary/50 to-background"
        >
          <div className="container mx-auto px-4 py-24 md:py-32 lg:py-40">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight text-balance md:text-5xl lg:text-6xl">
                {t("signature_projects_title")}
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground text-pretty md:text-xl">
                {t("signature_projects_subtitle")}
              </p>
            </div>
          </div>
        </ParallaxHero>

        <ContactTracking />

        <AnimatedSection>
          <section className="container mx-auto px-6 py-12">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
              <div className="flex flex-col items-start">
                <span className="text-primary font-semibold uppercase tracking-wide mb-4">
                  {t("filter_by_category")}
                </span>
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={() => setSelectedCategory("all")}
                    variant={selectedCategory === "all" ? "default" : "outline"}
                  >
                    {t("all_projects")}
                  </Button>
                  {categories.map((category) => (
                    <Button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      variant={
                        selectedCategory.toLowerCase().trim() === category.toLowerCase().trim() ? "default" : "outline"
                      }
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-start">
                <span className="text-primary font-semibold uppercase tracking-wide mb-4">
                  {t("filter_by_location")}
                </span>
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={() => setSelectedLocation("all")}
                    variant={selectedLocation === "all" ? "default" : "outline"}
                  >
                    {t("all_locations")}
                  </Button>
                  {locations.map((location) => (
                    <Button
                      key={location}
                      onClick={() => setSelectedLocation(location)}
                      variant={
                        selectedLocation.toLowerCase().trim() === location.toLowerCase().trim() ? "default" : "outline"
                      }
                    >
                      {location}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="p-6 border border-primary/30 rounded-xl bg-card/80 backdrop-blur">
                <h3 className="font-serif text-h2 text-primary mb-3">
                  {t("why_choose_us_title")}
                </h3>
                <ul className="space-y-3 text-muted-foreground text-sm">
                  <li>{t("why_choose_us_item_1")}</li>
                  <li>{t("why_choose_us_item_2")}</li>
                  <li>{t("why_choose_us_item_3")}</li>
                  <li>{t("why_choose_us_item_4")}</li>
                </ul>
              </div>
            </div>
          </section>
        </AnimatedSection>

        <AnimatedSection>
          <section className="container mx-auto px-6 py-12">
            <StaggerContainer className="grid gap-12">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.slug}
                  project={project}
                  locale={locale}
                />
              ))}
            </StaggerContainer>

            {filteredProjects.length === 0 && (
              <div className="text-center py-20">
                <h3 className="font-serif text-h2 text-primary mb-4">
                  {t("no_projects_found_heading")}
                </h3>
                <p className="text-muted-foreground">
                  {t("no_projects_found_text")}
                </p>
              </div>
            )}
          </section>
        </AnimatedSection>

        <AnimatedSection>
          <section className="container mx-auto px-6 pb-24">
            <div className="rounded-3xl border border-primary/30 bg-card/90 p-12 text-center">
              <h2 className="font-serif text-h1 mb-6">
                {t("cta_title_projects")}
              </h2>
              <p className="text-body text-muted-foreground mb-10">
                {t("cta_subtitle_projects")}
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button asChild size="lg">
                  <a href={`/${locale}/contact`}>{t("request_consultation")}</a>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a
                    href="mailto:info@topmodern.com"
                    onClick={() =>
                      window.dispatchEvent(
                        new CustomEvent("contactClick", {
                          detail: {
                            type: "email",
                            identifier: "info@topmodern.com",
                            page: "/projects",
                          },
                        })
                      )
                    }
                  >
                    {t("email_our_team")}
                  </a>
                </Button>
              </div>
            </div>
          </section>
        </AnimatedSection>
      </main>
    </div>
  );
}
