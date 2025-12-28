"use client"

import type React from "react"
import { useTranslations } from 'next-intl';
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Mail, MapPin, Clock, CheckCircle, X } from "lucide-react"
import { useContactTracking } from "@/components/contact-tracking"
import { WhatsAppButton } from "@/components/ui/whatsapp-button"
import { incrementTotalContacts } from '@/lib/actions/dashboard_metrics'; // Import the function
import { SiteSettings, defaultSettings } from "@/lib/types";

export function ContactSection() {
  const t = useTranslations('contact');
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [isMounted, setIsMounted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const { trackContact, trackForm } = useContactTracking()

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

  // Show fallback while not mounted to prevent hydration issues
  if (!isMounted) {
    return (
      <Card className="bg-card border-accent/30 shadow-lg">
        <CardContent className="p-8">
          <div className="space-y-8">
            <div className="flex items-start">
              <Phone className="h-7 w-7 text-accent mr-5 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-h4 text-card-foreground mb-2">{t('info.phone')}</h3>
                <div className="space-y-1">
                  <p className="text-muted-foreground p-2 -ml-2">+20 123 456 7890</p>
                  <p className="text-muted-foreground p-2 -ml-2">+971 50 123 4567</p>
                </div>
              </div>
            </div>
            <div className="flex items-start">
              <Mail className="h-7 w-7 text-accent mr-5 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-h4 text-card-foreground mb-2">{t('info.email')}</h3>
                <div className="space-y-1">
                  <p className="text-muted-foreground p-2 -ml-2">info@topmodern.com</p>
                  <p className="text-muted-foreground p-2 -ml-2">sales@topmodern.com</p>
                </div>
              </div>
            </div>
            <div className="flex items-start">
              <MapPin className="h-7 w-7 text-accent mr-5 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-h4 text-card-foreground mb-2">{t('info.address')}</h3>
                <div className="space-y-1">
                  <p className="text-muted-foreground p-2 -ml-2">{t('info.address1')}</p>
                  <p className="text-muted-foreground p-2 -ml-2">{t('info.address2')}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await trackForm("contact_form", formData)
      // Simulate form submission
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Increment total contacts after successful submission
      await incrementTotalContacts();

      setShowSuccessModal(true)
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        company: "",
        message: "",
      })
    } catch (error) {
      alert("There was an error submitting your form. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePhoneClick = (number: string) => {
    trackContact("phone_call", {
      source: "contact_section",
      number,
    })
    window.location.href = `tel:${number.replace(/\s/g, "")}`
  }

  const handleEmailClick = (email: string) => {
    trackContact("email_click", {
      source: "contact_section",
      email,
    })
    window.location.href = `mailto:${email}`
  }

  const contactDetails = [
    {
      icon: Phone,
      title: t('info.phone'),
      lines: [
        { text: settings.contact.phone1 || t('info.phone1'), action: () => handlePhoneClick(settings.contact.phone1 || "+20 123 456 7890") },
        { text: settings.contact.phone2 || t('info.phone2'), action: () => handlePhoneClick(settings.contact.phone2 || "+971 50 123 4567") },
      ],
    },
    {
      icon: Mail,
      title: t('info.email'),
      lines: [
        { text: settings.contact.email1 || t('info.email1'), action: () => handleEmailClick(settings.contact.email1 || "info@topmodern.com") },
        { text: settings.contact.email2 || t('info.email2'), action: () => handleEmailClick(settings.contact.email2 || "sales@topmodern.com") },
      ],
    },
    {
      icon: MapPin,
      title: t('info.address'),
      lines: [
        { text: settings.company.address || t('info.address1') },
        { text: t('info.address2') },
      ],
    },
    {
      icon: Clock,
      title: t('info.hours'),
      lines: [
        { text: t('info.hours1') },
        { text: t('info.hours2') },
      ],
    },
  ];

  return (
    <section id="contact" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-h2 text-foreground mb-6">
            {t('formTitle')}
          </h2>
          <p className="text-body text-muted-foreground max-w-3xl mx-auto">
            {t('formSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="bg-card border-accent/30 shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-h3 text-card-foreground mb-6">{t('form.title')}</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder={t('form.firstName')}
                    className="bg-background/50 border-border text-foreground placeholder:text-muted-foreground focus:bg-background focus:ring-2 focus:ring-accent/50 focus:border-accent px-4 py-3 h-12"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                  />
                  <Input
                    placeholder={t('form.lastName')}
                    className="bg-background/50 border-border text-foreground placeholder:text-muted-foreground focus:bg-background focus:ring-2 focus:ring-accent/50 focus:border-accent px-4 py-3 h-12"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                  />
                </div>
                <Input
                  placeholder={t('form.email')}
                  type="email"
                  className="bg-background/50 border-border text-foreground placeholder:text-muted-foreground focus:bg-background focus:ring-2 focus:ring-accent/50 focus:border-accent px-4 py-3 h-12"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
                <Input
                  placeholder={t('form.phone')}
                  type="tel"
                  className="bg-background/50 border-border text-foreground placeholder:text-muted-foreground focus:bg-background focus:ring-2 focus:ring-accent/50 focus:border-accent px-4 py-3 h-12"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
                <Input
                  placeholder={t('form.company')}
                  className="bg-background/50 border-border text-foreground placeholder:text-muted-foreground focus:bg-background focus:ring-2 focus:ring-accent/50 focus:border-accent px-4 py-3 h-12"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
                <Textarea
                  placeholder={t('form.message')}
                  rows={6}
                  className="bg-background/50 border-border text-foreground placeholder:text-muted-foreground focus:bg-background focus:ring-2 focus:ring-accent/50 focus:border-accent px-4 py-3 resize-none"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                />
                <Button
                  type="submit"
                  className={`w-full bg-accent text-accent-foreground hover:bg-accent/90 shadow-accent/20 transition-all duration-300 ${isSubmitting ? 'animate-pulse bg-accent/80' : ''}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-accent-foreground mr-2"></div>
                      {t('form.sending')}
                    </div>
                  ) : (
                    t('form.sendMessage')
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="bg-card border-accent/30 shadow-lg">
            <CardContent className="p-8">
              <div className="space-y-8">
                {contactDetails.map((item, index) => (
                  <div key={index} className="flex items-start">
                    <item.icon className="h-7 w-7 text-accent mr-5 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-h4 text-card-foreground mb-2">{item.title}</h3>
                      <div className="space-y-1">
                        {item.lines.map((line, lineIndex) => (
                          "action" in line ? (
                            <button
                              key={lineIndex}
                              onClick={line.action}
                              className={`text-muted-foreground hover:text-gold-600 transition-colors block text-left w-full p-2 -ml-2 rounded-md hover:bg-accent/10 ${item.title === "Phone" ? "whitespace-nowrap" : ""}`}
                            >
                              {line.text}
                            </button>
                          ) : (
                            <p key={lineIndex} className={`text-muted-foreground p-2 -ml-2 ${item.title === "Phone" ? "whitespace-nowrap" : ""}`}>
                              {line.text}
                            </p>
                          )
                        ))}
                      </div>
                    </div>
                  </div>
                ))}


              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-card border rounded-lg p-5 max-w-xs w-full text-center shadow-lg">
            <div className="flex justify-center mb-3">
              <CheckCircle className="h-10 w-10 text-accent" />
            </div>
            <h3 className="text-base font-semibold text-card-foreground mb-2">
              {t('success.title')}
            </h3>
            <p className="text-muted-foreground mb-3 text-xs">
              {t('success.message')}
            </p>
            <Button
              onClick={() => setShowSuccessModal(false)}
              className="bg-accent text-accent-foreground hover:bg-accent/90 text-sm px-4 py-2"
            >
              {t('success.close')}
            </Button>
          </div>
        </div>
      )}
    </section>
  )
}
