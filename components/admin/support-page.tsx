"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { HelpCircle, Package, Users, FileText, BarChart3, Settings, ShieldCheck, Target, X } from "lucide-react"

interface FAQItem {
  id: string
  question: string
  icon: React.ElementType
  content: {
    title: string
    description: string
    steps?: string[]
    tips?: string[]
  }
}

const faqItems: FAQItem[] = [
  {
    id: "add-product",
    question: "How to add a product?",
    icon: Package,
    content: {
      title: "Adding a New Product",
      description: "Learn how to add new products to your catalog with detailed information and media.",
      steps: [
        "Navigate to the Products section from the admin sidebar",
        "Click the 'Add New Product' button",
        "Fill in the product details (name, description, price, etc.)",
        "Upload product images and set categories",
        "Add specifications and features",
        "Set pricing and availability",
        "Save and publish the product"
      ],
      tips: [
        "Use high-quality images for better presentation",
        "Write detailed descriptions to help customers",
        "Set appropriate categories for better organization",
        "Regularly update product information"
      ]
    }
  },
  {
    id: "leads-section",
    question: "What is the Leads section?",
    icon: FileText,
    content: {
      title: "Understanding the Leads Section",
      description: "The Leads section manages potential customer inquiries and contact forms submitted through your website.",
      steps: [
        "Leads are automatically captured from contact forms",
        "Each lead contains customer information and message",
        "Status can be updated (New, Contacted, Qualified, etc.)",
        "Leads can be assigned to team members",
        "Track follow-up actions and notes",
        "Convert leads to customers when appropriate"
      ],
      tips: [
        "Respond to leads within 24 hours for best results",
        "Use status updates to track progress",
        "Add detailed notes for follow-up actions",
        "Regularly review and prioritize leads"
      ]
    }
  },
  {
    id: "manage-contacts",
    question: "How to manage contacts?",
    icon: Users,
    content: {
      title: "Contact Management",
      description: "Manage your customer and prospect database effectively.",
      steps: [
        "Access the Contacts section from the sidebar",
        "View all contacts in a sortable table",
        "Filter contacts by status, source, or date",
        "Edit contact information as needed",
        "Add notes and follow-up reminders",
        "Export contact data for external use",
        "Import contacts from CSV files"
      ],
      tips: [
        "Keep contact information up to date",
        "Use tags to categorize contacts",
        "Set up automated follow-up reminders",
        "Regularly clean up duplicate entries"
      ]
    }
  },
  {
    id: "analytics-tracking",
    question: "What is Analytics & Tracking?",
    icon: BarChart3,
    content: {
      title: "Analytics and Contact Tracking",
      description: "Monitor website performance and track user interactions.",
      steps: [
        "View overall website statistics",
        "Track contact form submissions",
        "Monitor page views and user behavior",
        "Analyze conversion rates",
        "Review popular content and pages",
        "Track user journey through the site",
        "Generate reports for business insights"
      ],
      tips: [
        "Use analytics to optimize your website",
        "Track which pages convert best",
        "Monitor user behavior patterns",
        "Set up goals and conversion tracking"
      ]
    }
  },
  {
    id: "marketing-pixels",
    question: "How to set up Marketing Pixels?",
    icon: Target,
    content: {
      title: "Marketing Pixel Integration",
      description: "Integrate tracking pixels for marketing campaigns and analytics.",
      steps: [
        "Go to Marketing Pixels section",
        "Choose the platform (Facebook, Google, etc.)",
        "Enter your pixel ID",
        "Set up events to track",
        "Configure conversion tracking",
        "Test pixel implementation",
        "Monitor pixel performance"
      ],
      tips: [
        "Test pixels before going live",
        "Use proper event naming conventions",
        "Monitor pixel health regularly",
        "Keep pixel IDs secure and updated"
      ]
    }
  },
  {
    id: "database-setup",
    question: "What is Database Setup?",
    icon: ShieldCheck,
    content: {
      title: "Database Setup and Management",
      description: "Initialize and manage your database structure and content.",
      steps: [
        "Access Database Setup from Administration",
        "Run initial database setup",
        "Seed sample content if needed",
        "Configure database connections",
        "Set up backup procedures",
        "Monitor database performance",
        "Update schema when needed"
      ],
      tips: [
        "Always backup before making changes",
        "Test setup procedures in development first",
        "Document any custom configurations",
        "Monitor database health regularly"
      ]
    }
  },
  {
    id: "user-management",
    question: "How to manage team users?",
    icon: ShieldCheck,
    content: {
      title: "Team User Management",
      description: "Add and manage team members with appropriate access levels.",
      steps: [
        "Navigate to Team Users section",
        "Click 'Add New User'",
        "Enter user details and email",
        "Set appropriate role and permissions",
        "Send invitation email",
        "User accepts invitation and sets password",
        "Configure additional access settings"
      ],
      tips: [
        "Use role-based access control",
        "Regularly review user permissions",
        "Remove inactive users promptly",
        "Use strong password requirements"
      ]
    }
  },
  {
    id: "settings-config",
    question: "How to configure settings?",
    icon: Settings,
    content: {
      title: "System Settings Configuration",
      description: "Configure global settings for your application.",
      steps: [
        "Access Settings from the sidebar",
        "Review general application settings",
        "Configure email settings",
        "Set up notification preferences",
        "Configure API integrations",
        "Update branding and appearance",
        "Save and apply changes"
      ],
      tips: [
        "Test settings changes in a safe environment",
        "Document important configuration changes",
        "Keep backup of working configurations",
        "Review settings periodically"
      ]
    }
  }
]

