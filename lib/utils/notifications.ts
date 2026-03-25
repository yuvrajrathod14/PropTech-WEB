import { createClient } from "@/lib/supabase/client"

export type NotificationType = 'booking' | 'enquiry' | 'chat' | 'moderation' | 'visit'

export async function createNotification({
    userId,
    title,
    message,
    type,
    link
}: {
    userId: string
    title: string
    message: string
    type: NotificationType
    link?: string
}) {
    const supabase = createClient()
    const { error } = await (supabase.from("notifications") as any).insert({
        user_id: userId,
        title,
        message,
        type,
        link
    })
    
    if (error) {
        console.error("Error creating notification:", error)
    }
}
