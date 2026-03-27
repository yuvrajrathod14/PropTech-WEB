'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Database } from '@/lib/supabase/types'

type Message = Database['public']['Tables']['messages']['Row']

export function useChat(conversationId: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!conversationId) return

    async function fetchMessages() {
      try {
        setLoading(true)
        const { data, error: fetchError } = await (supabase.from('messages') as any)
          .select('*')
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: true })

        if (fetchError) throw fetchError
        setMessages(data || [])
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()

    // Realtime subscription
    const channel = supabase
      .channel(`chat:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [conversationId])

  const sendMessage = async (content: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error } = await (supabase.from('messages') as any).insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content,
      })

      if (error) throw error
    } catch (err: any) {
      setError(err.message)
    }
  }

  return { messages, loading, error, sendMessage }
}
