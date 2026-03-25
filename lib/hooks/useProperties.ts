'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Database } from '@/lib/supabase/types'

type Property = Database['public']['Tables']['properties']['Row']
type PropertyLocation = Database['public']['Tables']['property_locations']['Row']
type PropertyMedia = Database['public']['Tables']['property_media']['Row']

export interface PropertyWithDetails extends Property {
  location: PropertyLocation
  media: PropertyMedia[]
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
        let query = supabase
          .from('properties')
          .select(`
            *,
            location:property_locations (*),
            media:property_media (*)
          `)
          .eq('status', 'approved')

        if (filters?.type) query = query.eq('type', filters.type)
        if (filters?.category) query = query.eq('category', filters.category)
        if (filters?.city) query = query.ilike('location.city', `%${filters.city}%`)
        if (filters?.minPrice) query = query.gte('price', filters.minPrice)
        if (filters?.maxPrice) query = query.lte('price', filters.maxPrice)
        
        query = query.order('created_at', { ascending: false })
        
        if (filters?.limit) query = query.limit(filters.limit)

        const { data, error: fetchError } = await query

        if (fetchError) throw fetchError
        setProperties(data as PropertyWithDetails[])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [JSON.stringify(filters)])

  return { properties, loading, error }
}
