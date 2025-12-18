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
  useCarousel,
} from "@/components/ui/carousel"
import type { CarouselApi } from '@/components/ui/carousel'
import { getFeaturedProjects } from "@/lib/actions/projects" // Will create this
import type { Project } from "@/lib/actions/projects" // Assuming Project type is here
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function FeaturedProjectsCarousel() {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0)
  const [api, setApi] = useState<CarouselApi | null>(null)

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const result = await getFeaturedProjects() // Fetch featured projects
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

  // Listen for carousel select events when API is available
  useEffect(() => {
    if (!api) return

    const onSelect = () => setCurrentProjectIndex(api.selectedScrollSnap())

    // initialize
    setCurrentProjectIndex(api.selectedScrollSnap())
    api.on('select', onSelect)

    return () => {
      try {
        api.off('select', onSelect)
      } catch (err) {
        console.warn('Failed to remove carousel select listener', err)
      }
    }
  }, [api])

  if (loading) {
    return (
      <section className="py-20 relative bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xl">Loading featured projects...</p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-20 relative bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xl text-red-500">{error}</p>
        </div>
      </section>
    )
  }

  if (featuredProjects.length === 0) {
    return (
      <section className="py-20 relative bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xl">No featured projects available at the moment.</p>
        </div>
      </section>
    )
  }

  const currentProject = featuredProjects[currentProjectIndex];

  return (
    <section className="relative w-full h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden bg-black">
      {/* Background Image Carousel */}
      <Carousel
        className="w-full h-full"
        opts={{ loop: true }}
        setApi={setApi}
      >
        <CarouselContent className="h-full">
          {featuredProjects.map((project, index) => (
            <CarouselItem key={project.id || index} className="h-full">
              <div className="relative h-full w-full">
                <Image
                  src={project.images?.[0] || "/placeholder.svg"}
                  alt={project.title}
                  fill
                  priority={index === 0} // Prioritize loading the first image
                  className="object-cover transition-opacity duration-1000 ease-in-out"
                  style={{ opacity: index === currentProjectIndex ? 1 : 0.5 }} // Dim non-active images
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* Navigation buttons can be placed here if desired */}
      </Carousel>

      {/* Project Details Overlay */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="relative z-20 text-center text-white max-w-3xl mx-auto space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentProject.id} // Key to enable AnimatePresence transitions
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-sm uppercase tracking-widest text-gold-500 mb-2 block">
                Featured Project
              </span>
              <h2 className="text-4xl md:text-6xl font-bold font-serif mb-4 leading-tight">
                {currentProject.title}
              </h2>
              <p className="text-lg md:text-xl text-white/80 mb-6 line-clamp-3">
                {currentProject.description}
              </p>
              <Link href={`/projects/${currentProject.slug || currentProject.id}`} passHref>
                <Button size="lg" className="btn btn-primary">
                  View Project <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Dot Navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
        {featuredProjects.map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              index === currentProjectIndex ? "bg-gold-500 w-6" : "bg-white/50 hover:bg-white/80"
            }`}
            onClick={() => {
              setCurrentProjectIndex(index)
              if (api && typeof api.scrollTo === 'function') {
                try {
                  api.scrollTo(index)
                } catch (err) {
                  console.warn('Failed to scroll carousel to index', err)
                }
              }
            }}
            aria-label={`Go to project ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
