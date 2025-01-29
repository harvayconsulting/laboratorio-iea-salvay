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
      ieasalvay_nbu: {
        Row: {
          created_at: string | null
          effective_date: string
          id: string
          provider: Database["public"]["Enums"]["insurance_provider"]
          user_id: string | null
          value: number
        }
        Insert: {
          created_at?: string | null
          effective_date: string
          id?: string
          provider: Database["public"]["Enums"]["insurance_provider"]
          user_id?: string | null
          value: number
        }
        Update: {
          created_at?: string | null
          effective_date?: string
          id?: string
          provider?: Database["public"]["Enums"]["insurance_provider"]
          user_id?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "ieasalvay_nbu_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "ieasalvay_usuarios"
            referencedColumns: ["user_id"]
          },
        ]
      }
      ieasalvay_recesos: {
        Row: {
          comments: string | null
          created_date: string | null
          end_date: string
          id: string
          start_date: string
          user_id: string | null
        }
        Insert: {
          comments?: string | null
          created_date?: string | null
          end_date: string
          id?: string
          start_date: string
          user_id?: string | null
        }
        Update: {
          comments?: string | null
          created_date?: string | null
          end_date?: string
          id?: string
          start_date?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ieasalvay_recesos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "ieasalvay_usuarios"
            referencedColumns: ["user_id"]
          },
        ]
      }
      ieasalvay_usuarios: {
        Row: {
          password: string
          user_id: string
          user_name: string
          user_type: Database["public"]["Enums"]["user_type"]
        }
        Insert: {
          password: string
          user_id?: string
          user_name: string
          user_type: Database["public"]["Enums"]["user_type"]
        }
        Update: {
          password?: string
          user_id?: string
          user_name?: string
          user_type?: Database["public"]["Enums"]["user_type"]
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      insurance_provider:
        | "AVALIAN"
        | "APROSS"
        | "CAJA_ABOGADOS"
        | "CAJA_NOTARIAL"
        | "CPCE"
        | "DASPU"
        | "FEDERADA_1"
        | "FEDERADA_2_3_4000"
        | "JERARQUICOS_PMO"
        | "JERARQUICOS_ALTA_FRECUENCIA"
        | "GALENO"
        | "MEDIFE"
        | "MUTUAL_TAXI"
        | "NOBIS"
        | "OMINT"
        | "OSDE"
        | "PAMI_1EROS_6"
        | "PAMI_(7MO_ADELANTE)"
        | "PARTICULARES_BAJA"
        | "PARTICULARES_ALTA"
        | "PREVENCIÓN_A1_A2"
        | "PREVENCIÓN_A3_A6"
        | "SANCOR_500"
        | "SANCOR_1000"
        | "SIPSSA"
        | "SWISS_MEDICAL"
      user_type: "admin" | "bioquimica"
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
