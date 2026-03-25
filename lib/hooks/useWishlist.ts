'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { PropertyWithDetails } from './useProperties'

export function useWishlist() {
  const [wishlist, setWishlist] = useState<PropertyWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchWishlist() {
      try {
        setLoading(true)
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data, error: fetchError } = await supabase
          .from('wishlists')
          .select(`
            *,
            property:properties (
              *,
              location:property_locations (*),
              media:property_media (*)
            )
          `)
          .eq('user_id', user.id)

        if (fetchError) throw fetchError
        setWishlist(data.map((item: { property: any }) => item.property) as PropertyWithDetails[])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchWishlist()
  }, [])

  const toggleWishlist = async (propertyId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Must be logged in')

      const isWishlisted = wishlist.some(p => p.id === propertyId)

      if (isWishlisted) {
        const { error } = await supabase
          .from('wishlists')
          .delete()
          .eq('user_id', user.id)
          .eq('property_id', propertyId)
        
        if (error) throw error
        setWishlist(prev => prev.filter(p => p.id !== propertyId))
      } else {
        const { error } = await supabase
          .from('wishlists')
          .insert({ 
            user_id: user.id, 
            property_id: propertyId 
          } as any)
        
        if (error) throw error
        // Re-fetch or manually add (re-fetch is safer for complex joins)
        const { data: propertyData } = await supabase
          .from('properties')
          .select(`
            *,
            location:property_locations (*),
            media:property_media (*)
          `)
          .eq('id', propertyId)
          .single()
        
        if (propertyData) {
          setWishlist(prev => [...prev, propertyData as PropertyWithDetails])
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    }
  }

  return { wishlist, loading, error, toggleWishlist }
}
