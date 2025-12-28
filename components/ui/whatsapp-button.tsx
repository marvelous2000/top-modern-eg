"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { MessageCircle, Phone } from "lucide-react"
import { useContactTracking } from "@/components/contact-tracking"
import { SiteSettings, defaultSettings } from "@/lib/types";

interface WhatsAppButtonProps {
  phoneNumber?: string  // Made optional to allow using settings
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
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [isMounted, setIsMounted] = useState(false);
  const { trackContact } = useContactTracking()

  useEffect(() => {
    // Mark as mounted after component mounts
    setIsMounted(true);

    // Load settings from localStorage after component mounts
    const savedSettings = localStorage.getItem("siteSettings")
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings))
      } catch (error) {
        console.error("Error loading settings:", error)
      }
    }

    // Listen for settings updates
    const handleSettingsUpdate = (event: CustomEvent<SiteSettings>) => {
      setSettings(event.detail)
    }

    window.addEventListener("settingsUpdated", handleSettingsUpdate as EventListener)

    return () => {
      window.removeEventListener("settingsUpdated", handleSettingsUpdate as EventListener)
    }
  }, [])

  // Show nothing while not mounted to prevent hydration issues
  if (!isMounted) {
    return (
      <Button
        onClick={() => {}}
        disabled
        variant={variant}
        size={size}
        className={`bg-green-600/50 hover:bg-green-700/50 text-white/50 cursor-not-allowed transition-all duration-300 ${className}`}
      >
        <MessageCircle className="h-4 w-4 mr-2" />
        {children || "Contact on WhatsApp"}
      </Button>
    );
  }

  const handleWhatsAppClick = async () => {
    setIsTracking(true)
    try {
      // Use either the passed phone number or the one from settings
      const actualPhoneNumber = phoneNumber || settings.contact.whatsapp || "+201234567890";

      // Track the WhatsApp click
      await trackContact("whatsapp_click", {
        source: "whatsapp_button",
        number: actualPhoneNumber,
        message: message,
      })

      // Open WhatsApp with the message
      const whatsappUrl = `https://wa.me/${actualPhoneNumber.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`
      window.open(whatsappUrl, '_blank')
    } catch (error) {
      console.error('Error tracking WhatsApp click:', error)
      // Still open WhatsApp even if tracking fails
      const actualPhoneNumber = phoneNumber || settings.contact.whatsapp || "+201234567890";
      const whatsappUrl = `https://wa.me/${actualPhoneNumber.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`
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
