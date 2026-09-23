export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      farmers: {
        Row: {
          id: string;
          name: string;
          location: string;
          farm_size: number;
          preferred_language: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          location: string;
          farm_size?: number;
          preferred_language?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          location?: string;
          farm_size?: number;
          preferred_language?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      farms: {
        Row: {
          id: string;
          farmer_id: string;
          farm_name: string;
          location: string;
          area: number;
          soil_type: string;
          soil_ph: number;
          nitrogen_level: string;
          phosphorus_level: string;
          potassium_level: string;
          soil_moisture: number;
          crop: string;
          crop_stage: string;
          irrigation_available: boolean;
          state?: string;
          district?: string;
          health_score?: number;
          risk_level?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          farmer_id: string;
          farm_name: string;
          location: string;
          area: number;
          soil_type?: string;
          soil_ph?: number;
          nitrogen_level?: string;
          phosphorus_level?: string;
          potassium_level?: string;
          soil_moisture?: number;
          crop?: string;
          crop_stage?: string;
          irrigation_available?: boolean;
          state?: string;
          district?: string;
          health_score?: number;
          risk_level?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          farmer_id?: string;
          farm_name?: string;
          location?: string;
          area?: number;
          soil_type?: string;
          soil_ph?: number;
          nitrogen_level?: string;
          phosphorus_level?: string;
          potassium_level?: string;
          soil_moisture?: number;
          crop?: string;
          crop_stage?: string;
          irrigation_available?: boolean;
          state?: string;
          district?: string;
          health_score?: number;
          risk_level?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "farms_farmer_id_fkey";
            columns: ["farmer_id"];
            isOneToOne: false;
            referencedRelation: "farmers";
            referencedColumns: ["id"];
          }
        ];
      };
      rate_limits: {
        Row: {
          key: string;
          count: number;
          reset_time: string;
          created_at: string;
        };
        Insert: {
          key: string;
          count?: number;
          reset_time: string;
          created_at?: string;
        };
        Update: {
          key?: string;
          count?: number;
          reset_time?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      weather_cache: {
        Row: {
          cache_key: string;
          latitude: number;
          longitude: number;
          data: Json;
          expires_at: string;
          created_at: string;
        };
        Insert: {
          cache_key: string;
          latitude: number;
          longitude: number;
          data: Json;
          expires_at: string;
          created_at?: string;
        };
        Update: {
          cache_key?: string;
          latitude?: number;
          longitude?: number;
          data?: Json;
          expires_at?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      pest_detections: {
        Row: {
          id: string;
          farmer_id: string;
          farm_id: string | null;
          crop: string;
          disease: string;
          confidence: number;
          severity: string;
          image_url: string | null;
          recommendations: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          farmer_id: string;
          farm_id?: string | null;
          crop: string;
          disease: string;
          confidence: number;
          severity?: string;
          image_url?: string | null;
          recommendations?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          farmer_id?: string;
          farm_id?: string | null;
          crop?: string;
          disease?: string;
          confidence?: number;
          severity?: string;
          image_url?: string | null;
          recommendations?: Json;
          created_at?: string;
        };
        Relationships: [];
      };
      alerts: {
        Row: {
          id: string;
          farmer_id: string;
          farm_id: string | null;
          level: string;
          type: string;
          title: string;
          message: string;
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          farmer_id: string;
          farm_id?: string | null;
          level: string;
          type: string;
          title: string;
          message: string;
          read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          farmer_id?: string;
          farm_id?: string | null;
          level?: string;
          type?: string;
          title?: string;
          message?: string;
          read?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      background_jobs: {
        Row: {
          id: string;
          user_id: string | null;
          type: string;
          payload: Json;
          status: string;
          attempts: number;
          max_attempts: number;
          result: Json | null;
          error_message: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          type: string;
          payload?: Json;
          status?: string;
          attempts?: number;
          max_attempts?: number;
          result?: Json | null;
          error_message?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          type?: string;
          payload?: Json;
          status?: string;
          attempts?: number;
          max_attempts?: number;
          result?: Json | null;
          error_message?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      audit_logs: {
        Row: {
          id: string;
          actor_id: string | null;
          action: string;
          resource_type: string;
          resource_id: string | null;
          details: Json | null;
          ip_address: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          actor_id?: string | null;
          action: string;
          resource_type: string;
          resource_id?: string | null;
          details?: Json | null;
          ip_address?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          actor_id?: string | null;
          action?: string;
          resource_type?: string;
          resource_id?: string | null;
          details?: Json | null;
          ip_address?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      soil_profiles: {
        Row: {
          id: string;
          farm_id: string;
          farmer_id: string;
          sample_date: string;
          lab_name: string | null;
          sample_location: string;
          soil_type: string;
          ph: number;
          ec_dsm: number | null;
          oc_percent: number | null;
          n_kg_ha: number | null;
          n_rating: string;
          p_kg_ha: number | null;
          p_rating: string;
          k_kg_ha: number | null;
          k_rating: string;
          zn_ppm: number | null;
          fe_ppm: number | null;
          cu_ppm: number | null;
          mn_ppm: number | null;
          b_ppm: number | null;
          s_ppm: number | null;
          is_lab_verified: boolean;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          farm_id: string;
          farmer_id: string;
          sample_date?: string;
          lab_name?: string | null;
          sample_location: string;
          soil_type: string;
          ph: number;
          ec_dsm?: number | null;
          oc_percent?: number | null;
          n_kg_ha?: number | null;
          n_rating?: string;
          p_kg_ha?: number | null;
          p_rating?: string;
          k_kg_ha?: number | null;
          k_rating?: string;
          zn_ppm?: number | null;
          fe_ppm?: number | null;
          cu_ppm?: number | null;
          mn_ppm?: number | null;
          b_ppm?: number | null;
          s_ppm?: number | null;
          is_lab_verified?: boolean;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          farm_id?: string;
          farmer_id?: string;
          sample_date?: string;
          lab_name?: string | null;
          sample_location?: string;
          soil_type?: string;
          ph?: number;
          ec_dsm?: number | null;
          oc_percent?: number | null;
          n_kg_ha?: number | null;
          n_rating?: string;
          p_kg_ha?: number | null;
          p_rating?: string;
          k_kg_ha?: number | null;
          k_rating?: string;
          zn_ppm?: number | null;
          fe_ppm?: number | null;
          cu_ppm?: number | null;
          mn_ppm?: number | null;
          b_ppm?: number | null;
          s_ppm?: number | null;
          is_lab_verified?: boolean;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      market_prices: {
        Row: {
          id: string;
          commodity: string;
          variety: string | null;
          state: string;
          district: string;
          market: string;
          min_price: number | null;
          max_price: number | null;
          modal_price: number;
          msp: number | null;
          price_date: string;
          source: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          commodity: string;
          variety?: string | null;
          state: string;
          district: string;
          market: string;
          min_price?: number | null;
          max_price?: number | null;
          modal_price: number;
          msp?: number | null;
          price_date: string;
          source: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          commodity?: string;
          variety?: string | null;
          state?: string;
          district?: string;
          market?: string;
          min_price?: number | null;
          max_price?: number | null;
          modal_price?: number;
          msp?: number | null;
          price_date?: string;
          source?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      government_advisories: {
        Row: {
          id: string;
          title: string;
          agency: string;
          state: string;
          district: string;
          crops: string[];
          urgency: string;
          bulletin_summary: string;
          farming_instructions: Json | null;
          issued_at: string;
          valid_until: string;
          official_source_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          agency: string;
          state: string;
          district: string;
          crops: string[];
          urgency?: string;
          bulletin_summary: string;
          farming_instructions?: Json | null;
          issued_at: string;
          valid_until: string;
          official_source_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          agency?: string;
          state?: string;
          district?: string;
          crops?: string[];
          urgency?: string;
          bulletin_summary?: string;
          farming_instructions?: Json | null;
          issued_at?: string;
          valid_until?: string;
          official_source_url?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      increment_rate_limit: {
        Args: {
          p_key: string;
          p_window_seconds: number;
          p_max_limit: number;
        };
        Returns: {
          allowed: boolean;
          current: number;
          limit: number;
          reset_in_seconds: number;
          retry_after: number;
        };
      };
      cleanup_expired_records: {
        Args: Record<PropertyKey, never>;
        Returns: {
          purged_rate_limits: number;
          purged_weather_cache: number;
          executed_at: string;
        };
      };
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type FarmerRow = Database["public"]["Tables"]["farmers"]["Row"];
export type FarmerInsert = Database["public"]["Tables"]["farmers"]["Insert"];
export type FarmerUpdate = Database["public"]["Tables"]["farmers"]["Update"];

export type FarmRow = Database["public"]["Tables"]["farms"]["Row"];
export type FarmInsert = Database["public"]["Tables"]["farms"]["Insert"];
export type FarmUpdate = Database["public"]["Tables"]["farms"]["Update"];
