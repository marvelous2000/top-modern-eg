"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Mail, MapPin, Clock, CheckCircle, X } from "lucide-react"
import { useContactTracking } from "@/components/contact-tracking"

export function ContactSection() {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await trackForm("contact_form", formData)
      // Simulate form submission
      await new Promise((resolve) => setTimeout(resolve, 1000))

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

  return (
    <section id="contact" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-h2 text-foreground mb-6">
            Get In <span className="text-primary gold-glow">Touch</span>
          </h2>
          <p className="text-body text-muted-foreground max-w-3xl mx-auto">
            Ready to transform your space with premium marble and granite? Contact our experts today
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="bg-card border-accent/30 shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-h3 text-card-foreground mb-6">Send us a message</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="First Name"
                    className="bg-background/50 border-border text-foreground placeholder:text-muted-foreground focus:bg-background"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                  />
                  <Input
                    placeholder="Last Name"
                    className="bg-background/50 border-border text-foreground placeholder:text-muted-foreground focus:bg-background"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                  />
                </div>
                <Input
                  placeholder="Email Address"
                  type="email"
                  className="bg-background/50 border-border text-foreground placeholder:text-muted-foreground focus:bg-background"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
                <Input
                  placeholder="Phone Number"
                  type="tel"
                  className="bg-background/50 border-border text-foreground placeholder:text-muted-foreground focus:bg-background"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
                <Input
                  placeholder="Company Name"
                  className="bg-background/50 border-border text-foreground placeholder:text-muted-foreground focus:bg-background"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
                <Textarea
                  placeholder="Tell us about your project..."
                  rows={4}
                  className="bg-background/50 border-border text-foreground placeholder:text-muted-foreground focus:bg-background"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                />
                <Button
                  type="submit"
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90 shadow-accent/20 transition-all duration-300"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information with tracking */}
          <div className="space-y-8">
            <Card className="bg-card border-accent/30 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Phone className="h-6 w-6 text-accent mr-3" />
                  <h3 className="text-h4 text-card-foreground">Phone</h3>
                </div>
                <button
                  onClick={() => handlePhoneClick("+20 123 456 7890")}
                  className="text-muted-foreground hover:text-accent transition-colors block text-left"
                >
                  +20 123 456 7890
                </button>
                <button
                  onClick={() => handlePhoneClick("+971 50 123 4567")}
                  className="text-muted-foreground hover:text-accent transition-colors block text-left"
                >
                  +971 50 123 4567
                </button>
              </CardContent>
            </Card>

            <Card className="bg-card border-accent/30 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Mail className="h-6 w-6 text-accent mr-3" />
                  <h3 className="text-h4 text-card-foreground">Email</h3>
                </div>
                <button
                  onClick={() => handleEmailClick("info@topmodern.com")}
                  className="text-muted-foreground hover:text-accent transition-colors block text-left"
                >
                  info@topmodern.com
                </button>
                <button
                  onClick={() => handleEmailClick("sales@topmodern.com")}
                  className="text-muted-foreground hover:text-accent transition-colors block text-left"
                >
                  sales@topmodern.com
                </button>
              </CardContent>
            </Card>

            <Card className="bg-card border-accent/30 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <MapPin className="h-6 w-6 text-accent mr-3" />
                  <h3 className="text-h4 text-card-foreground">Location</h3>
                </div>
                <p className="text-muted-foreground">Cairo, Egypt</p>
                <p className="text-muted-foreground">Dubai, UAE</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-accent/30 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Clock className="h-6 w-6 text-accent mr-3" />
                  <h3 className="text-h4 text-card-foreground">Business Hours</h3>
                </div>
                <p className="text-muted-foreground">Sunday - Thursday: 9:00 AM - 6:00 PM</p>
                <p className="text-muted-foreground">Friday - Saturday: 10:00 AM - 4:00 PM</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-accent/30 rounded-lg p-8 max-w-md w-full text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-accent" />
            </div>
            <h3 className="text-xl font-semibold text-card-foreground mb-2">Message Sent Successfully!</h3>
            <p className="text-muted-foreground mb-6">
              Thank you for your message! We will contact you soon.
            </p>
            <Button
              onClick={() => setShowSuccessModal(false)}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </section>
  )
}
