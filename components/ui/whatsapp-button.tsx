"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MessageCircle, Phone } from "lucide-react"
import { useContactTracking } from "@/components/contact-tracking"

interface WhatsAppButtonProps {
  phoneNumber: string
  message?: string
  className?: string
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
  children?: React.ReactNode
}

export function WhatsAppButton({
  phoneNumber,
  message = "Hello! I'm interested in your marble and granite services.",
  className,
  variant = "default",
  size = "default",
  children
}: WhatsAppButtonProps) {
  const [isTracking, setIsTracking] = useState(false)
  const { trackContact } = useContactTracking()

  const handleWhatsAppClick = async () => {
    setIsTracking(true)
    try {
      // Track the WhatsApp click
      await trackContact("whatsapp_click", {
        source: "whatsapp_button",
        number: phoneNumber,
        message: message,
      })

      // Open WhatsApp with the message
      const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`
      window.open(whatsappUrl, '_blank')
    } catch (error) {
      console.error('Error tracking WhatsApp click:', error)
      // Still open WhatsApp even if tracking fails
      const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`
      window.open(whatsappUrl, '_blank')
    } finally {
      setIsTracking(false)
    }
  }

  return (
    <Button
      onClick={handleWhatsAppClick}
      disabled={isTracking}
      variant={variant}
      size={size}
      className={`bg-green-600 hover:bg-green-700 text-white transition-all duration-300 ${className}`}
    >
      {isTracking ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
      ) : (
        <MessageCircle className="h-4 w-4 mr-2" />
      )}
      {children || "Contact on WhatsApp"}
    </Button>
  )
}
