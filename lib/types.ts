export interface SiteSettings {
  logo: {
    main: string
    footer: string
    admin: string
  }
  contact: {
    phone1: string
    phone2: string
    email1: string
    email2: string
    whatsapp: string
  }
  social: {
    facebook: string
    instagram: string
    linkedin: string
  }
  company: {
    name: string
    description: string
    address: string
  }
}

export const defaultSettings: SiteSettings = {
  logo: {
    main: "/top-modern-logo-gold.png",
    footer: "/top-modern-logo-gold.png",
    admin: "/top-modern-logo-gold.png",
  },
  contact: {
    phone1: "+20 123 456 7890",
    phone2: "+971 50 123 4567",
    email1: "info@topmodern.com",
    email2: "sales@topmodern.com",
    whatsapp: "+201234567890",
  },
  social: {
    facebook: "https://facebook.com/topmodern",
    instagram: "https://instagram.com/topmodern",
    linkedin: "https://linkedin.com/company/topmodern",
  },
  company: {
    name: "Top Modern",
    description:
      "Premium marble and granite solutions for luxury real estate, hotels, and restaurants across the MENA region.",
    address: "MENA Region",
  },
}