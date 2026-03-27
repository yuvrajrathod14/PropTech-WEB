'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Database } from '@/lib/supabase/types'

type Property = Database['public']['Tables']['properties']['Row']

export interface PropertyWithDetails extends Property {
  // We keep the interface for compatibility, but map fields from the main table
  location_name?: string
}

export function useProperties(filters?: {
  type?: string
  category?: string
  city?: string
  minPrice?: number
  maxPrice?: number
  limit?: number
}) {
  const [properties, setProperties] = useState<PropertyWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProperties() {
      try {
        setLoading(true)
        // Corrected query: Select all columns and filter by 'live' status
        // No more joins to non-existent property_locations or property_media tables
        let query = supabase
          .from('properties')
          .select('*')
          .eq('status', 'live')

        if (filters?.type) query = query.eq('type', filters.type)
        if (filters?.category) query = query.eq('category', filters.category)
        
        // Search in city, locality or address
        if (filters?.city) {
          query = query.or(`city.ilike.%${filters.city}%,locality.ilike.%${filters.city}%,address.ilike.%${filters.city}%`)
        }
        
        if (filters?.minPrice) query = query.gte('price', filters.minPrice)
        if (filters?.maxPrice) query = query.lte('price', filters.maxPrice)
        
        query = query.order('created_at', { ascending: false })
        
        if (filters?.limit) query = query.limit(filters.limit)

        const { data, error: fetchError } = await query

        if (fetchError) throw fetchError
        
        // Map data to PropertyWithDetails if needed, though most fields are top-level now
        setProperties((data || []) as PropertyWithDetails[])
      } catch (err) {
        console.error('Error fetching properties:', err)
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [JSON.stringify(filters)])

  return { properties, loading, error }
}
