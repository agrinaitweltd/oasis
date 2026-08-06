// Auto-generated from the live Supabase schema via the Supabase MCP
// (generate_typescript_types). Regenerate after every migration rather
// than hand-editing this file.

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.15";
  };
  public: {
    Tables: {
      profiles: {
        Row: {
          created_at: string;
          email: string | null;
          full_name: string | null;
          id: string;
          phone: string | null;
          role: Database["public"]["Enums"]["user_role"];
          school_id: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          email?: string | null;
          full_name?: string | null;
          id: string;
          phone?: string | null;
          role?: Database["public"]["Enums"]["user_role"];
          school_id?: string | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          email?: string | null;
          full_name?: string | null;
          id?: string;
          phone?: string | null;
          role?: Database["public"]["Enums"]["user_role"];
          school_id?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_school_id_fkey";
            columns: ["school_id"];
            isOneToOne: false;
            referencedRelation: "schools";
            referencedColumns: ["id"];
          },
        ];
      };
      schools: {
        Row: {
          address: string | null;
          code: string | null;
          contact_email: string | null;
          contact_name: string | null;
          contact_phone: string | null;
          created_at: string;
          district: string | null;
          id: string;
          name: string;
          plan: string | null;
          school_type: string | null;
          status: Database["public"]["Enums"]["school_status"];
          student_band: string | null;
          subscription_status: string | null;
          updated_at: string;
        };
        Insert: {
          address?: string | null;
          code?: string | null;
          contact_email?: string | null;
          contact_name?: string | null;
          contact_phone?: string | null;
          created_at?: string;
          district?: string | null;
          id?: string;
          name: string;
          plan?: string | null;
          school_type?: string | null;
          status?: Database["public"]["Enums"]["school_status"];
          student_band?: string | null;
          subscription_status?: string | null;
          updated_at?: string;
        };
        Update: {
          address?: string | null;
          code?: string | null;
          contact_email?: string | null;
          contact_name?: string | null;
          contact_phone?: string | null;
          created_at?: string;
          district?: string | null;
          id?: string;
          name?: string;
          plan?: string | null;
          school_type?: string | null;
          status?: Database["public"]["Enums"]["school_status"];
          student_band?: string | null;
          subscription_status?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: {
      school_status: "pending_review" | "approved" | "rejected" | "more_info_requested" | "suspended";
      user_role: "super_admin" | "school_admin" | "teacher" | "parent" | "student" | "bursar" | "librarian";
    };
    CompositeTypes: { [_ in never]: never };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;
type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<T extends keyof (DefaultSchema["Tables"])> = DefaultSchema["Tables"][T]["Row"];
export type TablesInsert<T extends keyof DefaultSchema["Tables"]> = DefaultSchema["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof DefaultSchema["Tables"]> = DefaultSchema["Tables"][T]["Update"];
export type Enums<T extends keyof DefaultSchema["Enums"]> = DefaultSchema["Enums"][T];

export const Constants = {
  public: {
    Enums: {
      school_status: ["pending_review", "approved", "rejected", "more_info_requested", "suspended"],
      user_role: ["super_admin", "school_admin", "teacher", "parent", "student", "bursar", "librarian"],
    },
  },
} as const;
