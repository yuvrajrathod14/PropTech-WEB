'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { PropertyWithDetails } from './useProperties'

export function useProperty(propertyId: string) {
  const [property, setProperty] = useState<PropertyWithDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!propertyId) return

    async function fetchProperty() {
      try {
        setLoading(true)
        const { data, error: fetchError } = await supabase
          .from('properties')
          .select(`
            *,
            location:property_locations (*),
            media:property_media (*),
            amenities:property_amenities (*),
            owner:profiles (*)
          `)
          .eq('id', propertyId)
          .single()

        if (fetchError) throw fetchError
        setProperty(data as any)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProperty()
  }, [propertyId])

  return { property, loading, error }
}
