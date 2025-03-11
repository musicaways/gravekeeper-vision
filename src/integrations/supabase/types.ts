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
      ai_chat_functions: {
        Row: {
          code: string
          created_at: string | null
          created_by: string | null
          description: string | null
          enabled: boolean | null
          function_type: string | null
          id: string
          is_active: boolean | null
          name: string
          parameters_schema: Json | null
          trigger_phrases: string[]
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          enabled?: boolean | null
          function_type?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          parameters_schema?: Json | null
          trigger_phrases: string[]
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          enabled?: boolean | null
          function_type?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          parameters_schema?: Json | null
          trigger_phrases?: string[]
          updated_at?: string | null
        }
        Relationships: []
      }
      api_keys: {
        Row: {
          created_at: string | null
          gemini_key: string | null
          googlemaps_key: string | null
          groq_key: string | null
          huggingface_key: string | null
          id: string
          perplexity_key: string | null
          serpstack_key: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          gemini_key?: string | null
          googlemaps_key?: string | null
          groq_key?: string | null
          huggingface_key?: string | null
          id?: string
          perplexity_key?: string | null
          serpstack_key?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          gemini_key?: string | null
          googlemaps_key?: string | null
          groq_key?: string | null
          huggingface_key?: string | null
          id?: string
          perplexity_key?: string | null
          serpstack_key?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      Blocco: {
        Row: {
          Annotazioni: string | null
          available_plots: number | null
          block_code: string | null
          Codice: string | null
          geo_boundary: Json | null
          Id: number
          IdSettore: number | null
          Nome: string | null
          NumeroFile: number | null
          NumeroFileInterrate: number | null
          NumeroLoculi: number | null
          NumeroPartenza: number | null
          PassoNumeri: number | null
          TipoNumerazione: number | null
          total_plots: number | null
        }
        Insert: {
          Annotazioni?: string | null
          available_plots?: number | null
          block_code?: string | null
          Codice?: string | null
          geo_boundary?: Json | null
          Id?: number
          IdSettore?: number | null
          Nome?: string | null
          NumeroFile?: number | null
          NumeroFileInterrate?: number | null
          NumeroLoculi?: number | null
          NumeroPartenza?: number | null
          PassoNumeri?: number | null
          TipoNumerazione?: number | null
          total_plots?: number | null
        }
        Update: {
          Annotazioni?: string | null
          available_plots?: number | null
          block_code?: string | null
          Codice?: string | null
          geo_boundary?: Json | null
          Id?: number
          IdSettore?: number | null
          Nome?: string | null
          NumeroFile?: number | null
          NumeroFileInterrate?: number | null
          NumeroLoculi?: number | null
          NumeroPartenza?: number | null
          PassoNumeri?: number | null
          TipoNumerazione?: number | null
          total_plots?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "Blocco_IdSettore_fkey"
            columns: ["IdSettore"]
            isOneToOne: false
            referencedRelation: "Settore"
            referencedColumns: ["Id"]
          },
        ]
      }
      Cimitero: {
        Row: {
          active: boolean | null
          camera_mortuaria: boolean | null
          cavalletti: boolean | null
          chiesa: boolean | null
          city: string | null
          Codice: string | null
          contact_info: Json | null
          country: string | null
          custom_map_marker_id: string | null
          Descrizione: string | null
          established_date: string | null
          FotoCopertina: string | null
          geo_location: Json | null
          Id: number
          impalcatura: boolean | null
          Indirizzo: string | null
          Latitudine: number | null
          Longitudine: number | null
          nome: string | null
          Nome: string | null
          Note: string | null
          operating_hours: Json | null
          postal_code: string | null
          ricevimento_salme: boolean | null
          state: string | null
          total_area_sqm: number | null
        }
        Insert: {
          active?: boolean | null
          camera_mortuaria?: boolean | null
          cavalletti?: boolean | null
          chiesa?: boolean | null
          city?: string | null
          Codice?: string | null
          contact_info?: Json | null
          country?: string | null
          custom_map_marker_id?: string | null
          Descrizione?: string | null
          established_date?: string | null
          FotoCopertina?: string | null
          geo_location?: Json | null
          Id: number
          impalcatura?: boolean | null
          Indirizzo?: string | null
          Latitudine?: number | null
          Longitudine?: number | null
          nome?: string | null
          Nome?: string | null
          Note?: string | null
          operating_hours?: Json | null
          postal_code?: string | null
          ricevimento_salme?: boolean | null
          state?: string | null
          total_area_sqm?: number | null
        }
        Update: {
          active?: boolean | null
          camera_mortuaria?: boolean | null
          cavalletti?: boolean | null
          chiesa?: boolean | null
          city?: string | null
          Codice?: string | null
          contact_info?: Json | null
          country?: string | null
          custom_map_marker_id?: string | null
          Descrizione?: string | null
          established_date?: string | null
          FotoCopertina?: string | null
          geo_location?: Json | null
          Id?: number
          impalcatura?: boolean | null
          Indirizzo?: string | null
          Latitudine?: number | null
          Longitudine?: number | null
          nome?: string | null
          Nome?: string | null
          Note?: string | null
          operating_hours?: Json | null
          postal_code?: string | null
          ricevimento_salme?: boolean | null
          state?: string | null
          total_area_sqm?: number | null
        }
        Relationships: []
      }
      cimiterodocumenti: {
        Row: {
          datainserimento: string | null
          descrizione: string | null
          id: string
          idcimitero: number
          nomefile: string
          tipofile: string
          url: string
        }
        Insert: {
          datainserimento?: string | null
          descrizione?: string | null
          id?: string
          idcimitero: number
          nomefile: string
          tipofile: string
          url: string
        }
        Update: {
          datainserimento?: string | null
          descrizione?: string | null
          id?: string
          idcimitero?: number
          nomefile?: string
          tipofile?: string
          url?: string
        }
        Relationships: []
      }
      CimiteroDocumenti: {
        Row: {
          DataInserimento: string | null
          Descrizione: string | null
          Id: string
          IdCimitero: number
          NomeFile: string
          TipoFile: string
          Url: string
        }
        Insert: {
          DataInserimento?: string | null
          Descrizione?: string | null
          Id?: string
          IdCimitero: number
          NomeFile: string
          TipoFile: string
          Url: string
        }
        Update: {
          DataInserimento?: string | null
          Descrizione?: string | null
          Id?: string
          IdCimitero?: number
          NomeFile?: string
          TipoFile?: string
          Url?: string
        }
        Relationships: [
          {
            foreignKeyName: "CimiteroDocumenti_IdCimitero_fkey"
            columns: ["IdCimitero"]
            isOneToOne: false
            referencedRelation: "Cimitero"
            referencedColumns: ["Id"]
          },
        ]
      }
      CimiteroFoto: {
        Row: {
          DataInserimento: string | null
          Descrizione: string | null
          Id: string
          IdCimitero: number
          NomeFile: string | null
          TipoFile: string | null
          Url: string
        }
        Insert: {
          DataInserimento?: string | null
          Descrizione?: string | null
          Id?: string
          IdCimitero: number
          NomeFile?: string | null
          TipoFile?: string | null
          Url: string
        }
        Update: {
          DataInserimento?: string | null
          Descrizione?: string | null
          Id?: string
          IdCimitero?: number
          NomeFile?: string | null
          TipoFile?: string | null
          Url?: string
        }
        Relationships: [
          {
            foreignKeyName: "CimiteroFoto_IdCimitero_fkey"
            columns: ["IdCimitero"]
            isOneToOne: false
            referencedRelation: "Cimitero"
            referencedColumns: ["Id"]
          },
        ]
      }
      CimiteroMappe: {
        Row: {
          DataInserimento: string | null
          Descrizione: string | null
          Id: string
          IdCimitero: number
          NomeFile: string | null
          TipoFile: string | null
          Url: string
        }
        Insert: {
          DataInserimento?: string | null
          Descrizione?: string | null
          Id?: string
          IdCimitero: number
          NomeFile?: string | null
          TipoFile?: string | null
          Url: string
        }
        Update: {
          DataInserimento?: string | null
          Descrizione?: string | null
          Id?: string
          IdCimitero?: number
          NomeFile?: string | null
          TipoFile?: string | null
          Url?: string
        }
        Relationships: [
          {
            foreignKeyName: "CimiteroMappe_IdCimitero_fkey"
            columns: ["IdCimitero"]
            isOneToOne: false
            referencedRelation: "Cimitero"
            referencedColumns: ["Id"]
          },
        ]
      }
      defunti: {
        Row: {
          annotazioni: string | null
          created_at: string | null
          data_decesso: string | null
          data_nascita: string | null
          eta: number | null
          id: string
          id_loculo: string | null
          nominativo: string
          sesso: string | null
          updated_at: string | null
        }
        Insert: {
          annotazioni?: string | null
          created_at?: string | null
          data_decesso?: string | null
          data_nascita?: string | null
          eta?: number | null
          id?: string
          id_loculo?: string | null
          nominativo: string
          sesso?: string | null
          updated_at?: string | null
        }
        Update: {
          annotazioni?: string | null
          created_at?: string | null
          data_decesso?: string | null
          data_nascita?: string | null
          eta?: number | null
          id?: string
          id_loculo?: string | null
          nominativo?: string
          sesso?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      Defunto: {
        Row: {
          DataDecesso: string | null
          DataNascita: string | null
          Eta: string | null
          Id: number
          IdLoculo: number | null
          Nominativo: string | null
          Posto: string | null
          Sesso: string | null
          StatoDefunto: number | null
        }
        Insert: {
          DataDecesso?: string | null
          DataNascita?: string | null
          Eta?: string | null
          Id: number
          IdLoculo?: number | null
          Nominativo?: string | null
          Posto?: string | null
          Sesso?: string | null
          StatoDefunto?: number | null
        }
        Update: {
          DataDecesso?: string | null
          DataNascita?: string | null
          Eta?: string | null
          Id?: number
          IdLoculo?: number | null
          Nominativo?: string | null
          Posto?: string | null
          Sesso?: string | null
          StatoDefunto?: number | null
        }
        Relationships: []
      }
      execute_sql: {
        Row: {
          executed_at: string | null
          id: string
          sql: string
        }
        Insert: {
          executed_at?: string | null
          id?: string
          sql: string
        }
        Update: {
          executed_at?: string | null
          id?: string
          sql?: string
        }
        Relationships: []
      }
      Loculo: {
        Row: {
          Alias: string | null
          Annotazioni: string | null
          Concesso: boolean | null
          created_at: string | null
          Fila: number | null
          FilaDaAlto: number | null
          id: number
          IdBlocco: number | null
          Numero: number | null
          NumeroPosti: number | null
          NumeroPostiResti: number | null
          Superficie: number | null
          TipoTomba: number | null
          updated_at: string | null
        }
        Insert: {
          Alias?: string | null
          Annotazioni?: string | null
          Concesso?: boolean | null
          created_at?: string | null
          Fila?: number | null
          FilaDaAlto?: number | null
          id: number
          IdBlocco?: number | null
          Numero?: number | null
          NumeroPosti?: number | null
          NumeroPostiResti?: number | null
          Superficie?: number | null
          TipoTomba?: number | null
          updated_at?: string | null
        }
        Update: {
          Alias?: string | null
          Annotazioni?: string | null
          Concesso?: boolean | null
          created_at?: string | null
          Fila?: number | null
          FilaDaAlto?: number | null
          id?: number
          IdBlocco?: number | null
          Numero?: number | null
          NumeroPosti?: number | null
          NumeroPostiResti?: number | null
          Superficie?: number | null
          TipoTomba?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loculo_blocco_fk"
            columns: ["IdBlocco"]
            isOneToOne: false
            referencedRelation: "Blocco"
            referencedColumns: ["Id"]
          },
        ]
      }
      materials: {
        Row: {
          category: string
          cemetery_id: number | null
          cost_per_unit: number
          created_at: string | null
          id: string
          item_code: string
          item_name: string
          location: string | null
          quantity_on_hand: number
          reorder_point: number
          updated_at: string | null
        }
        Insert: {
          category: string
          cemetery_id?: number | null
          cost_per_unit: number
          created_at?: string | null
          id?: string
          item_code: string
          item_name: string
          location?: string | null
          quantity_on_hand?: number
          reorder_point?: number
          updated_at?: string | null
        }
        Update: {
          category?: string
          cemetery_id?: number | null
          cost_per_unit?: number
          created_at?: string | null
          id?: string
          item_code?: string
          item_name?: string
          location?: string | null
          quantity_on_hand?: number
          reorder_point?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_materials_cimitero"
            columns: ["cemetery_id"]
            isOneToOne: false
            referencedRelation: "Cimitero"
            referencedColumns: ["Id"]
          },
        ]
      }
      plots: {
        Row: {
          block_id: number | null
          capacity: number
          created_at: string | null
          current_occupancy: number | null
          dimensions: Json
          expiration_date: string | null
          geo_location: Json | null
          id: string
          plot_number: string
          plot_type: Database["public"]["Enums"]["plot_type"]
          price: number | null
          purchase_date: string | null
          row_number: string | null
          status: Database["public"]["Enums"]["plot_status"]
          updated_at: string | null
        }
        Insert: {
          block_id?: number | null
          capacity?: number
          created_at?: string | null
          current_occupancy?: number | null
          dimensions: Json
          expiration_date?: string | null
          geo_location?: Json | null
          id?: string
          plot_number: string
          plot_type: Database["public"]["Enums"]["plot_type"]
          price?: number | null
          purchase_date?: string | null
          row_number?: string | null
          status?: Database["public"]["Enums"]["plot_status"]
          updated_at?: string | null
        }
        Update: {
          block_id?: number | null
          capacity?: number
          created_at?: string | null
          current_occupancy?: number | null
          dimensions?: Json
          expiration_date?: string | null
          geo_location?: Json | null
          id?: string
          plot_number?: string
          plot_type?: Database["public"]["Enums"]["plot_type"]
          price?: number | null
          purchase_date?: string | null
          row_number?: string | null
          status?: Database["public"]["Enums"]["plot_status"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_plots_blocco"
            columns: ["block_id"]
            isOneToOne: false
            referencedRelation: "Blocco"
            referencedColumns: ["Id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          status: Database["public"]["Enums"]["user_status"] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          status?: Database["public"]["Enums"]["user_status"] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          status?: Database["public"]["Enums"]["user_status"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      prova: {
        Row: {
          created_at: string | null
          id: string
          testo: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          testo: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          testo?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      provaelenco: {
        Row: {
          created_at: string | null
          id: string
          uijjj: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          uijjj: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          uijjj?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      roles: {
        Row: {
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      Settore: {
        Row: {
          area_sqm: number | null
          Codice: string | null
          current_occupancy: number | null
          geo_boundary: Json | null
          Id: number
          IdCimitero: number | null
          max_capacity: number | null
          Nome: string | null
          section_code: string | null
          section_type: string | null
        }
        Insert: {
          area_sqm?: number | null
          Codice?: string | null
          current_occupancy?: number | null
          geo_boundary?: Json | null
          Id: number
          IdCimitero?: number | null
          max_capacity?: number | null
          Nome?: string | null
          section_code?: string | null
          section_type?: string | null
        }
        Update: {
          area_sqm?: number | null
          Codice?: string | null
          current_occupancy?: number | null
          geo_boundary?: Json | null
          Id?: number
          IdCimitero?: number | null
          max_capacity?: number | null
          Nome?: string | null
          section_code?: string | null
          section_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Settore_IdCimitero_fkey"
            columns: ["IdCimitero"]
            isOneToOne: false
            referencedRelation: "Cimitero"
            referencedColumns: ["Id"]
          },
        ]
      }
      table_permissions: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          table_name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["user_role"]
          table_name: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          table_name?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "table_permissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      TipoLoculo: {
        Row: {
          Codice: number | null
          Descrizione: string | null
          Id: number
        }
        Insert: {
          Codice?: number | null
          Descrizione?: string | null
          Id: number
        }
        Update: {
          Codice?: number | null
          Descrizione?: string | null
          Id?: number
        }
        Relationships: []
      }
      TipoNumerazione: {
        Row: {
          Codice: string | null
          Descrizione: string | null
          Id: number
        }
        Insert: {
          Codice?: string | null
          Descrizione?: string | null
          Id: number
        }
        Update: {
          Codice?: string | null
          Descrizione?: string | null
          Id?: number
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          created_at: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          permissions: Json | null
          role: Database["public"]["Enums"]["user_role"]
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          permissions?: Json | null
          role?: Database["public"]["Enums"]["user_role"]
          status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          permissions?: Json | null
          role?: Database["public"]["Enums"]["user_role"]
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      users_roles: {
        Row: {
          created_at: string | null
          id: string
          role_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      work_crews: {
        Row: {
          cemetery_id: number | null
          created_at: string | null
          crew_type: Database["public"]["Enums"]["crew_type"]
          equipment_access: Json | null
          id: string
          leader_name: string
          members: Json
          name: string
          updated_at: string | null
        }
        Insert: {
          cemetery_id?: number | null
          created_at?: string | null
          crew_type: Database["public"]["Enums"]["crew_type"]
          equipment_access?: Json | null
          id?: string
          leader_name: string
          members: Json
          name: string
          updated_at?: string | null
        }
        Update: {
          cemetery_id?: number | null
          created_at?: string | null
          crew_type?: Database["public"]["Enums"]["crew_type"]
          equipment_access?: Json | null
          id?: string
          leader_name?: string
          members?: Json
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_work_crews_cimitero"
            columns: ["cemetery_id"]
            isOneToOne: false
            referencedRelation: "Cimitero"
            referencedColumns: ["Id"]
          },
        ]
      }
      work_orders: {
        Row: {
          assigned_crew_id: string | null
          cemetery_id: number | null
          created_at: string | null
          description: string
          id: string
          materials_required: Json | null
          order_number: string
          order_type: Database["public"]["Enums"]["work_order_type"]
          priority: Database["public"]["Enums"]["work_order_priority"]
          related_entity_id: string
          related_entity_type: string
          requested_date: string
          scheduled_date: string | null
          status: Database["public"]["Enums"]["work_order_status"]
          updated_at: string | null
        }
        Insert: {
          assigned_crew_id?: string | null
          cemetery_id?: number | null
          created_at?: string | null
          description: string
          id?: string
          materials_required?: Json | null
          order_number: string
          order_type: Database["public"]["Enums"]["work_order_type"]
          priority?: Database["public"]["Enums"]["work_order_priority"]
          related_entity_id: string
          related_entity_type: string
          requested_date: string
          scheduled_date?: string | null
          status?: Database["public"]["Enums"]["work_order_status"]
          updated_at?: string | null
        }
        Update: {
          assigned_crew_id?: string | null
          cemetery_id?: number | null
          created_at?: string | null
          description?: string
          id?: string
          materials_required?: Json | null
          order_number?: string
          order_type?: Database["public"]["Enums"]["work_order_type"]
          priority?: Database["public"]["Enums"]["work_order_priority"]
          related_entity_id?: string
          related_entity_type?: string
          requested_date?: string
          scheduled_date?: string | null
          status?: Database["public"]["Enums"]["work_order_status"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_work_orders_cimitero"
            columns: ["cemetery_id"]
            isOneToOne: false
            referencedRelation: "Cimitero"
            referencedColumns: ["Id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      execute_sql: {
        Args: {
          sql: string
        }
        Returns: undefined
      }
      get_complete_schema: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      migrate_loculi_data: {
        Args: Record<PropertyKey, never>
        Returns: string[]
      }
    }
    Enums: {
      crew_type:
        | "maintenance"
        | "burial"
        | "landscaping"
        | "cleaning"
        | "construction"
        | "other"
      plot_status: "available" | "reserved" | "occupied" | "maintenance"
      plot_type: "standard" | "family" | "cremation" | "mausoleum" | "niche"
      user_role: "admin" | "read_write" | "read_only" | "viewer"
      user_status: "pending" | "active" | "banned"
      work_order_priority: "low" | "medium" | "high" | "urgent"
      work_order_status: "pending" | "in_progress" | "completed" | "cancelled"
      work_order_type:
        | "burial"
        | "maintenance"
        | "landscaping"
        | "construction"
        | "cleaning"
        | "other"
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
