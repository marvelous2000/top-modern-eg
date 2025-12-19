"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import type { CarouselApi } from '@/components/ui/carousel'
import { getFeaturedProjects } from "@/lib/actions/projects"
import type { Project } from "@/lib/actions/projects"
import { Button } from "@/components/ui/button"
import { ArrowRight, MapPin, Calendar, User } from "lucide-react"
import { useTranslations } from "next-intl"

export function FeaturedProjectsCarousel() {
  const t = useTranslations('home')
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0)
  const [api, setApi] = useState<CarouselApi | null>(null)

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const result = await getFeaturedProjects()
        if (result.success && result.data) {
          setFeaturedProjects(result.data)
        } else {
          setError(result.error || "Failed to fetch featured projects")
        }
      } catch (err) {
        console.error("Error fetching featured projects:", err)
        setError("Failed to fetch featured projects")
      } finally {
        setLoading(false)
      }
    }
    fetchFeatured()
  }, [])

  useEffect(() => {
    if (!api) return
    const onSelect = () => setCurrentProjectIndex(api.selectedScrollSnap())
    api.on('select', onSelect)
    return () => {
      api.off('select', onSelect)
    }
  }, [api])

  if (loading) {
    return (
      <section className="py-20 relative bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xl">Loading featured projects...</p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-20 relative bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xl text-red-500">{error}</p>
        </div>
      </section>
    )
  }

  if (featuredProjects.length === 0) {
    return (
      <section className="py-20 relative bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xl">No featured projects available.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t("featured_projects_title")}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t("featured_projects_description")}
          </p>
        </div>

        <div className="relative group max-w-4xl mx-auto">
          <Carousel
            className="w-full"
            opts={{
              loop: true,
              align: "center"
            }}
            setApi={setApi}
          >
            <CarouselContent>
              {featuredProjects.map((project, index) => (
                <CarouselItem key={project.id || index} className="flex justify-center">
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-md w-full">
                    {/* Photo Box */}
                    <div className="relative h-96 bg-gray-100 border-b border-gray-200">
                       <Image
                        src={project.images?.[0] || "/placeholder.svg"}
                        alt={project.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Details Box */}
                    <div className="p-6 bg-white">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{project.title}</h3>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-accent" />
                          <span>{project.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-accent" />
                          <span>{project.year}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-accent" />
                          <span>{project.client}</span>
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm line-clamp-2 mb-4">
                        {project.description}
                      </p>
                      <Link href={`/projects/${project.slug || project.id}`} className="inline-block">
                        <Button className="bg-gold-500 hover:bg-gold-600 text-white">
                          {t("view_project")}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious className="absolute top-1/2 -translate-y-1/2 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/80 hover:bg-white text-gray-800 h-10 w-10 rounded-full shadow-md" />
            <CarouselNext className="absolute top-1/2 -translate-y-1/2 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/80 hover:bg-white text-gray-800 h-10 w-10 rounded-full shadow-md" />
          </Carousel>
        </div>
      </div>
    </section>
  )
}
