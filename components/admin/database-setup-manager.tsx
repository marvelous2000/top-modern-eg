"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, Loader2, Database, FileText, User } from "lucide-react"

interface SetupStep {
  id: string
  title: string
  description: string
  icon: React.ComponentType<any>
  endpoint: string
  status: 'pending' | 'running' | 'success' | 'error'
  message?: string
}

export function DatabaseSetupManager() {
  const [steps, setSteps] = useState<SetupStep[]>([
    {
      id: 'database',
      title: 'Setup Database Schema',
      description: 'Create all required tables and relationships',
      icon: Database,
      endpoint: '/.netlify/functions/setup-database',
      status: 'pending'
    },
    {
      id: 'content',
      title: 'Seed Initial Content',
      description: 'Populate database with sample products and projects',
      icon: FileText,
      endpoint: '/.netlify/functions/seed-content',
      status: 'pending'
    },
    {
      id: 'admin',
      title: 'Create Super Admin',
      description: 'Setup the first admin user account',
      icon: User,
      endpoint: '/.netlify/functions/create-superadmin',
      status: 'pending'
    }
  ])

  const runStep = async (stepId: string) => {
    const stepIndex = steps.findIndex(s => s.id === stepId)
    if (stepIndex === -1) return

    // Update step status to running
    setSteps(prev => prev.map((step, index) =>
      index === stepIndex
        ? { ...step, status: 'running' as const, message: undefined }
        : step
    ))

    try {
      const step = steps[stepIndex]
      const response = await fetch(step.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (response.ok) {
        setSteps(prev => prev.map((step, index) =>
          index === stepIndex
            ? { ...step, status: 'success' as const, message: data.message }
            : step
        ))
      } else {
        setSteps(prev => prev.map((step, index) =>
          index === stepIndex
            ? { ...step, status: 'error' as const, message: data.error || 'Unknown error' }
            : step
        ))
      }
    } catch (error) {
      setSteps(prev => prev.map((step, index) =>
        index === stepIndex
          ? { ...step, status: 'error' as const, message: error instanceof Error ? error.message : 'Network error' }
          : step
      ))
    }
  }

  const runAllSteps = async () => {
    for (const step of steps) {
      if (step.status === 'pending') {
        await runStep(step.id)
        // Small delay between steps
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }
  }

  const resetSteps = () => {
    setSteps(prev => prev.map(step => ({
      ...step,
      status: 'pending' as const,
      message: undefined
    })))
  }

  const getStatusIcon = (status: SetupStep['status']) => {
    switch (status) {
      case 'running':
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
    }
  }

  const allCompleted = steps.every(step => step.status === 'success')
  const hasErrors = steps.some(step => step.status === 'error')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Database Setup</h2>
          <p className="text-muted-foreground">
            Initialize your database after deployment. This creates the schema, seeds initial content, and sets up the admin user.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={runAllSteps}
            disabled={allCompleted || steps.some(s => s.status === 'running')}
          >
            {steps.some(s => s.status === 'running') ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Running...
              </>
            ) : (
              'Run All Steps'
            )}
          </Button>
          <Button variant="outline" onClick={resetSteps}>
            Reset
          </Button>
        </div>
      </div>

      {allCompleted && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Database setup completed successfully! You can now access the admin panel with the created super admin account.
          </AlertDescription>
        </Alert>
      )}

      {hasErrors && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>
            Some steps failed. Check the error messages below and try again.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4">
        {steps.map((step, index) => (
          <Card key={step.id}>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  {getStatusIcon(step.status)}
                  <step.icon className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                  <CardDescription>{step.description}</CardDescription>
                </div>
                <Button
                  onClick={() => runStep(step.id)}
                  disabled={step.status === 'running' || step.status === 'success'}
                  variant={step.status === 'success' ? 'secondary' : 'default'}
                  size="sm"
                >
                  {step.status === 'running' ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Running
                    </>
                  ) : step.status === 'success' ? (
                    'Completed'
                  ) : (
                    'Run'
                  )}
                </Button>
              </div>
            </CardHeader>
            {step.message && (
              <CardContent>
                <Alert variant={step.status === 'error' ? 'destructive' : 'default'}>
                  <AlertDescription>{step.message}</AlertDescription>
                </Alert>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Important Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• Database setup can only be run once. Subsequent runs will be skipped if already initialized.</p>
          <p>• Make sure your Supabase environment variables are properly configured in Netlify.</p>
          <p>• The super admin account will be created with email: admin@topmodern.com and password: Admin123!</p>
          <p>• After setup, you can change the admin password from the Users section in the admin panel.</p>
        </CardContent>
      </Card>
    </div>
  )
}
