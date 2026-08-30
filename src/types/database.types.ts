export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      adopter_preferences: {
        Row: {
          accepts_special_needs: boolean
          activity_level: Database["public"]["Enums"]["energy_level"] | null
          children_age_min: number | null
          first_time_owner: boolean
          has_children: boolean
          has_other_cats: boolean
          has_other_dogs: boolean
          hours_alone_per_day: number | null
          housing: Database["public"]["Enums"]["housing_type"] | null
          preferred_sizes: Database["public"]["Enums"]["animal_size"][] | null
          preferred_species:
            | Database["public"]["Enums"]["animal_species"][]
            | null
          profile_id: string
          search_radius_km: number
          updated_at: string
        }
        Insert: {
          accepts_special_needs?: boolean
          activity_level?: Database["public"]["Enums"]["energy_level"] | null
          children_age_min?: number | null
          first_time_owner?: boolean
          has_children?: boolean
          has_other_cats?: boolean
          has_other_dogs?: boolean
          hours_alone_per_day?: number | null
          housing?: Database["public"]["Enums"]["housing_type"] | null
          preferred_sizes?: Database["public"]["Enums"]["animal_size"][] | null
          preferred_species?:
            | Database["public"]["Enums"]["animal_species"][]
            | null
          profile_id: string
          search_radius_km?: number
          updated_at?: string
        }
        Update: {
          accepts_special_needs?: boolean
          activity_level?: Database["public"]["Enums"]["energy_level"] | null
          children_age_min?: number | null
          first_time_owner?: boolean
          has_children?: boolean
          has_other_cats?: boolean
          has_other_dogs?: boolean
          hours_alone_per_day?: number | null
          housing?: Database["public"]["Enums"]["housing_type"] | null
          preferred_sizes?: Database["public"]["Enums"]["animal_size"][] | null
          preferred_species?:
            | Database["public"]["Enums"]["animal_species"][]
            | null
          profile_id?: string
          search_radius_km?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "adopter_preferences_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      adoption_interests: {
        Row: {
          animal_id: string
          created_at: string
          id: string
          match_score: number | null
          message: string | null
          ong_id: string
          ong_notes: string | null
          profile_id: string
          status: Database["public"]["Enums"]["interest_status"]
          updated_at: string
        }
        Insert: {
          animal_id: string
          created_at?: string
          id?: string
          match_score?: number | null
          message?: string | null
          ong_id: string
          ong_notes?: string | null
          profile_id: string
          status?: Database["public"]["Enums"]["interest_status"]
          updated_at?: string
        }
        Update: {
          animal_id?: string
          created_at?: string
          id?: string
          match_score?: number | null
          message?: string | null
          ong_id?: string
          ong_notes?: string | null
          profile_id?: string
          status?: Database["public"]["Enums"]["interest_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "adoption_interests_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "adoption_interests_ong_id_fkey"
            columns: ["ong_id"]
            isOneToOne: false
            referencedRelation: "ongs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "adoption_interests_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      animal_photos: {
        Row: {
          animal_id: string
          created_at: string
          id: string
          is_cover: boolean
          public_url: string
          sort_order: number
          storage_path: string
        }
        Insert: {
          animal_id: string
          created_at?: string
          id?: string
          is_cover?: boolean
          public_url: string
          sort_order?: number
          storage_path: string
        }
        Update: {
          animal_id?: string
          created_at?: string
          id?: string
          is_cover?: boolean
          public_url?: string
          sort_order?: number
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "animal_photos_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
        ]
      }
      animal_views: {
        Row: {
          animal_id: string
          id: number
          profile_id: string | null
          viewed_at: string
        }
        Insert: {
          animal_id: string
          id?: number
          profile_id?: string | null
          viewed_at?: string
        }
        Update: {
          animal_id?: string
          id?: number
          profile_id?: string | null
          viewed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "animal_views_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "animal_views_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      animals: {
        Row: {
          adopted_at: string | null
          adopted_by: string | null
          age_group: Database["public"]["Enums"]["animal_age_group"]
          apartment_friendly: boolean
          birth_date: string | null
          breed: string | null
          color: string | null
          cover_photo_url: string | null
          created_at: string
          created_by: string | null
          description: string | null
          energy: Database["public"]["Enums"]["energy_level"]
          good_with_cats: boolean | null
          good_with_dogs: boolean | null
          good_with_kids: boolean | null
          has_microchip: boolean
          id: string
          is_dewormed: boolean
          is_neutered: boolean
          is_vaccinated: boolean
          name: string
          ong_id: string
          published_at: string | null
          sex: Database["public"]["Enums"]["animal_sex"]
          size: Database["public"]["Enums"]["animal_size"]
          special_needs: boolean
          special_needs_desc: string | null
          species: Database["public"]["Enums"]["animal_species"]
          status: Database["public"]["Enums"]["animal_status"]
          updated_at: string
          views_count: number
          weight_kg: number | null
        }
        Insert: {
          adopted_at?: string | null
          adopted_by?: string | null
          age_group: Database["public"]["Enums"]["animal_age_group"]
          apartment_friendly?: boolean
          birth_date?: string | null
          breed?: string | null
          color?: string | null
          cover_photo_url?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          energy?: Database["public"]["Enums"]["energy_level"]
          good_with_cats?: boolean | null
          good_with_dogs?: boolean | null
          good_with_kids?: boolean | null
          has_microchip?: boolean
          id?: string
          is_dewormed?: boolean
          is_neutered?: boolean
          is_vaccinated?: boolean
          name: string
          ong_id: string
          published_at?: string | null
          sex: Database["public"]["Enums"]["animal_sex"]
          size: Database["public"]["Enums"]["animal_size"]
          special_needs?: boolean
          special_needs_desc?: string | null
          species: Database["public"]["Enums"]["animal_species"]
          status?: Database["public"]["Enums"]["animal_status"]
          updated_at?: string
          views_count?: number
          weight_kg?: number | null
        }
        Update: {
          adopted_at?: string | null
          adopted_by?: string | null
          age_group?: Database["public"]["Enums"]["animal_age_group"]
          apartment_friendly?: boolean
          birth_date?: string | null
          breed?: string | null
          color?: string | null
          cover_photo_url?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          energy?: Database["public"]["Enums"]["energy_level"]
          good_with_cats?: boolean | null
          good_with_dogs?: boolean | null
          good_with_kids?: boolean | null
          has_microchip?: boolean
          id?: string
          is_dewormed?: boolean
          is_neutered?: boolean
          is_vaccinated?: boolean
          name?: string
          ong_id?: string
          published_at?: string | null
          sex?: Database["public"]["Enums"]["animal_sex"]
          size?: Database["public"]["Enums"]["animal_size"]
          special_needs?: boolean
          special_needs_desc?: string | null
          species?: Database["public"]["Enums"]["animal_species"]
          status?: Database["public"]["Enums"]["animal_status"]
          updated_at?: string
          views_count?: number
          weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "animals_adopted_by_fkey"
            columns: ["adopted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "animals_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "animals_ong_id_fkey"
            columns: ["ong_id"]
            isOneToOne: false
            referencedRelation: "ongs"
            referencedColumns: ["id"]
          },
        ]
      }
      badges: {
        Row: {
          code: string
          description: string | null
          icon_url: string | null
          id: string
          name: string
          points: number
        }
        Insert: {
          code: string
          description?: string | null
          icon_url?: string | null
          id?: string
          name: string
          points?: number
        }
        Update: {
          code?: string
          description?: string | null
          icon_url?: string | null
          id?: string
          name?: string
          points?: number
        }
        Relationships: []
      }
      coupon_redemptions: {
        Row: {
          coupon_id: string
          id: string
          profile_id: string
          redeemed_at: string
        }
        Insert: {
          coupon_id: string
          id?: string
          profile_id: string
          redeemed_at?: string
        }
        Update: {
          coupon_id?: string
          id?: string
          profile_id?: string
          redeemed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "coupon_redemptions_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupon_redemptions_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      coupons: {
        Row: {
          code: string
          description: string | null
          discount_pct: number | null
          id: string
          max_uses: number | null
          partner_id: string
          title: string
          uses_count: number
          valid_until: string | null
        }
        Insert: {
          code: string
          description?: string | null
          discount_pct?: number | null
          id?: string
          max_uses?: number | null
          partner_id: string
          title: string
          uses_count?: number
          valid_until?: string | null
        }
        Update: {
          code?: string
          description?: string | null
          discount_pct?: number | null
          id?: string
          max_uses?: number | null
          partner_id?: string
          title?: string
          uses_count?: number
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coupons_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      device_tokens: {
        Row: {
          created_at: string
          expo_token: string
          id: string
          last_seen_at: string
          platform: string | null
          profile_id: string
        }
        Insert: {
          created_at?: string
          expo_token: string
          id?: string
          last_seen_at?: string
          platform?: string | null
          profile_id: string
        }
        Update: {
          created_at?: string
          expo_token?: string
          id?: string
          last_seen_at?: string
          platform?: string | null
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "device_tokens_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      donations: {
        Row: {
          amount_cents: number
          confirmed_at: string | null
          created_at: string
          id: string
          is_anonymous: boolean
          message: string | null
          method: string
          ong_id: string
          profile_id: string | null
          status: Database["public"]["Enums"]["donation_status"]
          txid: string | null
        }
        Insert: {
          amount_cents: number
          confirmed_at?: string | null
          created_at?: string
          id?: string
          is_anonymous?: boolean
          message?: string | null
          method?: string
          ong_id: string
          profile_id?: string | null
          status?: Database["public"]["Enums"]["donation_status"]
          txid?: string | null
        }
        Update: {
          amount_cents?: number
          confirmed_at?: string | null
          created_at?: string
          id?: string
          is_anonymous?: boolean
          message?: string | null
          method?: string
          ong_id?: string
          profile_id?: string | null
          status?: Database["public"]["Enums"]["donation_status"]
          txid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donations_ong_id_fkey"
            columns: ["ong_id"]
            isOneToOne: false
            referencedRelation: "ongs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donations_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          animal_id: string
          created_at: string
          profile_id: string
        }
        Insert: {
          animal_id: string
          created_at?: string
          profile_id: string
        }
        Update: {
          animal_id?: string
          created_at?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      health_records: {
        Row: {
          animal_id: string
          attachment_url: string | null
          created_at: string
          created_by: string | null
          event_date: string
          event_type: Database["public"]["Enums"]["health_event_type"]
          id: string
          next_due_date: string | null
          notes: string | null
          title: string
          vet_name: string | null
        }
        Insert: {
          animal_id: string
          attachment_url?: string | null
          created_at?: string
          created_by?: string | null
          event_date: string
          event_type: Database["public"]["Enums"]["health_event_type"]
          id?: string
          next_due_date?: string | null
          notes?: string | null
          title: string
          vet_name?: string | null
        }
        Update: {
          animal_id?: string
          attachment_url?: string | null
          created_at?: string
          created_by?: string | null
          event_date?: string
          event_type?: Database["public"]["Enums"]["health_event_type"]
          id?: string
          next_due_date?: string | null
          notes?: string | null
          title?: string
          vet_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "health_records_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "health_records_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ong_members: {
        Row: {
          created_at: string
          ong_id: string
          profile_id: string
          role: Database["public"]["Enums"]["ong_member_role"]
        }
        Insert: {
          created_at?: string
          ong_id: string
          profile_id: string
          role?: Database["public"]["Enums"]["ong_member_role"]
        }
        Update: {
          created_at?: string
          ong_id?: string
          profile_id?: string
          role?: Database["public"]["Enums"]["ong_member_role"]
        }
        Relationships: [
          {
            foreignKeyName: "ong_members_ong_id_fkey"
            columns: ["ong_id"]
            isOneToOne: false
            referencedRelation: "ongs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ong_members_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ongs: {
        Row: {
          address_district: string | null
          address_number: string | null
          address_street: string | null
          city: string
          cnpj: string | null
          created_at: string
          description: string | null
          email: string | null
          id: string
          instagram: string | null
          is_active: boolean
          is_verified: boolean
          location: unknown
          logo_url: string | null
          name: string
          phone: string | null
          pix_city: string | null
          pix_key: string | null
          pix_key_type: string | null
          pix_receiver_name: string | null
          postal_code: string | null
          slug: string
          state: string
          updated_at: string
          website: string | null
          whatsapp: string | null
        }
        Insert: {
          address_district?: string | null
          address_number?: string | null
          address_street?: string | null
          city: string
          cnpj?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          instagram?: string | null
          is_active?: boolean
          is_verified?: boolean
          location?: unknown
          logo_url?: string | null
          name: string
          phone?: string | null
          pix_city?: string | null
          pix_key?: string | null
          pix_key_type?: string | null
          pix_receiver_name?: string | null
          postal_code?: string | null
          slug: string
          state?: string
          updated_at?: string
          website?: string | null
          whatsapp?: string | null
        }
        Update: {
          address_district?: string | null
          address_number?: string | null
          address_street?: string | null
          city?: string
          cnpj?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          instagram?: string | null
          is_active?: boolean
          is_verified?: boolean
          location?: unknown
          logo_url?: string | null
          name?: string
          phone?: string | null
          pix_city?: string | null
          pix_key?: string | null
          pix_key_type?: string | null
          pix_receiver_name?: string | null
          postal_code?: string | null
          slug?: string
          state?: string
          updated_at?: string
          website?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      partners: {
        Row: {
          category: string | null
          city: string | null
          id: string
          is_active: boolean
          location: unknown
          logo_url: string | null
          name: string
        }
        Insert: {
          category?: string | null
          city?: string | null
          id?: string
          is_active?: boolean
          location?: unknown
          logo_url?: string | null
          name: string
        }
        Update: {
          category?: string | null
          city?: string | null
          id?: string
          is_active?: boolean
          location?: unknown
          logo_url?: string | null
          name?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          author_id: string | null
          body: string
          created_at: string
          event_date: string | null
          id: string
          image_url: string | null
          is_published: boolean
          ong_id: string
          published_at: string | null
          title: string
          type: Database["public"]["Enums"]["post_type"]
        }
        Insert: {
          author_id?: string | null
          body: string
          created_at?: string
          event_date?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean
          ong_id: string
          published_at?: string | null
          title: string
          type?: Database["public"]["Enums"]["post_type"]
        }
        Update: {
          author_id?: string | null
          body?: string
          created_at?: string
          event_date?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean
          ong_id?: string
          published_at?: string | null
          title?: string
          type?: Database["public"]["Enums"]["post_type"]
        }
        Relationships: [
          {
            foreignKeyName: "posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_ong_id_fkey"
            columns: ["ong_id"]
            isOneToOne: false
            referencedRelation: "ongs"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          city: string | null
          created_at: string
          full_name: string
          id: string
          is_platform_admin: boolean
          phone: string | null
          state: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          full_name: string
          id: string
          is_platform_admin?: boolean
          phone?: string | null
          state?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          full_name?: string
          id?: string
          is_platform_admin?: boolean
          phone?: string | null
          state?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          badge_id: string
          earned_at: string
          profile_id: string
        }
        Insert: {
          badge_id: string
          earned_at?: string
          profile_id: string
        }
        Update: {
          badge_id?: string
          earned_at?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_badges_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_match_score: {
        Args: {
          _animal: Database["public"]["Tables"]["animals"]["Row"]
          _pref: Database["public"]["Tables"]["adopter_preferences"]["Row"]
        }
        Returns: number
      }
      is_ong_member: {
        Args: {
          _ong_id: string
          _roles?: Database["public"]["Enums"]["ong_member_role"][]
        }
        Returns: boolean
      }
      search_animals: {
        Args: {
          _age_groups?: Database["public"]["Enums"]["animal_age_group"][]
          _lat?: number
          _limit?: number
          _lng?: number
          _offset?: number
          _ong_id?: string
          _radius_km?: number
          _sizes?: Database["public"]["Enums"]["animal_size"][]
          _species?: Database["public"]["Enums"]["animal_species"][]
        }
        Returns: {
          age_group: Database["public"]["Enums"]["animal_age_group"]
          cover_photo_url: string
          distance_km: number
          id: string
          match_score: number
          name: string
          ong_id: string
          ong_name: string
          sex: Database["public"]["Enums"]["animal_sex"]
          size: Database["public"]["Enums"]["animal_size"]
          species: Database["public"]["Enums"]["animal_species"]
        }[]
      }
    }
    Enums: {
      animal_age_group: "puppy" | "young" | "adult" | "senior"
      animal_sex: "male" | "female"
      animal_size: "small" | "medium" | "large"
      animal_species: "dog" | "cat" | "other"
      animal_status:
        | "draft"
        | "available"
        | "in_process"
        | "adopted"
        | "unavailable"
      donation_status: "intent" | "confirmed" | "cancelled"
      energy_level: "low" | "medium" | "high"
      health_event_type:
        | "vaccine"
        | "deworming"
        | "neutering"
        | "consultation"
        | "exam"
        | "medication"
        | "other"
      housing_type: "apartment" | "house_no_yard" | "house_with_yard" | "rural"
      interest_status:
        | "new"
        | "contacted"
        | "in_review"
        | "approved"
        | "rejected"
        | "completed"
        | "cancelled"
      ong_member_role: "owner" | "admin" | "volunteer"
      post_type: "news" | "campaign" | "event" | "urgent"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      animal_age_group: ["puppy", "young", "adult", "senior"],
      animal_sex: ["male", "female"],
      animal_size: ["small", "medium", "large"],
      animal_species: ["dog", "cat", "other"],
      animal_status: [
        "draft",
        "available",
        "in_process",
        "adopted",
        "unavailable",
      ],
      donation_status: ["intent", "confirmed", "cancelled"],
      energy_level: ["low", "medium", "high"],
      health_event_type: [
        "vaccine",
        "deworming",
        "neutering",
        "consultation",
        "exam",
        "medication",
        "other",
      ],
      housing_type: ["apartment", "house_no_yard", "house_with_yard", "rural"],
      interest_status: [
        "new",
        "contacted",
        "in_review",
        "approved",
        "rejected",
        "completed",
        "cancelled",
      ],
      ong_member_role: ["owner", "admin", "volunteer"],
      post_type: ["news", "campaign", "event", "urgent"],
    },
  },
} as const
