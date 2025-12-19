"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { itemVariants } from "@/components/ui/stagger-container";
import { Project } from "@/lib/actions/projects";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { isArabic } from "@/lib/locale-utils";

interface ProjectCardProps {
  project: Project;
  locale: string;
}

export function ProjectCard({ project, locale }: ProjectCardProps) {
  const t = useTranslations("Projects");

  return (
    <motion.div variants={itemVariants}>
      <article className="border border-primary/20 rounded-3xl overflow-hidden bg-card/80 backdrop-blur max-w-4xl mx-auto">
        <div className="relative">
          <img
            src={project.images?.[0] || "/placeholder.svg"}
            alt={isArabic(locale) ? project.title_ar : project.title}
            className="h-full w-full min-h-[300px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/40" />
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em] text-primary">
              <span className="break-words">
                {isArabic(locale) ? project.category_ar : project.category}
              </span>
              <span className="text-muted-foreground">&bull;</span>
              <span className="break-words">
                {isArabic(locale) ? project.location_ar : project.location}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-6 bg-card/90 p-8 flex flex-col">
          <div className="flex-1">
            <h2 className="font-serif text-h2 text-foreground break-words mb-4">
              {isArabic(locale) ? project.title_ar : project.title}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6 break-words line-clamp-4">
              {isArabic(locale) ? project.description_ar : project.description}
            </p>

            {project.results && project.results.length > 0 && (
              <div className="grid gap-2 text-sm text-muted-foreground mb-6">
                {(isArabic(locale)
                  ? project.results_ar || project.results
                  : project.results
                )
                  .slice(0, 3)
                  .map((result: string, index: number) => (
                    <div key={index} className="flex items-start gap-2">
                      <span
                        className="mt-1 size-1.5 rounded-full bg-primary/80 shrink-0"
                        aria-hidden="true"
                      />
                      <span className="break-words">{result}</span>
                    </div>
                  ))}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-auto">
            <Button asChild variant="primary" size="lg" className="shrink-0">
              <Link href={`/${locale}/projects/${project.slug}`} >
                {t("view_case_study")}
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </Button>
            <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground break-words">
              {project.year} &bull;{" "}
              {isArabic(locale) ? project.client_ar : project.client}
            </div>
          </div>
        </div>
      </article>
    </motion.div>
  );
}
