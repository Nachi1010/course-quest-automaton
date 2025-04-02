export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      activity_log: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: number
          ip_address: string | null
          table_name: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: number
          ip_address?: string | null
          table_name: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: number
          ip_address?: string | null
          table_name?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      questionnaire_data: {
        Row: {
          answers: Json | null
          contact_info: Json | null
          created_at: string | null
          id: number
          is_submitted: boolean | null
          page: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          answers?: Json | null
          contact_info?: Json | null
          created_at?: string | null
          id?: number
          is_submitted?: boolean | null
          page: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          answers?: Json | null
          contact_info?: Json | null
          created_at?: string | null
          id?: number
          is_submitted?: boolean | null
          page?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "questionnaire_data_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "registration_data"
            referencedColumns: ["user_id"]
          },
        ]
      }
      registration_data: {
        Row: {
          created_at: string | null
          email: string | null
          id: number
          id_number: string | null
          is_verified: boolean | null
          metadata: Json | null
          name: string | null
          phone: string | null
          updated_at: string | null
          user_id: string
          verification_code: string | null
          verification_sent_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: number
          id_number?: string | null
          is_verified?: boolean | null
          metadata?: Json | null
          name?: string | null
          phone?: string | null
          updated_at?: string | null
          user_id: string
          verification_code?: string | null
          verification_sent_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: number
          id_number?: string | null
          is_verified?: boolean | null
          metadata?: Json | null
          name?: string | null
          phone?: string | null
          updated_at?: string | null
          user_id?: string
          verification_code?: string | null
          verification_sent_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_connection: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      check_table_exists: {
        Args: {
          table_name: string
        }
        Returns: Json
      }
      check_tables: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      coalesce_null_status: {
        Args: {
          user_id: string
          default_status: string
        }
        Returns: string
      }
      exec_sql: {
        Args: {
          sql: string
        }
        Returns: undefined
      }
      execute_sql:
        | {
            Args: {
              params: Json
            }
            Returns: Json
          }
        | {
            Args: {
              sql_command: string
            }
            Returns: Json
          }
      get_questionnaire_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_users: number
          pending_count: number
          completed_count: number
        }[]
      }
      get_storage_data: {
        Args: {
          p_key: string
          p_user_id: string
        }
        Returns: Json
      }
      get_table_columns: {
        Args: {
          table_name: string
        }
        Returns: Json
      }
      get_user_id_by_identifier: {
        Args: {
          p_identifier: string
        }
        Returns: string
      }
      get_user_progress: {
        Args: {
          p_user_id: string
        }
        Returns: {
          page: number
          answers: Json
          contact_info: Json
          updated_at: string
        }[]
      }
      insert_submission:
        | {
            Args: {
              payload: Json
            }
            Returns: Json
          }
        | {
            Args: {
              user_id: string
              answers: Json
              contact_info: Json
              submission_time?: string
            }
            Returns: Json
          }
        | {
            Args: {
              user_id: string
              answers: Json
              contact_info: Json
              time: string
            }
            Returns: Json
          }
      is_admin_user: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      register_or_update_user: {
        Args: {
          p_name: string
          p_email: string
          p_phone: string
          p_id_number?: string
          p_source?: string
        }
        Returns: string
      }
      register_user: {
        Args: {
          p_name?: string
          p_email?: string
          p_phone?: string
          p_id_number?: string
          p_source?: string
        }
        Returns: Json
      }
      save_storage_data: {
        Args: {
          p_key: string
          p_value: Json
          p_user_id: string
        }
        Returns: Json
      }
      submit_questionnaire: {
        Args: {
          p_user_id: string
          p_answers: Json
          p_contact_info: Json
        }
        Returns: undefined
      }
      submitquestionnaire: {
        Args: {
          userid: string
          answers: Json
          contactinfo: Json
        }
        Returns: Json
      }
      upsert_questionnaire_progress: {
        Args: {
          p_user_id: string
          p_page: number
          p_answers: Json
          p_contact_info?: Json
        }
        Returns: undefined
      }
      verify_registration: {
        Args: {
          p_identifier: string
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
