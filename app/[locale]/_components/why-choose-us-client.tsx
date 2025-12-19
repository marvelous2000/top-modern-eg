"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { StaggerContainer, itemVariants } from "@/components/ui/stagger-container"
import { Award, Users, Sparkles, CheckCircle2 } from "lucide-react"

interface WhyItem {
  title: string
  description: string
}

interface WhyChooseUsClientProps {
  items: WhyItem[]
}

export default function WhyChooseUsClient({ items }: WhyChooseUsClientProps) {
  const icons = [Award, Users, Sparkles, CheckCircle2]

  return (
    <StaggerContainer className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
      {items.map((item, index) => {
        const Icon = icons[index] || Award
        return (
          <motion.div key={index} variants={itemVariants} transition={{ ease: [0.4, 0, 0.2, 1] }}>
            <Card className="border-border bg-card">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <motion.div whileHover={{ scale: 1.1, rotate: 5 }} transition={{ duration: 0.3 }} className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/20">
                    <Icon className="h-6 w-6 text-accent" />
                  </motion.div>
                  <h3 className="mt-4 font-semibold text-lg">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </StaggerContainer>
  )
}
