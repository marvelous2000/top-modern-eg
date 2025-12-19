"use client"

import { useEffect, useState, useCallback } from "react"
import Image from "next/image"
import Link from 'next/link'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import type { CarouselApi } from "@/components/ui/carousel"
import type { Project } from "@/lib/actions/projects"
import { Button } from "@/components/ui/button"
import { ArrowRight, MapPin, Calendar, User } from "lucide-react"
import { useTranslations } from "next-intl"

interface FeaturedProjectsCarouselClientProps {
  projects: Project[]
  currentLocale: string
}

export default function FeaturedProjectsCarouselClient({ projects, currentLocale }: FeaturedProjectsCarouselClientProps) {
  const t = useTranslations("HomePage")
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  if (!projects || projects.length === 0) {
    return <div className="text-center text-muted-foreground py-10">{t('no_featured_projects')}</div>;
  }

  return (
    <>
      <div className="relative group">
        <Carousel
          className="w-full border border-gold-500 rounded-2xl overflow-hidden"
          opts={{
            loop: true,
            align: "center"
          }}
          setApi={setApi}
        >
          <CarouselContent>
            {projects.map((project, index) => (
              <CarouselItem key={project.id || index}>
                <div className="bg-white shadow-lg overflow-hidden w-full h-fit">
                  {/* Photo Box */}
                  <div className="relative h-[500px] bg-gray-100">
                     <Image
                      src={project.images?.[0] || "/placeholder.svg"}
                      alt={currentLocale === 'ar' && project.title_ar ? project.title_ar : project.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Details Box */}
                  <div className="p-6 bg-white text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {currentLocale === 'ar' && project.title_ar ? project.title_ar : project.title}
                    </h3>
                    <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-gold-500" />
                        <span>{project.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-gold-500" />
                        <span>{project.year}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4 text-gold-500" />
                        <span>{project.client}</span>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm line-clamp-2 mb-2">
                      {currentLocale === 'ar' && project.description_ar ? project.description_ar : project.description}
                    </p>
                    <Link href={`/${currentLocale}/projects/${project.slug || project.id}`} className="inline-block">
                      <Button className="bg-gold-500 hover:bg-gold-600 text-white text-sm px-4 py-2">
                        {t("view_project")}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>


        </Carousel>
      </div>
      <div className="flex justify-center mt-4 space-x-2">
        {projects.map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              current === index ? 'bg-gold-500' : 'bg-transparent border border-muted'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </>
  )
}