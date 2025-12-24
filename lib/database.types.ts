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
      tickets: {
        Row: {
          ticket_id: string
          nb_pizzas_classiques: number
          nb_pizzas_premium: number
          spins_simple_remaining: number
          spins_premium_remaining: number
          is_used: boolean
          created_at: string
          user_id: string | null
        }
        Insert: {
          ticket_id: string
          nb_pizzas_classiques?: number
          nb_pizzas_premium?: number
          spins_simple_remaining?: number
          spins_premium_remaining?: number
          is_used?: boolean
          created_at?: string
          user_id?: string | null
        }
        Update: {
          ticket_id?: string
          nb_pizzas_classiques?: number
          nb_pizzas_premium?: number
          spins_simple_remaining?: number
          spins_premium_remaining?: number
          is_used?: boolean
          created_at?: string
          user_id?: string | null
        }
      }
      users: {
        Row: {
          id: string
          name: string
          email: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          created_at?: string
        }
      }
      prizes: {
        Row: {
          id: string
          name: string
          emoji: string
          color: string
          weight_simple: number
          weight_premium: number
          active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          emoji: string
          color: string
          weight_simple: number
          weight_premium: number
          active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          emoji?: string
          color?: string
          weight_simple?: number
          weight_premium?: number
          active?: boolean
          created_at?: string
        }
      }
      spins: {
        Row: {
          id: string
          ticket_id: string
          prize_id: string
          spin_type: string
          created_at: string
        }
        Insert: {
          id?: string
          ticket_id: string
          prize_id: string
          spin_type: string
          created_at?: string
        }
        Update: {
          id?: string
          ticket_id?: string
          prize_id?: string
          spin_type?: string
          created_at?: string
        }
      }
      user_prizes: {
        Row: {
          id: string
          user_id: string
          spin_id: string
          prize_id: string
          status: string
          validated_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          spin_id: string
          prize_id: string
          status: string
          validated_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          spin_id?: string
          prize_id?: string
          status?: string
          validated_at?: string | null
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
      [_ in never]: never
    }
  }
}
