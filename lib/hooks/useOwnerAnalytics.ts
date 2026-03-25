'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'

export function useOwnerAnalytics() {
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        setLoading(true)
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // Fetch properties summary
        const { data: properties, error: pError } = await supabase
          .from('properties')
          .select('id, view_count, status')
          .eq('owner_id', user.id)

        if (pError) throw pError

        // Fetch enquiries count
        const { count: enquiries, error: eError } = await supabase
          .from('enquiries')
          .select('*', { count: 'exact', head: true })
          .eq('owner_id', user.id)

        if (eError) throw eError

        // Fetch bookings total
        const { data: bookings, error: bError } = await supabase
          .from('bookings')
          .select('amount')
          .eq('owner_id', user.id)
          .eq('status', 'success')

        if (bError) throw bError

        const totalViews = properties.reduce((acc, p) => acc + (p.view_count || 0), 0)
        const totalEarnings = bookings.reduce((acc, b) => acc + (b.amount || 0), 0)
        const activeListings = properties.filter(p => p.status === 'approved').length

        setAnalytics({
          totalViews,
          totalEarnings,
          activeListings,
          totalEnquiries: enquiries || 0,
          totalPropertyCount: properties.length
        })
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  return { analytics, loading, error }
}
