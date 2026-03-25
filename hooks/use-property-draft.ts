"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export function usePropertyDraft() {
  const [draftId, setDraftId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  // Initialize draft from localStorage or fetch from Supabase
  useEffect(() => {
    const initDraft = async () => {
      const storedId = localStorage.getItem("proptech_property_draft_id")
      if (storedId) {
          setDraftId(storedId)
      }
      setIsLoading(false)
    }
    initDraft()
  }, [])

  const saveStepData = useCallback(async (data: any, nextPath?: string) => {
    setIsLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const payload = {
        ...data,
        owner_id: user.id,
        status: 'draft',
        updated_at: new Date().toISOString()
      }

      let resultId = draftId

      if (draftId) {
        // Update existing draft
        const { error } = await (supabase.from("properties") as any)
          .update(payload)
          .eq("id", draftId)
        
        if (error) throw error
      } else {
        // Create new draft
        const { data: newDraft, error } = await (supabase.from("properties") as any)
          .insert(payload)
          .select("id")
          .single()
        
        if (error) throw error
        if (newDraft) {
          resultId = (newDraft as any).id
          setDraftId((newDraft as any).id)
          localStorage.setItem("proptech_property_draft_id", (newDraft as any).id)
        }
      }

      if (nextPath) {
        router.push(nextPath)
      }
      
      return resultId
    } catch (error) {
      console.error("Error saving property draft:", error)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [draftId, supabase, router])

  const clearDraft = useCallback(() => {
    setDraftId(null)
    localStorage.removeItem("proptech_property_draft_id")
  }, [])

  const loadDraft = useCallback(async () => {
    if (!draftId) return null
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("id", draftId)
      .single()
    
    if (error) {
      console.error("Error loading draft:", error)
      return null
    }
    return data
  }, [draftId, supabase])

  return {
    draftId,
    saveStepData,
    loadDraft,
    clearDraft,
    isLoading
  }
}
