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
