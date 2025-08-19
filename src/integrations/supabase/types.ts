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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_audit_log: {
        Row: {
          action: string
          admin_user_id: string
          created_at: string
          details: Json | null
          id: string
          ip_address: unknown | null
          target_user_id: string | null
          user_agent: string | null
        }
        Insert: {
          action: string
          admin_user_id: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          target_user_id?: string | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          admin_user_id?: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          target_user_id?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      admin_sessions: {
        Row: {
          ended_at: string | null
          id: string
          ip_address: unknown | null
          is_active: boolean
          last_activity: string
          session_start: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          ended_at?: string | null
          id?: string
          ip_address?: unknown | null
          is_active?: boolean
          last_activity?: string
          session_start?: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          ended_at?: string | null
          id?: string
          ip_address?: unknown | null
          is_active?: boolean
          last_activity?: string
          session_start?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      analytics_events: {
        Row: {
          created_at: string
          event_data: Json | null
          event_name: string
          id: string
          ip_address: unknown | null
          page_url: string | null
          referrer: string | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_data?: Json | null
          event_name: string
          id?: string
          ip_address?: unknown | null
          page_url?: string | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_data?: Json | null
          event_name?: string
          id?: string
          ip_address?: unknown | null
          page_url?: string | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      campaign_sends: {
        Row: {
          campaign_id: string
          clicked_at: string | null
          id: string
          opened_at: string | null
          sent_at: string
          status: string | null
          user_id: string
        }
        Insert: {
          campaign_id: string
          clicked_at?: string | null
          id?: string
          opened_at?: string | null
          sent_at?: string
          status?: string | null
          user_id: string
        }
        Update: {
          campaign_id?: string
          clicked_at?: string | null
          id?: string
          opened_at?: string | null
          sent_at?: string
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_sends_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "marketing_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          slug: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          slug: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          slug?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      course_content: {
        Row: {
          content_text: string | null
          content_type: string
          content_url: string | null
          course_id: string
          created_at: string
          duration_minutes: number | null
          id: string
          is_free: boolean | null
          sort_order: number | null
          title: string
          updated_at: string
        }
        Insert: {
          content_text?: string | null
          content_type: string
          content_url?: string | null
          course_id: string
          created_at?: string
          duration_minutes?: number | null
          id?: string
          is_free?: boolean | null
          sort_order?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          content_text?: string | null
          content_type?: string
          content_url?: string | null
          course_id?: string
          created_at?: string
          duration_minutes?: number | null
          id?: string
          is_free?: boolean | null
          sort_order?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_content_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          created_at: string
          description: string | null
          difficulty_level: string | null
          duration_minutes: number | null
          id: string
          is_published: boolean | null
          price: number | null
          slug: string
          sort_order: number | null
          subject_id: string
          thumbnail_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          difficulty_level?: string | null
          duration_minutes?: number | null
          id?: string
          is_published?: boolean | null
          price?: number | null
          slug: string
          sort_order?: number | null
          subject_id: string
          thumbnail_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          difficulty_level?: string | null
          duration_minutes?: number | null
          id?: string
          is_published?: boolean | null
          price?: number | null
          slug?: string
          sort_order?: number | null
          subject_id?: string
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "courses_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      data_retention_policies: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          last_cleanup_at: string | null
          retention_days: number
          table_name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_cleanup_at?: string | null
          retention_days: number
          table_name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_cleanup_at?: string | null
          retention_days?: number
          table_name?: string
        }
        Relationships: []
      }
      enrollments: {
        Row: {
          completed_at: string | null
          course_id: string
          enrolled_at: string
          id: string
          progress_percentage: number | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          course_id: string
          enrolled_at?: string
          id?: string
          progress_percentage?: number | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          course_id?: string
          enrolled_at?: string
          id?: string
          progress_percentage?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      guest_access_rate_limit: {
        Row: {
          attempt_count: number
          first_attempt_at: string
          id: string
          ip_address: unknown
          is_blocked: boolean
          last_attempt_at: string
        }
        Insert: {
          attempt_count?: number
          first_attempt_at?: string
          id?: string
          ip_address: unknown
          is_blocked?: boolean
          last_attempt_at?: string
        }
        Update: {
          attempt_count?: number
          first_attempt_at?: string
          id?: string
          ip_address?: unknown
          is_blocked?: boolean
          last_attempt_at?: string
        }
        Relationships: []
      }
      marketing_campaigns: {
        Row: {
          campaign_type: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          message_template: Json | null
          name: string
          target_audience: Json | null
          trigger_conditions: Json | null
          updated_at: string
        }
        Insert: {
          campaign_type: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          message_template?: Json | null
          name: string
          target_audience?: Json | null
          trigger_conditions?: Json | null
          updated_at?: string
        }
        Update: {
          campaign_type?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          message_template?: Json | null
          name?: string
          target_audience?: Json | null
          trigger_conditions?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      quiz_questions: {
        Row: {
          content_id: string
          correct_answer: string | null
          created_at: string
          explanation: string | null
          id: string
          options: Json | null
          question: string
          question_type: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          content_id: string
          correct_answer?: string | null
          created_at?: string
          explanation?: string | null
          id?: string
          options?: Json | null
          question: string
          question_type: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          content_id?: string
          correct_answer?: string | null
          created_at?: string
          explanation?: string | null
          id?: string
          options?: Json | null
          question?: string
          question_type?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_questions_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "course_content"
            referencedColumns: ["id"]
          },
        ]
      }
      registration_responses: {
        Row: {
          completed_at: string
          id: string
          response_data: Json
          step_name: string
          user_id: string
        }
        Insert: {
          completed_at?: string
          id?: string
          response_data: Json
          step_name: string
          user_id: string
        }
        Update: {
          completed_at?: string
          id?: string
          response_data?: Json
          step_name?: string
          user_id?: string
        }
        Relationships: []
      }
      registration_steps: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          is_required: boolean | null
          sort_order: number | null
          step_config: Json | null
          step_description: string | null
          step_name: string
          step_title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          is_required?: boolean | null
          sort_order?: number | null
          step_config?: Json | null
          step_description?: string | null
          step_name: string
          step_title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          is_required?: boolean | null
          sort_order?: number | null
          step_config?: Json | null
          step_description?: string | null
          step_name?: string
          step_title?: string
          updated_at?: string
        }
        Relationships: []
      }
      subjects: {
        Row: {
          category_id: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          slug: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          category_id: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          slug: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          category_id?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          slug?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subjects_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          company: string | null
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          is_admin: boolean | null
          last_name: string | null
          marketing_consent: boolean | null
          phone: string | null
          position: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          is_admin?: boolean | null
          last_name?: string | null
          marketing_consent?: boolean | null
          phone?: string | null
          position?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          is_admin?: boolean | null
          last_name?: string | null
          marketing_consent?: boolean | null
          phone?: string | null
          position?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          completion_percentage: number | null
          content_id: string
          id: string
          last_accessed_at: string
          time_spent_seconds: number | null
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          completion_percentage?: number | null
          content_id: string
          id?: string
          last_accessed_at?: string
          time_spent_seconds?: number | null
          user_id: string
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          completion_percentage?: number | null
          content_id?: string
          id?: string
          last_accessed_at?: string
          time_spent_seconds?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "course_content"
            referencedColumns: ["id"]
          },
        ]
      }
      workshop_registrations: {
        Row: {
          confirmation_code: string
          created_at: string
          guest_email: string | null
          guest_name: string | null
          guest_phone: string | null
          id: string
          registration_date: string
          status: string
          updated_at: string
          user_id: string | null
          workshop_id: string
        }
        Insert: {
          confirmation_code?: string
          created_at?: string
          guest_email?: string | null
          guest_name?: string | null
          guest_phone?: string | null
          id?: string
          registration_date?: string
          status?: string
          updated_at?: string
          user_id?: string | null
          workshop_id: string
        }
        Update: {
          confirmation_code?: string
          created_at?: string
          guest_email?: string | null
          guest_name?: string | null
          guest_phone?: string | null
          id?: string
          registration_date?: string
          status?: string
          updated_at?: string
          user_id?: string | null
          workshop_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_workshop_registrations_workshop_id"
            columns: ["workshop_id"]
            isOneToOne: false
            referencedRelation: "workshops"
            referencedColumns: ["id"]
          },
        ]
      }
      workshops: {
        Row: {
          category: string
          created_at: string
          date: string
          description: string | null
          id: string
          instructor: string
          location: string
          max_capacity: number
          name: string
          skill_level: string
          spots_remaining: number
          time: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          date: string
          description?: string | null
          id?: string
          instructor: string
          location?: string
          max_capacity?: number
          name: string
          skill_level: string
          spots_remaining?: number
          time: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          instructor?: string
          location?: string
          max_capacity?: number
          name?: string
          skill_level?: string
          spots_remaining?: number
          time?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      anonymize_expired_analytics: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      anonymize_guest_data_enhanced: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      anonymize_old_guest_registrations: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      anonymize_user_data: {
        Args: { target_user_id: string }
        Returns: boolean
      }
      cancel_registration_by_code: {
        Args: { p_code: string }
        Returns: {
          confirmation_code: string
          created_at: string
          guest_email: string | null
          guest_name: string | null
          guest_phone: string | null
          id: string
          registration_date: string
          status: string
          updated_at: string
          user_id: string | null
          workshop_id: string
        }
      }
      check_guest_access_rate_limit: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      check_guest_access_rate_limit_enhanced: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      cleanup_expired_analytics_data: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      cleanup_expired_guest_registrations: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      create_guest_registration: {
        Args: {
          p_email: string
          p_name?: string
          p_phone?: string
          p_workshop_id: string
        }
        Returns: {
          confirmation_code: string
          id: string
        }[]
      }
      get_admin_audit_logs: {
        Args: { limit_count?: number; offset_count?: number }
        Returns: {
          action: string
          admin_email: string
          created_at: string
          details: Json
          id: string
          ip_address: unknown
          target_email: string
          user_agent: string
        }[]
      }
      get_guest_registration_secure: {
        Args: { p_confirmation_code: string; p_guest_email?: string }
        Returns: {
          confirmation_code: string
          guest_email: string
          guest_name: string
          guest_phone: string
          id: string
          registration_date: string
          status: string
          workshop_id: string
        }[]
      }
      get_guest_registrations_by_email_secure: {
        Args: { p_confirmation_code: string; p_email: string }
        Returns: {
          confirmation_code: string
          guest_email: string
          guest_name: string
          guest_phone: string
          id: string
          registration_date: string
          status: string
          workshop_id: string
        }[]
      }
      get_registration_by_code: {
        Args: { p_code: string }
        Returns: {
          confirmation_code: string
          created_at: string
          guest_email: string | null
          guest_name: string | null
          guest_phone: string | null
          id: string
          registration_date: string
          status: string
          updated_at: string
          user_id: string | null
          workshop_id: string
        }[]
      }
      get_workshops_week: {
        Args: {
          p_categories?: string[]
          p_end: string
          p_levels?: string[]
          p_query?: string
          p_start: string
        }
        Returns: {
          category: string
          date: string
          description: string
          id: string
          instructor: string
          location: string
          max_capacity: number
          name: string
          registrations_count: number
          skill_level: string
          spots_remaining: number
          time_text: string
        }[]
      }
      is_current_user_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      link_guest_regs_to_user: {
        Args: { p_email: string }
        Returns: number
      }
      log_security_event: {
        Args: {
          p_event_details?: Json
          p_event_type: string
          p_severity?: string
        }
        Returns: undefined
      }
      log_sensitive_data_access: {
        Args: {
          p_operation: string
          p_record_id?: string
          p_table_name: string
          p_user_agent?: string
        }
        Returns: undefined
      }
      sanitize_text_input: {
        Args: { input_text: string }
        Returns: string
      }
      track_admin_session: {
        Args: { p_ip_address?: unknown; p_user_agent?: string }
        Returns: string
      }
      update_user_admin_status: {
        Args: {
          new_admin_status: boolean
          requester_ip?: unknown
          requester_user_agent?: string
          target_user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
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
  public: {
    Enums: {},
  },
} as const
