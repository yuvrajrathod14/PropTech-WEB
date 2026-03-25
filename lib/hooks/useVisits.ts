'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Database } from '@/lib/supabase/types'

type SiteVisit = Database['public']['Tables']['site_visits']['Row']

export function useVisits() {
  const [visits, setVisits] = useState<any[]>([])
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
        setVisits(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchVisits()
  }, [])

  return { visits, loading, error }
}
