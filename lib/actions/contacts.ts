'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type Contact = {
  id?: string
  name: string
  email: string
  company: string
  phone: string
  status: 'New' | 'Contacted' | 'Qualified' | 'Closed'
  date: string
  source: string
  notes: string
  projectType: 'Residential' | 'Commercial' | 'Industrial'
  budget: string
  timeline: string
  lastUpdated?: string
  lastUpdatedBy?: string
}

export async function getContacts() {
  try {
    const supabase = await createSupabaseServerClient()

    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching contacts:', error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error in getContacts:', error)
    return { success: false, error: 'Failed to fetch contacts' }
  }
}

export async function createContact(contact: Omit<Contact, 'id'>) {
  try {
    const supabase = await createSupabaseServerClient()

    const { data, error } = await supabase
      .from('contacts')
      .insert([{
        name: contact.name,
        email: contact.email,
        company: contact.company,
        phone: contact.phone,
        status: contact.status,
        date: contact.date,
        source: contact.source,
        notes: contact.notes,
        project_type: contact.projectType,
        budget: contact.budget,
        timeline: contact.timeline,
        last_updated: new Date().toISOString(),
        last_updated_by: 'Admin User'
      }])
      .select()
      .single()

    if (error) {
      console.error('Error creating contact:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/admin')
    return { success: true, data }
  } catch (error) {
    console.error('Error in createContact:', error)
    return { success: false, error: 'Failed to create contact' }
  }
}

export async function updateContact(id: string, updates: Partial<Contact>) {
  try {
    const supabase = await createSupabaseServerClient()

    const updateData: any = {}

    if (updates.name !== undefined) updateData.name = updates.name
    if (updates.email !== undefined) updateData.email = updates.email
    if (updates.company !== undefined) updateData.company = updates.company
    if (updates.phone !== undefined) updateData.phone = updates.phone
    if (updates.status !== undefined) updateData.status = updates.status
    if (updates.source !== undefined) updateData.source = updates.source
    if (updates.notes !== undefined) updateData.notes = updates.notes
    if (updates.projectType !== undefined) updateData.project_type = updates.projectType
    if (updates.budget !== undefined) updateData.budget = updates.budget
    if (updates.timeline !== undefined) updateData.timeline = updates.timeline

    updateData.last_updated = new Date().toISOString()
    updateData.last_updated_by = 'Admin User'

    const { data, error } = await supabase
      .from('contacts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating contact:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/admin')
    return { success: true, data }
  } catch (error) {
    console.error('Error in updateContact:', error)
    return { success: false, error: 'Failed to update contact' }
  }
}

export async function deleteContact(id: string) {
  try {
    const supabase = await createSupabaseServerClient()

    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting contact:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    console.error('Error in deleteContact:', error)
    return { success: false, error: 'Failed to delete contact' }
  }
}
