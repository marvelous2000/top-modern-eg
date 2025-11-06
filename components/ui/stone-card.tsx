"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface StoneCardProps {
  image: string
  title: string
  description: string
  href?: string
  badge?: string
}

const cardVariants = {
  rest: {
    scale: 1,
  },
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.6,
      ease: "easeInOut",
    },
  },
}

const imageVariants = {
  rest: {
    scale: 1,
  },
  hover: {
    scale: 1.1,
    transition: {
      duration: 0.8,
      ease: "easeInOut",
    },
  },
}

const overlayVariants = {
  rest: {
    opacity: 0,
    y: 20,
  },
  hover: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
}

export function StoneCard({ image, title, description, href, badge }: StoneCardProps) {
  return (
    <motion.div initial="rest" whileHover="hover" animate="rest" variants={cardVariants}>
      <Card className="group overflow-hidden border-border bg-card transition-shadow hover:shadow-xl hover:shadow-accent/20">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <motion.img
            src={image || "/placeholder.svg"}
            alt={title}
            className="h-full w-full object-cover"
            variants={imageVariants}
          />
          {badge && (
            <div className="absolute right-4 top-4 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
              {badge}
            </div>
          )}
          <motion.div
            variants={overlayVariants}
            className="absolute inset-0 flex items-center justify-center bg-primary/90"
          >
            {href ? (
              <Link href={href} className="text-center text-primary-foreground hover:text-primary-foreground/80 transition-colors">
                <p className="text-sm font-medium">View Details</p>
                <ArrowRight className="mx-auto mt-2 h-5 w-5" />
              </Link>
            ) : (
              <div className="text-center text-primary-foreground">
                <p className="text-sm font-medium">View Details</p>
                <ArrowRight className="mx-auto mt-2 h-5 w-5" />
              </div>
            )}
          </motion.div>
        </div>
        <CardContent className="p-6 text-center">
          <h3 className="font-serif text-xl font-semibold text-card-foreground">{title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-card-foreground/70">{description}</p>
          {href && (
            <div className="mt-4 flex justify-center">
              <Button asChild variant="link" className="p-0 text-accent hover:text-accent/80">
                <Link href={href}>
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
