"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Star, Award, Users, Phone, Mail } from "lucide-react"
import { useContactTracking } from "@/components/contact-tracking"

export function HeroSection() {
  const { trackContact } = useContactTracking()

  const handleExploreClick = () => {
    trackContact("cta_click", {
      source: "hero_section",
      action: "explore_collection",
    })
  }

  const handleConsultationClick = () => {
    trackContact("cta_click", {
      source: "hero_section",
      action: "schedule_consultation",
    })
  }

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-24"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4)), url('/images/luxury-marble-flooring.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in-up">
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 text-balance luxury-text-shadow">
            Luxury <span className="gold-text-glow">Marble</span>
            <br />& <span className="gold-text-glow">Granite</span> Solutions
          </h1>
        </div>

        <div className="animate-fade-in-up animation-delay-200">
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto text-pretty font-inter">
            Premium natural stone solutions for luxury real estate, hotels, and restaurants across the MENA region
          </p>
        </div>

        <div className="animate-fade-in-up animation-delay-400 flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Button
            size="lg"
            className="luxury-button bg-primary text-black hover:bg-primary/90 text-lg px-8 py-4 font-inter font-semibold"
            onClick={handleExploreClick}
          >
            Explore Our Collection
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="luxury-button border-primary text-primary hover:bg-primary hover:text-black text-lg px-8 py-4 bg-transparent font-inter font-semibold"
            onClick={handleConsultationClick}
          >
            Schedule Consultation
          </Button>
        </div>

        <div className="animate-fade-in-up animation-delay-600 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
          <div className="flex flex-col items-center group">
            <div className="bg-primary/10 p-6 rounded-full mb-4 group-hover:bg-primary/20 transition-colors duration-300">
              <Star className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-2 font-serif">500+</h3>
            <p className="text-gray-400 font-inter">Luxury Projects Completed</p>
          </div>

          <div className="flex flex-col items-center group">
            <div className="bg-primary/10 p-6 rounded-full mb-4 group-hover:bg-primary/20 transition-colors duration-300">
              <Award className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-2 font-serif">15+</h3>
            <p className="text-gray-400 font-inter">Years of Excellence</p>
          </div>

          <div className="flex flex-col items-center group">
            <div className="bg-primary/10 p-6 rounded-full mb-4 group-hover:bg-primary/20 transition-colors duration-300">
              <Users className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-2 font-serif">200+</h3>
            <p className="text-gray-400 font-inter">Satisfied Clients</p>
          </div>
        </div>

        <div className="animate-fade-in-up animation-delay-800">
          <div className="floating-cta-bridge inline-flex items-center space-x-6 px-8 py-4 rounded-full">
            <div className="flex items-center space-x-2 text-primary">
              <Phone className="h-4 w-4" />
              <span className="font-inter font-medium">+20 123 456 7890</span>
            </div>
            <div className="w-px h-4 bg-primary/30"></div>
            <div className="flex items-center space-x-2 text-primary">
              <Mail className="h-4 w-4" />
              <span className="font-inter font-medium">info@topmodern.com</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
