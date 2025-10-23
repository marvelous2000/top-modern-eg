"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Edit, Eye } from "lucide-react"

export function LegalPagesManager() {
  const [isEditing, setIsEditing] = useState(false)
  const [privacyContent, setPrivacyContent] = useState(`
# Privacy Policy

## Information We Collect
We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us.

## How We Use Your Information
We use the information we collect to provide, maintain, and improve our services.

## Information Sharing
We do not sell, trade, or otherwise transfer your personal information to third parties.

## Data Security
We implement appropriate security measures to protect your personal information.

## Contact Us
If you have questions about this Privacy Policy, please contact us at privacy@topmodern.com.
  `)

  const [termsContent, setTermsContent] = useState(`
# Terms of Service

## Acceptance of Terms
By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.

## Services
Top Modern provides premium marble and granite solutions for commercial and residential projects.

## User Responsibilities
Users must provide accurate information and use our services in compliance with applicable laws.

## Limitation of Liability
Top Modern shall not be liable for any indirect, incidental, or consequential damages.

## Contact Information
For questions regarding these terms, contact us at legal@topmodern.com.
  `)

  return (
    <div className="space-y-6">
      <Tabs defaultValue="privacy" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
          <TabsTrigger value="terms">Terms of Service</TabsTrigger>
        </TabsList>

        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Privacy Policy</CardTitle>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                    {isEditing ? <Eye className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
                    {isEditing ? "Preview" : "Edit"}
                  </Button>
                  {isEditing && (
                    <Button size="sm" className="bg-primary text-primary-foreground">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  value={privacyContent}
                  onChange={(e) => setPrivacyContent(e.target.value)}
                  rows={20}
                  className="font-mono text-sm"
                />
              ) : (
                <div className="prose prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap text-sm">{privacyContent}</pre>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="terms">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Terms of Service</CardTitle>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                    {isEditing ? <Eye className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
                    {isEditing ? "Preview" : "Edit"}
                  </Button>
                  {isEditing && (
                    <Button size="sm" className="bg-primary text-primary-foreground">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  value={termsContent}
                  onChange={(e) => setTermsContent(e.target.value)}
                  rows={20}
                  className="font-mono text-sm"
                />
              ) : (
                <div className="prose prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap text-sm">{termsContent}</pre>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
