"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { type ReactNode, useRef } from "react"

interface ParallaxHeroProps {
  children: ReactNode
  backgroundImage: string
  className?: string
}

export function ParallaxHero({ children, backgroundImage, className = "" }: ParallaxHeroProps) {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ y }} className="absolute inset-0 -z-10">
        <div
          className="h-[120%] w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      </motion.div>

      {children}
    </div>
  )
}