export function SupportPage() {
  const [selectedFAQ, setSelectedFAQ] = useState<FAQItem | null>(null)

  return (
    <div className="flex gap-6 p-6">
      {/* FAQ Cards Section */}
      <div className="flex-1">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Support Center</h1>
          <p className="text-muted-foreground">Find answers to common questions and learn how to use the admin panel effectively.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {faqItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
                onClick={() => setSelectedFAQ(item)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{item.question}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    Click to learn more about this feature
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Help Card */}
      <div className="w-80 flex-shrink-0">
        <Card className="sticky top-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <HelpCircle className="h-6 w-6 text-primary" />
              <CardTitle>Need More Help?</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Can't find what you're looking for? Contact the developer for assistance.
            </p>
            <div className="space-y-3">
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  📧 Contact Developer
                </Button>
                <div className="text-xs text-muted-foreground pl-3 space-y-1">
                  <div>📧 medhatbusinessacc@gmail.com</div>
                  <div>📱 +971-558574950 (WhatsApp)</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FAQ Modal */}
      <AnimatePresence>
        {selectedFAQ && (
          <Dialog open={!!selectedFAQ} onOpenChange={() => setSelectedFAQ(null)}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-card text-foreground">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <DialogHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <selectedFAQ.icon className="h-6 w-6 text-primary" />
                    </div>
                    <DialogTitle className="text-xl dark:text-cream-100 text-charcoal-900">{selectedFAQ.content.title}</DialogTitle>
                  </div>
                  <DialogDescription className="text-base dark:text-cream-100 text-charcoal-900">
                    {selectedFAQ.content.description}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 mt-6">
                  {selectedFAQ.content.steps && (
                    <div>
                      <h3 className="font-semibold text-lg mb-3 dark:text-gold-400 text-charcoal-900">Step-by-Step Guide</h3>
                      <ol className="space-y-2">
                        {selectedFAQ.content.steps.map((step, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex gap-3 p-3 dark:bg-charcoal-900 bg-cream-50 rounded-lg"
                          >
                            <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                              {index + 1}
                            </span>
                            <span className="text-sm dark:text-cream-100 text-charcoal-900">{step}</span>
                          </motion.li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {selectedFAQ.content.tips && (
                    <div>
                      <h3 className="font-semibold text-lg mb-3 dark:text-gold-400 text-charcoal-900">💡 Pro Tips</h3>
                      <ul className="space-y-2">
                        {selectedFAQ.content.tips.map((tip, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: (selectedFAQ.content.steps?.length || 0) * 0.1 + index * 0.1 }}
                            className="flex gap-3 p-3 dark:bg-charcoal-900 bg-cream-50 border border-green-200 dark:border-green-800 rounded-lg"
                          >
                            <span className="dark:text-cream-100 text-charcoal-900">•</span>
                            <span className="text-sm dark:text-cream-100 text-charcoal-900">{tip}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  )
}
