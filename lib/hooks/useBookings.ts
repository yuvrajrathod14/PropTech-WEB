'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Database } from '@/lib/supabase/types'

type BookingWithProperty = Database['public']['Tables']['bookings']['Row'] & {
  property: {
    title: string
    images: string[]
    location: {
      city: string
      locality: string
    }[]
  }
}

export function useBookings() {
  const [bookings, setBookings] = useState<BookingWithProperty[]>([])
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
        setBookings((data as unknown) as BookingWithProperty[])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

  return { bookings, loading, error }
}
