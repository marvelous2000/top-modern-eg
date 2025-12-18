"use client"

import { useEffect, useState, useCallback } from "react"
import Image from "next/image"
import Link from 'next/link'
import { motion, AnimatePresence } from "framer-motion"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import type { CarouselApi } from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import type { Project } from "@/lib/actions/projects"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useTranslations } from "next-intl"

interface FeaturedProjectsCarouselClientProps {
  projects: Project[]
  currentLocale: string
}

export default function FeaturedProjectsCarouselClient({ projects, currentLocale }: FeaturedProjectsCarouselClientProps) {
  const t = useTranslations("HomePage")
  const [api, setApi] = useState<CarouselApi | null>(null); // State for carousel API
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);

  // Debugging logs
  console.log("FeaturedProjectsCarouselClient - projects prop:", projects);
  
  useEffect(() => {
    if (!api) return;

    // Set initial project index
    setCurrentProjectIndex(api.selectedScrollSnap());

    // Listen for slide changes
    api.on("select", () => {
      setCurrentProjectIndex(api.selectedScrollSnap());
    });
  }, [api]);


  // Autoplay functionality using Autoplay plugin
  const [plugins] = useState([
    Autoplay({
      delay: 5000,
      stopOnInteraction: false,
      stopOnMouseEnter: false,
    }),
  ]);

  const goToSlide = useCallback((index: number) => {
    if (api) {
      api.scrollTo(index);
    }
  }, [api]);

  if (!projects || projects.length === 0) {
    return <div className="text-center text-muted-foreground py-10">{t('no_featured_projects')}</div>;
  }

  const currentProject = projects[currentProjectIndex];
  console.log("FeaturedProjectsCarouselClient - currentProject:", currentProject);

  return (
    <section className="relative w-full h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden rounded-lg bg-black group">
      {/* Background Image Carousel */}
      <Carousel
        className="w-full h-full"
        opts={{ loop: true }}
        plugins={plugins}
        setApi={setApi} // Set the API for external control
      >
        <CarouselContent className="h-full">
          {projects.map((project, index) => (
            <CarouselItem key={project.id} className="h-full">
              <div className="relative h-full w-full">
                <Image
                  src={project.images?.[0] || "/placeholder.svg"}
                  alt={project.title}
                  fill
                  priority={index === 0}
                  className="object-cover transition-opacity duration-1000 ease-in-out"
                  style={{ opacity: index === currentProjectIndex ? 1 : 0.5 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* Carousel Navigation Arrows */}
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Carousel>

      {/* Project Details Overlay */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="relative z-20 text-center text-white max-w-3xl mx-auto space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentProject.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-sm uppercase tracking-widest text-gold-500 mb-2 block">
                {t('featured_project')}
              </span>
              <h2 className="text-4xl md:text-6xl font-bold font-serif mb-4 leading-tight">
                {currentLocale === 'ar' && currentProject.title_ar ? currentProject.title_ar : currentProject.title}
              </h2>
              <p className="text-lg md:text-xl text-white/80 mb-6 line-clamp-3">
                {currentLocale === 'ar' && currentProject.description_ar ? currentProject.description_ar : currentProject.description}
              </p>
              <Link href={`/${currentLocale}/projects/${currentProject.slug || currentProject.id}`} passHref>
                <Button size="lg" className="btn btn-primary">
                  {t('view_project')} <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Dot Navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
        {projects.map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              index === currentProjectIndex ? "bg-gold-500 w-6" : "bg-white/50 hover:bg-white/80"
            }`}
            onClick={() => goToSlide(index)}
            aria-label={t('go_to_slide', { slide: index + 1 })}
          />
        ))}
      </div>
    </section>
  )
}