"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Star, Award, Users, Phone, Mail } from "lucide-react"
import { useContactTracking } from "@/components/contact-tracking"
import { motion } from "framer-motion"
import Prism from './Prism';
import { useTranslations } from "@/components/providers/TranslationsProvider"

export function HeroSection() {
  const { trackContact } = useContactTracking()
  const { t } = useTranslations()

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
      className="relative min-h-screen flex items-center justify-center pt-24 overflow-hidden"
    >
      {/* OGL Prism Background */}
      <div className="absolute inset-0 w-full h-full">
        <Prism
          animationType="rotate"
          timeScale={0.5}
          height={3.5}
          baseWidth={5.5}
          scale={3.6}
          hueShift={0}
          colorFrequency={1}
          noise={0.5}
          glow={1}
        />
      </div>

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('/background-kitchen.png')`,
        }}
      />



      {/* Overlay gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/50"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >

        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeInOut" }}
        >
          <p className="text-body-lg text-muted-foreground mb-8 max-w-3xl mx-auto text-pretty font-inter">
            {t('hero.subtitle')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeInOut" }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
        >
          <Button
            size="lg"
            onClick={handleExploreClick}
            className="btn btn-primary"
          >
            {t('hero.exploreProducts')}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button
            size="lg"
            onClick={handleConsultationClick}
            className="btn btn-secondary"
          >
            {t('contactUs')}
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeInOut" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12"
        >
          <div className="flex flex-col items-center group">
            <div className="bg-primary/10 p-6 rounded-full mb-4 group-hover:bg-primary/20 transition-colors duration-300">
              <Star className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-h3 text-white mb-2 font-serif">500+</h3>
            <p className="text-body-sm text-gray-400 font-inter">Luxury Projects Completed</p>
          </div>

          <div className="flex flex-col items-center group">
            <div className="bg-primary/10 p-6 rounded-full mb-4 group-hover:bg-primary/20 transition-colors duration-300">
              <Award className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-h3 text-white mb-2 font-serif">15+</h3>
            <p className="text-body-sm text-gray-400 font-inter">Years of Excellence</p>
          </div>

          <div className="flex flex-col items-center group">
            <div className="bg-primary/10 p-6 rounded-full mb-4 group-hover:bg-primary/20 transition-colors duration-300">
              <Users className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-h3 text-white mb-2 font-serif">200+</h3>
            <p className="text-body-sm text-gray-400 font-inter">Satisfied Clients</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: "easeInOut" }}
        >
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
        </motion.div>
      </div>
    </section>
  )
}
