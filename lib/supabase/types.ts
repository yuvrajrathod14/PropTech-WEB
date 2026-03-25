export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          role: 'buyer' | 'owner' | 'admin'
          avatar_url: string | null
          phone: string | null
          email: string | null
          is_blocked: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          role?: 'buyer' | 'owner' | 'admin'
          avatar_url?: string | null
          phone?: string | null
          email?: string | null
          is_blocked?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          role?: 'buyer' | 'owner' | 'admin'
          avatar_url?: string | null
          phone?: string | null
          email?: string | null
          is_blocked?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      properties: {
        Row: {
          id: string
          owner_id: string
          title: string
          description: string | null
          price: number
          type: 'buy' | 'rent'
          category: string
          status: 'draft' | 'pending' | 'approved' | 'rejected'
          view_count: number
          is_featured: boolean
          feature_end_date: string | null
          rejection_reason: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          title: string
          description?: string | null
          price: number
          type: 'buy' | 'rent'
          category: string
          status?: 'draft' | 'pending' | 'approved' | 'rejected'
          view_count?: number
          is_featured?: boolean
          feature_end_date?: string | null
          rejection_reason?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          title?: string
          description?: string | null
          price?: number
          type?: 'buy' | 'rent'
          category?: string
          status?: 'draft' | 'pending' | 'approved' | 'rejected'
          view_count?: number
          is_featured?: boolean
          feature_end_date?: string | null
          rejection_reason?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      property_locations: {
        Row: {
          id: string
          property_id: string
          city: string
          locality: string
          address: string
          latitude: number | null
          longitude: number | null
          pincode: string | null
        }
        Insert: {
          id?: string
          property_id: string
          city: string
          locality: string
          address: string
          latitude?: number | null
          longitude?: number | null
          pincode?: string | null
        }
        Update: {
          id?: string
          property_id?: string
          city?: string
          locality?: string
          address?: string
          latitude?: number | null
          longitude?: number | null
          pincode?: string | null
        }
      }
      property_media: {
        Row: {
          id: string
          property_id: string
          url: string
          type: 'image' | 'video'
          is_thumbnail: boolean
          created_at: string
        }
        Insert: {
          id?: string
          property_id: string
          url: string
          type?: 'image' | 'video'
          is_thumbnail?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          url?: string
          type?: 'image' | 'video'
          is_thumbnail?: boolean
          created_at?: string
        }
      }
      property_amenities: {
        Row: {
          id: string
          property_id: string
          name: string
          icon: string | null
        }
        Insert: {
          id?: string
          property_id: string
          name: string
          icon?: string | null
        }
        Update: {
          id?: string
          property_id?: string
          name?: string
          icon?: string | null
        }
      }
      enquiries: {
        Row: {
          id: string
          property_id: string
          buyer_id: string
          owner_id: string
          status: 'open' | 'closed'
          purpose: 'visit' | 'negotiation' | 'general'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id: string
          buyer_id: string
          owner_id: string
          status?: 'open' | 'closed'
          purpose?: 'visit' | 'negotiation' | 'general'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          buyer_id?: string
          owner_id?: string
          status?: 'open' | 'closed'
          purpose?: 'visit' | 'negotiation' | 'general'
          created_at?: string
          updated_at?: string
        }
      }
      chat_messages: {
        Row: {
          id: string
          enquiry_id: string
          sender_id: string
          message: string
          media_url: string | null
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          enquiry_id: string
          sender_id: string
          message: string
          media_url?: string | null
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          enquiry_id?: string
          sender_id?: string
          message?: string
          media_url?: string | null
          is_read?: boolean
          created_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          property_id: string
          buyer_id: string
          owner_id: string
          amount: number
          platform_fee: number
          status: 'pending' | 'success' | 'failed' | 'refunded'
          razorpay_order_id: string
          razorpay_payment_id: string | null
          razorpay_signature: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id: string
          buyer_id: string
          owner_id: string
          amount: number
          platform_fee: number
          status?: 'pending' | 'success' | 'failed' | 'refunded'
          razorpay_order_id: string
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          buyer_id?: string
          owner_id?: string
          amount?: number
          platform_fee?: number
          status?: 'pending' | 'success' | 'failed' | 'refunded'
          razorpay_order_id?: string
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      site_visits: {
        Row: {
          id: string
          property_id: string
          buyer_id: string
          owner_id: string
          visit_date: string
          time_slot: string
          notes: string | null
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          created_at: string
        }
        Insert: {
          id?: string
          property_id: string
          buyer_id: string
          owner_id: string
          visit_date: string
          time_slot: string
          notes?: string | null
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          created_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          buyer_id?: string
          owner_id?: string
          visit_date?: string
          time_slot?: string
          notes?: string | null
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          created_at?: string
        }
      }
      wishlists: {
        Row: {
          id: string
          user_id: string
          property_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          property_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          property_id?: string
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: 'enquiry' | 'booking' | 'visit' | 'system'
          link: string | null
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type: 'enquiry' | 'booking' | 'visit' | 'system'
          link?: string | null
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: 'enquiry' | 'booking' | 'visit' | 'system'
          link?: string | null
          is_read?: boolean
          created_at?: string
        }
      }
      featured_listings: {
        Row: {
          id: string
          property_id: string
          start_date: string
          end_date: string
          payment_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          property_id: string
          start_date: string
          end_date: string
          payment_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          start_date?: string
          end_date?: string
          payment_id?: string | null
          created_at?: string
        }
      }
      boost_payments: {
        Row: {
          id: string
          user_id: string
          property_id: string
          amount: number
          plan_name: string
          razorpay_order_id: string
          status: 'success' | 'failed'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          property_id: string
          amount: number
          plan_name: string
          razorpay_order_id: string
          status: 'success' | 'failed'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          property_id?: string
          amount?: number
          plan_name?: string
          razorpay_order_id?: string
          status?: 'success' | 'failed'
          created_at?: string
        }
      }
      admin_audit_logs: {
        Row: {
          id: string
          admin_id: string
          action: string
          entity_type: string
          entity_id: string
          details: Json
          created_at: string
        }
        Insert: {
          id?: string
          admin_id: string
          action: string
          entity_type: string
          entity_id: string
          details: Json
          created_at?: string
        }
        Update: {
          id?: string
          admin_id?: string
          action?: string
          entity_type?: string
          entity_id?: string
          details?: Json
          created_at?: string
        }
      }
      reports: {
        Row: {
          id: string
          reporter_id: string
          property_id: string | null
          target_user_id: string | null
          reason: string
          details: string | null
          status: 'pending' | 'resolved' | 'dismissed'
          created_at: string
        }
        Insert: {
          id?: string
          reporter_id: string
          property_id?: string | null
          target_user_id?: string | null
          reason: string
          details?: string | null
          status?: 'pending' | 'resolved' | 'dismissed'
          created_at?: string
        }
        Update: {
          id?: string
          reporter_id?: string
          property_id?: string | null
          target_user_id?: string | null
          reason?: string
          details?: string | null
          status?: 'pending' | 'resolved' | 'dismissed'
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'buyer' | 'owner' | 'admin'
    }
  }
}
