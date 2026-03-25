'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Database } from '@/lib/supabase/types'

type VisitWithProperty = Database['public']['Tables']['site_visits']['Row'] & {
  property: {
    title: string
    images: string[]
    location: {
      city: string
      locality: string
    }[]
  }
}

export function useVisits() {
  const [visits, setVisits] = useState<VisitWithProperty[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchVisits() {
      try {
        setLoading(true)
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data, error: fetchError } = await supabase
          .from('site_visits')
          .select(`
            *,
            property:properties (title, images, location:property_locations (city, locality))
          `)
          .or(`buyer_id.eq.${user.id},owner_id.eq.${user.id}`)
          .order('visit_date', { ascending: false })

        if (fetchError) throw fetchError
        setVisits((data as unknown) as VisitWithProperty[])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchVisits()
  }, [])

  return { visits, loading, error }
}
