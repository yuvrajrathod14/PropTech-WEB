'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Database } from '@/lib/supabase/types'

type Message = Database['public']['Tables']['chat_messages']['Row']

export function useChat(enquiryId: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!enquiryId) return

    async function fetchMessages() {
      try {
        setLoading(true)
        const { data, error: fetchError } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('enquiry_id', enquiryId)
          .order('created_at', { ascending: true })

        if (fetchError) throw fetchError
        setMessages(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()

    // Realtime subscription
    const channel = supabase
      .channel(`chat:${enquiryId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `enquiry_id=eq.${enquiryId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [enquiryId])

  const sendMessage = async (message: string, mediaUrl?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error } = await supabase.from('chat_messages').insert({
        enquiry_id: enquiryId,
        sender_id: user.id,
        message,
        media_url: mediaUrl || null,
      })

      if (error) throw error
    } catch (err: any) {
      setError(err.message)
    }
  }

  return { messages, loading, error, sendMessage }
}
