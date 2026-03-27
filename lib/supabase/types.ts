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
          role: 'buyer' | 'owner' | 'admin' | null
          avatar_url: string | null
          phone: string | null
          email: string | null
          is_verified: boolean
          is_blocked: boolean
          created_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          role?: 'buyer' | 'owner' | 'admin' | null
          avatar_url?: string | null
          phone?: string | null
          email?: string | null
          is_verified?: boolean
          is_blocked?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          role?: 'buyer' | 'owner' | 'admin' | null
          avatar_url?: string | null
          phone?: string | null
          email?: string | null
          is_verified?: boolean
          is_blocked?: boolean
          created_at?: string
        }
      }
      properties: {
        Row: {
          id: string
          owner_id: string | null
          title: string
          description: string | null
          price: number
          type: string
          category: string
          city: string
          address: string | null
          images: string[] | null
          amenities: string[] | null
          status: string | null
          created_at: string
          beds: number | null
          baths: number | null
          area: number | null
          is_featured: boolean | null
          location: string | null
          locality: string | null
          state: string | null
          pincode: string | null
          latitude: number | null
          longitude: number | null
          listing_for: string | null
          bhk: number | null
          furnishing: string | null
          carpet_area_sqft: number | null
          floor_number: number | null
          total_floors: number | null
          available_from: string | null
          video_url: string | null
          rejection_reason: string | null
          reviewed_by: string | null
          reviewed_at: string | null
          view_count: number | null
        }
        Insert: {
          id?: string
          owner_id?: string | null
          title: string
          description?: string | null
          price: number
          type: string
          category: string
          city: string
          address?: string | null
          images?: string[] | null
          amenities?: string[] | null
          status?: string | null
          created_at?: string
          beds?: number | null
          baths?: number | null
          area?: number | null
          is_featured?: boolean | null
          location?: string | null
          locality?: string | null
          state?: string | null
          pincode?: string | null
          latitude?: number | null
          longitude?: number | null
          listing_for?: string | null
          bhk?: number | null
          furnishing?: string | null
          carpet_area_sqft?: number | null
          floor_number?: number | null
          total_floors?: number | null
          available_from?: string | null
          video_url?: string | null
          rejection_reason?: string | null
          reviewed_by?: string | null
          reviewed_at?: string | null
          view_count?: number | null
        }
        Update: {
          id?: string
          owner_id?: string | null
          title?: string
          description?: string | null
          price?: number
          type?: string
          category?: string
          city?: string
          address?: string | null
          images?: string[] | null
          amenities?: string[] | null
          status?: string | null
          created_at?: string
          beds?: number | null
          baths?: number | null
          area?: number | null
          is_featured?: boolean | null
          location?: string | null
          locality?: string | null
          state?: string | null
          pincode?: string | null
          latitude?: number | null
          longitude?: number | null
          listing_for?: string | null
          bhk?: number | null
          furnishing?: string | null
          carpet_area_sqft?: number | null
          floor_number?: number | null
          total_floors?: number | null
          available_from?: string | null
          video_url?: string | null
          rejection_reason?: string | null
          reviewed_by?: string | null
          reviewed_at?: string | null
          view_count?: number | null
        }
      }
      bookings: {
        Row: {
          id: string
          property_id: string | null
          buyer_id: string | null
          amount: number
          status: string | null
          razorpay_order_id: string | null
          created_at: string
          razorpay_payment_id: string | null
          razorpay_signature: string | null
          platform_fee: number | null
          total_amount: number | null
        }
        Insert: {
          id?: string
          property_id?: string | null
          buyer_id?: string | null
          amount: number
          status?: string | null
          razorpay_order_id?: string | null
          created_at?: string
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          platform_fee?: number | null
          total_amount?: number | null
        }
        Update: {
          id?: string
          property_id?: string | null
          buyer_id?: string | null
          amount?: number
          status?: string | null
          razorpay_order_id?: string | null
          created_at?: string
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          platform_fee?: number | null
          total_amount?: number | null
        }
      }
      enquiries: {
        Row: {
          id: string
          property_id: string | null
          sender_id: string | null
          message: string
          created_at: string
        }
        Insert: {
          id?: string
          property_id?: string | null
          sender_id?: string | null
          message: string
          created_at?: string
        }
        Update: {
          id?: string
          property_id?: string | null
          sender_id?: string | null
          message?: string
          created_at?: string
        }
      }
      admin_audit_log: {
        Row: {
          id: string
          admin_id: string | null
          action: string
          target_type: string
          target_id: string
          details: Json | null
          timestamp: string
        }
        Insert: {
          id?: string
          admin_id?: string | null
          action: string
          target_type: string
          target_id: string
          details?: Json | null
          timestamp?: string
        }
        Update: {
          id?: string
          admin_id?: string | null
          action?: string
          target_type?: string
          target_id?: string
          details?: Json | null
          timestamp?: string
        }
      }
      wishlist: {
        Row: {
          id: string
          user_id: string | null
          property_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          property_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          property_id?: string | null
          created_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          buyer_id: string | null
          owner_id: string | null
          property_id: string | null
          last_message: string | null
          updated_at: string
          created_at: string
        }
        Insert: {
          id?: string
          buyer_id?: string | null
          owner_id?: string | null
          property_id?: string | null
          last_message?: string | null
          updated_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          buyer_id?: string | null
          owner_id?: string | null
          property_id?: string | null
          last_message?: string | null
          updated_at?: string
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string | null
          sender_id: string | null
          content: string
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id?: string | null
          sender_id?: string | null
          content: string
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string | null
          sender_id?: string | null
          content?: string
          is_read?: boolean
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string | null
          title: string
          message: string
          type: string
          link: string | null
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          title: string
          message: string
          type: string
          link?: string | null
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          title?: string
          message?: string
          type?: string
          link?: string | null
          is_read?: boolean
          created_at?: string
        }
      }
      site_visits: {
        Row: {
          id: string
          property_id: string | null
          user_id: string | null
          preferred_date: string
          status: string | null
          created_at: string
        }
        Insert: {
          id?: string
          property_id?: string | null
          user_id?: string | null
          preferred_date: string
          status?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          property_id?: string | null
          user_id?: string | null
          preferred_date?: string
          status?: string | null
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
