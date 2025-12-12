import { motion } from "framer-motion"
import { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { useParams } from 'next/navigation';
import { getSafeLocale, isArabic } from '@/lib/locale-utils';

interface TimelineItemProps {
  year: string
  title: string
  children: ReactNode
  isLeft: boolean
}

export function TimelineItem({ year, title, children, isLeft }: TimelineItemProps) {
  const params = useParams();
  const locale = getSafeLocale(params.locale);
  const isRtl = isArabic(locale);

  // Adjust positioning logic for RTL
  const effectiveIsLeft = isRtl ? !isLeft : isLeft;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative flex flex-col md:flex-row md:items-center md:justify-center py-8"
    >
      {/* Timeline line (visible on desktop, adjusted for mobile) */}
      <div className={cn(
        "absolute top-0 h-full w-px bg-border",
        isRtl ? "right-4 md:right-1/2" : "left-4 md:left-1/2",
        "-translate-x-1/2"
      )}></div>

      {/* Timeline marker */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ delay: 0.1, duration: 0.5, type: "spring", stiffness: 200 }}
        className={cn(
          "absolute top-8 z-20 flex h-12 w-12 md:h-16 md:w-16 -translate-x-1/2 items-center justify-center rounded-full bg-accent shadow-lg",
          isRtl ? "right-4 md:right-1/2" : "left-4 md:left-1/2"
        )}
      >
        <span className="font-serif text-xs md:text-sm font-bold text-accent-foreground">{year}</span>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, x: effectiveIsLeft ? -50 : 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ delay: 0.2, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={cn(
          "relative z-10 mt-8 w-full px-4 md:px-8", // Mobile: full width, padding
          effectiveIsLeft
            ? (isRtl ? "md:ml-auto md:pl-8 md:text-left" : "md:mr-auto md:pr-8 md:text-right") // Desktop left (adjusted for RTL)
            : (isRtl ? "md:mr-auto md:pr-8 md:text-right" : "md:ml-auto md:pl-8 md:text-left") // Desktop right (adjusted for RTL)
        )}
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
          className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <h3 className="font-serif text-xl font-semibold text-card-foreground mb-3">{title}</h3>
          <div className="text-muted-foreground leading-relaxed">{children}</div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
