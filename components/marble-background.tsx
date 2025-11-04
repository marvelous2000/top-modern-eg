"use client"

export function MarbleBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="marble-background absolute inset-0" />


      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/5 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-tl from-primary/5 via-transparent to-accent/5" />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10" />
    </div>
  )
}
