"use client"

import { useState } from "react"

// Contact tracking utility functions
export const trackContactMethod = (method: string, details?: any) => {
  const trackingData = {
    method,
    timestamp: new Date().toISOString(),
    details,
    userAgent: navigator.userAgent,
    url: window.location.href,
  }

  // Store in localStorage for demo purposes (would be sent to backend in real implementation)
  const existingTracking = JSON.parse(localStorage.getItem("contactTracking") || "[]")
  existingTracking.push(trackingData)
  localStorage.setItem("contactTracking", JSON.stringify(existingTracking))

  console.log("[v0] Contact method tracked:", trackingData)
}

export const trackFormSubmission = (formType: string, formData: any) => {
  const submissionData = {
    formType,
    timestamp: new Date().toISOString(),
    formData,
    userAgent: navigator.userAgent,
    url: window.location.href,
  }

  const existingSubmissions = JSON.parse(localStorage.getItem("formSubmissions") || "[]")
  existingSubmissions.push(submissionData)
  localStorage.setItem("formSubmissions", JSON.stringify(existingSubmissions))

  console.log("[v0] Form submission tracked:", submissionData)
}

// Hook for contact tracking
export const useContactTracking = () => {
  const [isTracking, setIsTracking] = useState(false)

  const trackContact = async (method: string, details?: any) => {
    setIsTracking(true)
    try {
      trackContactMethod(method, details)
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500))
    } finally {
      setIsTracking(false)
    }
  }

  const trackForm = async (formType: string, formData: any) => {
    setIsTracking(true)
    try {
      trackFormSubmission(formType, formData)
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500))
    } finally {
      setIsTracking(false)
    }
  }

  return { trackContact, trackForm, isTracking }
}

export function ContactTracking() {
  return null // This is a utility component that doesn't render anything
}
