'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { PropertyWithDetails } from './useProperties'

export function useOwnerListings() {
  const [listings, setListings] = useState<PropertyWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchListings() {
      try {
        setLoading(true)
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data, error: fetchError } = await supabase
          .from('properties')
          .select(`
            *,
            location:property_locations (*),
            media:property_media (*)
          `)
          .eq('owner_id', user.id)
          .order('created_at', { ascending: false })

        if (fetchError) throw fetchError
        setListings(data as PropertyWithDetails[])
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchListings()
  }, [])

  return { listings, loading, error }
}
