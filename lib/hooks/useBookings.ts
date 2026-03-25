'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Database } from '@/lib/supabase/types'

type Booking = Database['public']['Tables']['bookings']['Row']

export function useBookings() {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchBookings() {
      try {
        setLoading(true)
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data, error: fetchError } = await supabase
          .from('bookings')
          .select(`
            *,
            property:properties (title, images, location:property_locations (city, locality))
          `)
          .eq('buyer_id', user.id)
          .order('created_at', { ascending: false })

        if (fetchError) throw fetchError
        setBookings(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

  return { bookings, loading, error }
}
