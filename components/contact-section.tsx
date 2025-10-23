"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Mail, MapPin, Clock } from "lucide-react"
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
  const { trackContact, trackForm } = useContactTracking()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await trackForm("contact_form", formData)
      // Simulate form submission
      await new Promise((resolve) => setTimeout(resolve, 1000))

      alert("Thank you for your message! We will contact you soon.")
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
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6">
            Get In <span className="text-primary">Touch</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Ready to transform your space with premium marble and granite? Contact our experts today
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
            <CardContent className="p-8">
              <h3 className="font-serif text-2xl font-bold text-white mb-6">Send us a message</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="First Name"
                    className="bg-input border-border text-white"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                  />
                  <Input
                    placeholder="Last Name"
                    className="bg-input border-border text-white"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                  />
                </div>
                <Input
                  placeholder="Email Address"
                  type="email"
                  className="bg-input border-border text-white"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
                <Input
                  placeholder="Phone Number"
                  type="tel"
                  className="bg-input border-border text-white"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
                <Input
                  placeholder="Company Name"
                  className="bg-input border-border text-white"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
                <Textarea
                  placeholder="Tell us about your project..."
                  rows={4}
                  className="bg-input border-border text-white"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                />
                <Button
                  type="submit"
                  className="w-full bg-primary text-black hover:bg-primary/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information with tracking */}
          <div className="space-y-8">
            <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Phone className="h-6 w-6 text-primary mr-3" />
                  <h3 className="font-serif text-xl font-bold text-white">Phone</h3>
                </div>
                <button
                  onClick={() => handlePhoneClick("+20 123 456 7890")}
                  className="text-gray-300 hover:text-primary transition-colors block"
                >
                  +20 123 456 7890
                </button>
                <button
                  onClick={() => handlePhoneClick("+971 50 123 4567")}
                  className="text-gray-300 hover:text-primary transition-colors block"
                >
                  +971 50 123 4567
                </button>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Mail className="h-6 w-6 text-primary mr-3" />
                  <h3 className="font-serif text-xl font-bold text-white">Email</h3>
                </div>
                <button
                  onClick={() => handleEmailClick("info@topmodern.com")}
                  className="text-gray-300 hover:text-primary transition-colors block"
                >
                  info@topmodern.com
                </button>
                <button
                  onClick={() => handleEmailClick("sales@topmodern.com")}
                  className="text-gray-300 hover:text-primary transition-colors block"
                >
                  sales@topmodern.com
                </button>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <MapPin className="h-6 w-6 text-primary mr-3" />
                  <h3 className="font-serif text-xl font-bold text-white">Location</h3>
                </div>
                <p className="text-gray-300">Cairo, Egypt</p>
                <p className="text-gray-300">Dubai, UAE</p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Clock className="h-6 w-6 text-primary mr-3" />
                  <h3 className="font-serif text-xl font-bold text-white">Business Hours</h3>
                </div>
                <p className="text-gray-300">Sunday - Thursday: 9:00 AM - 6:00 PM</p>
                <p className="text-gray-300">Friday - Saturday: 10:00 AM - 4:00 PM</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
