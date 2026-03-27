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

        // 1. Fetch properties for this owner
        const { data: properties, error: pError } = await (supabase.from('properties') as any)
          .select('id, view_count, status')
          .eq('owner_id', user.id)

        if (pError) throw pError

        // 2. Fetch enquiries count
        const { count: enquiries, error: eError } = await (supabase.from('enquiries') as any)
          .select('*', { count: 'exact', head: true })
          .eq('owner_id', user.id)

        if (eError) throw eError

        // 3. Fetch bookings total
        const { data: bookings, error: bError } = await (supabase.from('bookings') as any)
          .select('amount')
          .eq('owner_id', user.id)
          .eq('status', 'success')

        if (bError) throw bError

        // Calculate metrics
        const propertyList = properties || []
        const totalViews = propertyList.reduce((acc: number, p: any) => acc + (p.view_count || 0), 0)
        const totalEarnings = (bookings || []).reduce((acc: number, b: any) => acc + (b.amount || 0), 0)
        const activeListings = propertyList.filter((p: any) => p.status === 'live').length

        setAnalytics({
          totalViews,
          totalEarnings,
          activeListings,
          totalEnquiries: enquiries || 0,
          totalPropertyCount: propertyList.length
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
