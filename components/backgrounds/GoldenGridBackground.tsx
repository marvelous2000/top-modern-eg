"use client"

interface GoldenGridBackgroundProps {
  className?: string
}

export function GoldenGridBackground({ className = "" }: GoldenGridBackgroundProps) {
  return (
    <div className={`golden-grid pointer-events-none ${className}`}>
      <div className="golden-grid__mesh" />
      <div className="golden-grid__glow" />
    </div>
  )
}
