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
      email_notifications: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          notification_email: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          notification_email?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          notification_email?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      error_logs: {
        Row: {
          action: string | null
          component: string | null
          created_at: string | null
          id: string
          message: string
          stack: string | null
          timestamp: string
          user_id: string | null
        }
        Insert: {
          action?: string | null
          component?: string | null
          created_at?: string | null
          id?: string
          message: string
          stack?: string | null
          timestamp: string
          user_id?: string | null
        }
        Update: {
          action?: string | null
          component?: string | null
          created_at?: string | null
          id?: string
          message?: string
          stack?: string | null
          timestamp?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "error_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "ieasalvay_usuarios"
            referencedColumns: ["user_id"]
          },
        ]
      }
      ieasalvay_bioquimicas_problemas: {
        Row: {
          archivos_urls: string[] | null
          biochemist_id: string | null
          categoria: string
          created_at: string | null
          descripcion: string
          estado: string
          id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          archivos_urls?: string[] | null
          biochemist_id?: string | null
          categoria: string
          created_at?: string | null
          descripcion: string
          estado: string
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          archivos_urls?: string[] | null
          biochemist_id?: string | null
          categoria?: string
          created_at?: string | null
          descripcion?: string
          estado?: string
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_biochemist_id"
            columns: ["biochemist_id"]
            isOneToOne: false
            referencedRelation: "ieasalvay_usuarios"
            referencedColumns: ["user_id"]
          },
        ]
      }
      ieasalvay_capacitaciones: {
        Row: {
          cantidad_horas: number | null
          costo: number | null
          created_at: string | null
          documentacion_impacto: string | null
          entidad: string
          estado: Database["public"]["Enums"]["capacitacion_estado"] | null
          fecha_conclusion: string | null
          fecha_inicio: string
          id: string
          nombre_curso: string
          nombre_profesional: string
          programa: string | null
          user_id: string | null
        }
        Insert: {
          cantidad_horas?: number | null
          costo?: number | null
          created_at?: string | null
          documentacion_impacto?: string | null
          entidad: string
          estado?: Database["public"]["Enums"]["capacitacion_estado"] | null
          fecha_conclusion?: string | null
          fecha_inicio: string
          id?: string
          nombre_curso: string
          nombre_profesional: string
          programa?: string | null
          user_id?: string | null
        }
        Update: {
          cantidad_horas?: number | null
          costo?: number | null
          created_at?: string | null
          documentacion_impacto?: string | null
          entidad?: string
          estado?: Database["public"]["Enums"]["capacitacion_estado"] | null
          fecha_conclusion?: string | null
          fecha_inicio?: string
          id?: string
          nombre_curso?: string
          nombre_profesional?: string
          programa?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ieasalvay_capacitaciones_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "ieasalvay_usuarios"
            referencedColumns: ["user_id"]
          },
        ]
      }
      ieasalvay_conversion: {
        Row: {
          created_at: string | null
          error_message: string | null
          id: string
          original_filename: string
          records_count: number
          status: string
          table_name: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          original_filename: string
          records_count: number
          status?: string
          table_name: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          original_filename?: string
          records_count?: number
          status?: string
          table_name?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ieasalvay_conversion_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "ieasalvay_usuarios"
            referencedColumns: ["user_id"]
          },
        ]
      }
      ieasalvay_marketing: {
        Row: {
          created_at: string
          designLinks: string
          footerText: string
          id: number
          ideaDescription: string
          postDate: string
          Source: string | null
          status: string
        }
        Insert: {
          created_at?: string
          designLinks: string
          footerText: string
          id?: number
          ideaDescription: string
          postDate: string
          Source?: string | null
          status: string
        }
        Update: {
          created_at?: string
          designLinks?: string
          footerText?: string
          id?: number
          ideaDescription?: string
          postDate?: string
          Source?: string | null
          status?: string
        }
        Relationships: []
      }
      ieasalvay_nbu: {
        Row: {
          created_at: string | null
          effective_date: string | null
          id: string
          id_obrasocial: number | null
          value: number | null
        }
        Insert: {
          created_at?: string | null
          effective_date?: string | null
          id?: string
          id_obrasocial?: number | null
          value?: number | null
        }
        Update: {
          created_at?: string | null
          effective_date?: string | null
          id?: string
          id_obrasocial?: number | null
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ieasalvay_nbu_id_obrasocial_fkey"
            columns: ["id_obrasocial"]
            isOneToOne: false
            referencedRelation: "ieasalvay_obrasocial"
            referencedColumns: ["id"]
          },
        ]
      }
      ieasalvay_obrasocial: {
        Row: {
          contactprovider: string | null
          created_at: string | null
          id: number
          nameprovider: string | null
          startdateprovider: string | null
        }
        Insert: {
          contactprovider?: string | null
          created_at?: string | null
          id?: number
          nameprovider?: string | null
          startdateprovider?: string | null
        }
        Update: {
          contactprovider?: string | null
          created_at?: string | null
          id?: number
          nameprovider?: string | null
          startdateprovider?: string | null
        }
        Relationships: []
      }
      ieasalvay_pacientes: {
        Row: {
          ciudad: string | null
          codigo_postal: string | null
          created_at: string | null
          domicilio: string | null
          fecha_nacimiento: string | null
          id: string
          id_obrasocial: number | null
          id_paciente: string
          nombre: string
          provincia: string | null
          sexo: string | null
          telefono_1: string | null
          telefono_2: string | null
          updated_at: string | null
        }
        Insert: {
          ciudad?: string | null
          codigo_postal?: string | null
          created_at?: string | null
          domicilio?: string | null
          fecha_nacimiento?: string | null
          id?: string
          id_obrasocial?: number | null
          id_paciente: string
          nombre: string
          provincia?: string | null
          sexo?: string | null
          telefono_1?: string | null
          telefono_2?: string | null
          updated_at?: string | null
        }
        Update: {
          ciudad?: string | null
          codigo_postal?: string | null
          created_at?: string | null
          domicilio?: string | null
          fecha_nacimiento?: string | null
          id?: string
          id_obrasocial?: number | null
          id_paciente?: string
          nombre?: string
          provincia?: string | null
          sexo?: string | null
          telefono_1?: string | null
          telefono_2?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ieasalvay_pacientes_id_obrasocial_fkey"
            columns: ["id_obrasocial"]
            isOneToOne: false
            referencedRelation: "ieasalvay_obrasocial"
            referencedColumns: ["id"]
          },
        ]
      }
      ieasalvay_pacientes_protocolos: {
        Row: {
          created_at: string | null
          direccion: string | null
          dni: string
          edad: number | null
          email: string | null
          fecha_nacimiento: string | null
          id: string
          id_paciente: string
          localidad: string | null
          nombre_paciente: string
          nro_afiliado: string | null
          obra_social: string | null
          provincia: string | null
          telefono: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          direccion?: string | null
          dni: string
          edad?: number | null
          email?: string | null
          fecha_nacimiento?: string | null
          id?: string
          id_paciente: string
          localidad?: string | null
          nombre_paciente: string
          nro_afiliado?: string | null
          obra_social?: string | null
          provincia?: string | null
          telefono?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          direccion?: string | null
          dni?: string
          edad?: number | null
          email?: string | null
          fecha_nacimiento?: string | null
          id?: string
          id_paciente?: string
          localidad?: string | null
          nombre_paciente?: string
          nro_afiliado?: string | null
          obra_social?: string | null
          provincia?: string | null
          telefono?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ieasalvay_pacientes_protocolos_id_paciente_fkey"
            columns: ["id_paciente"]
            isOneToOne: false
            referencedRelation: "ieasalvay_pacientes"
            referencedColumns: ["id"]
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
      capacitacion_estado: "Concluido" | "En curso" | "Pendiente" | "Cancelado"
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
      problema_categoria: "autorizacion" | "paciente" | "reactivos"
      problema_estado: "resuelto" | "pendiente" | "impacto aceptado"
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
