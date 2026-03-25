'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Database } from '@/lib/supabase/types'

type Enquiry = Database['public']['Tables']['enquiries']['Row']

export function useEnquiries(role: 'buyer' | 'owner') {
  const [enquiries, setEnquiries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchEnquiries() {
      try {
        setLoading(true)
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        let query = supabase
          .from('enquiries')
          .select(`
            *,
            property:properties (title, images),
            buyer:profiles!enquiries_buyer_id_fkey (full_name, avatar_url),
            owner:profiles!enquiries_owner_id_fkey (full_name, avatar_url)
          `)

        if (role === 'buyer') {
          query = query.eq('buyer_id', user.id)
        } else {
          query = query.eq('owner_id', user.id)
        }

        const { data, error: fetchError } = await query.order('updated_at', { ascending: false })

        if (fetchError) throw fetchError
        setEnquiries(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchEnquiries()
  }, [role])

  return { enquiries, loading, error }
}
