import { motion } from "framer-motion"
import { ReactNode } from "react"

interface TimelineItemProps {
  year: string
  title: string
  children: ReactNode
  isLeft: boolean
}

export function TimelineItem({ year, title, children, isLeft }: TimelineItemProps) {
  return (
    <div className="relative flex items-center justify-center">
      {/* Timeline line */}
      <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-border"></div>

      {/* Timeline marker */}
      <div className="absolute left-1/2 top-8 z-10 flex h-16 w-16 -translate-x-1/2 items-center justify-center rounded-full bg-accent shadow-lg">
        <span className="font-serif text-sm font-bold text-accent-foreground">{year}</span>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -100 : 100 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`relative z-20 mt-8 w-full max-w-md ${
          isLeft ? "mr-auto pr-8 text-right" : "ml-auto pl-8 text-left"
        }`}
      >
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="font-serif text-xl font-semibold text-card-foreground mb-3">{title}</h3>
          <div className="text-muted-foreground leading-relaxed">{children}</div>
        </div>
      </motion.div>
    </div>
  )
}
