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
      account_join_requests: {
        Row: {
          created_at: string;
          email: string;
          full_name: string;
          id: string;
          requested_role: string;
          school_name: string;
          status: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          full_name: string;
          id?: string;
          requested_role: string;
          school_name: string;
          status?: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          full_name?: string;
          id?: string;
          requested_role?: string;
          school_name?: string;
          status?: string;
        };
        Relationships: [];
      };
      admission_applications: {
        Row: {
          applicant_name: string;
          applying_for_class: string | null;
          created_at: string;
          date_of_birth: string | null;
          guardian_email: string | null;
          guardian_name: string | null;
          guardian_phone: string | null;
          id: string;
          school_id: string;
          status: string;
        };
        Insert: {
          applicant_name: string;
          applying_for_class?: string | null;
          created_at?: string;
          date_of_birth?: string | null;
          guardian_email?: string | null;
          guardian_name?: string | null;
          guardian_phone?: string | null;
          id?: string;
          school_id: string;
          status?: string;
        };
        Update: {
          applicant_name?: string;
          applying_for_class?: string | null;
          created_at?: string;
          date_of_birth?: string | null;
          guardian_email?: string | null;
          guardian_name?: string | null;
          guardian_phone?: string | null;
          id?: string;
          school_id?: string;
          status?: string;
        };
        Relationships: [
          {
            foreignKeyName: "admission_applications_school_id_fkey";
            columns: ["school_id"];
            isOneToOne: false;
            referencedRelation: "schools";
            referencedColumns: ["id"];
          },
        ];
      };
      agent_visit_requests: {
        Row: {
          contact_name: string;
          created_at: string;
          district: string;
          id: string;
          phone: string;
          preferred_time: string | null;
          school_name: string;
          status: string;
        };
        Insert: {
          contact_name: string;
          created_at?: string;
          district: string;
          id?: string;
          phone: string;
          preferred_time?: string | null;
          school_name: string;
          status?: string;
        };
        Update: {
          contact_name?: string;
          created_at?: string;
          district?: string;
          id?: string;
          phone?: string;
          preferred_time?: string | null;
          school_name?: string;
          status?: string;
        };
        Relationships: [];
      };
      assessments: {
        Row: {
          comments: string | null;
          created_at: string;
          created_by: string | null;
          id: string;
          max_score: number;
          school_id: string;
          score: number | null;
          student_id: string;
          subject: string;
          term: string | null;
        };
        Insert: {
          comments?: string | null;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          max_score?: number;
          school_id: string;
          score?: number | null;
          student_id: string;
          subject: string;
          term?: string | null;
        };
        Update: {
          comments?: string | null;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          max_score?: number;
          school_id?: string;
          score?: number | null;
          student_id?: string;
          subject?: string;
          term?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "assessments_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "assessments_school_id_fkey";
            columns: ["school_id"];
            isOneToOne: false;
            referencedRelation: "schools";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "assessments_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "students";
            referencedColumns: ["id"];
          },
        ];
      };
      attendance_records: {
        Row: {
          created_at: string;
          date: string;
          id: string;
          marked_by: string | null;
          notes: string | null;
          school_id: string;
          status: string;
          student_id: string;
        };
        Insert: {
          created_at?: string;
          date?: string;
          id?: string;
          marked_by?: string | null;
          notes?: string | null;
          school_id: string;
          status: string;
          student_id: string;
        };
        Update: {
          created_at?: string;
          date?: string;
          id?: string;
          marked_by?: string | null;
          notes?: string | null;
          school_id?: string;
          status?: string;
          student_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "attendance_records_marked_by_fkey";
            columns: ["marked_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "attendance_records_school_id_fkey";
            columns: ["school_id"];
            isOneToOne: false;
            referencedRelation: "schools";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "attendance_records_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "students";
            referencedColumns: ["id"];
          },
        ];
      };
      behaviour_incidents: {
        Row: {
          created_at: string;
          description: string;
          id: string;
          logged_by: string | null;
          points: number;
          school_id: string;
          student_id: string;
          type: string;
        };
        Insert: {
          created_at?: string;
          description: string;
          id?: string;
          logged_by?: string | null;
          points?: number;
          school_id: string;
          student_id: string;
          type: string;
        };
        Update: {
          created_at?: string;
          description?: string;
          id?: string;
          logged_by?: string | null;
          points?: number;
          school_id?: string;
          student_id?: string;
          type?: string;
        };
        Relationships: [
          {
            foreignKeyName: "behaviour_incidents_logged_by_fkey";
            columns: ["logged_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "behaviour_incidents_school_id_fkey";
            columns: ["school_id"];
            isOneToOne: false;
            referencedRelation: "schools";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "behaviour_incidents_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "students";
            referencedColumns: ["id"];
          },
        ];
      };
      calendar_events: {
        Row: {
          created_at: string;
          description: string | null;
          event_date: string;
          event_type: string | null;
          id: string;
          school_id: string;
          title: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          event_date: string;
          event_type?: string | null;
          id?: string;
          school_id: string;
          title: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          event_date?: string;
          event_type?: string | null;
          id?: string;
          school_id?: string;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "calendar_events_school_id_fkey";
            columns: ["school_id"];
            isOneToOne: false;
            referencedRelation: "schools";
            referencedColumns: ["id"];
          },
        ];
      };
      club_members: {
        Row: {
          club_id: string;
          id: string;
          joined_at: string;
          school_id: string;
          student_id: string;
        };
        Insert: {
          club_id: string;
          id?: string;
          joined_at?: string;
          school_id: string;
          student_id: string;
        };
        Update: {
          club_id?: string;
          id?: string;
          joined_at?: string;
          school_id?: string;
          student_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "club_members_club_id_fkey";
            columns: ["club_id"];
            isOneToOne: false;
            referencedRelation: "clubs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "club_members_school_id_fkey";
            columns: ["school_id"];
            isOneToOne: false;
            referencedRelation: "schools";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "club_members_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "students";
            referencedColumns: ["id"];
          },
        ];
      };
      clubs: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          name: string;
          schedule: string | null;
          school_id: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          name: string;
          schedule?: string | null;
          school_id: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          name?: string;
          schedule?: string | null;
          school_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "clubs_school_id_fkey";
            columns: ["school_id"];
            isOneToOne: false;
            referencedRelation: "schools";
            referencedColumns: ["id"];
          },
        ];
      };
      exam_entries: {
        Row: {
          created_at: string;
          exam_date: string | null;
          exam_name: string;
          id: string;
          result: string | null;
          school_id: string;
          seat_number: string | null;
          student_id: string;
          subject: string;
        };
        Insert: {
          created_at?: string;
          exam_date?: string | null;
          exam_name: string;
          id?: string;
          result?: string | null;
          school_id: string;
          seat_number?: string | null;
          student_id: string;
          subject: string;
        };
        Update: {
          created_at?: string;
          exam_date?: string | null;
          exam_name?: string;
          id?: string;
          result?: string | null;
          school_id?: string;
          seat_number?: string | null;
          student_id?: string;
          subject?: string;
        };
        Relationships: [
          {
            foreignKeyName: "exam_entries_school_id_fkey";
            columns: ["school_id"];
            isOneToOne: false;
            referencedRelation: "schools";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "exam_entries_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "students";
            referencedColumns: ["id"];
          },
        ];
      };
      fee_invoices: {
        Row: {
          amount: number;
          created_at: string;
          description: string;
          due_date: string | null;
          id: string;
          school_id: string;
          status: string;
          student_id: string;
        };
        Insert: {
          amount: number;
          created_at?: string;
          description: string;
          due_date?: string | null;
          id?: string;
          school_id: string;
          status?: string;
          student_id: string;
        };
        Update: {
          amount?: number;
          created_at?: string;
          description?: string;
          due_date?: string | null;
          id?: string;
          school_id?: string;
          status?: string;
          student_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "fee_invoices_school_id_fkey";
            columns: ["school_id"];
            isOneToOne: false;
            referencedRelation: "schools";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "fee_invoices_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "students";
            referencedColumns: ["id"];
          },
        ];
      };
      homework: {
        Row: {
          class_name: string;
          created_at: string;
          created_by: string | null;
          description: string | null;
          due_date: string | null;
          id: string;
          school_id: string;
          subject: string;
          title: string;
        };
        Insert: {
          class_name: string;
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          due_date?: string | null;
          id?: string;
          school_id: string;
          subject: string;
          title: string;
        };
        Update: {
          class_name?: string;
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          due_date?: string | null;
          id?: string;
          school_id?: string;
          subject?: string;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "homework_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "homework_school_id_fkey";
            columns: ["school_id"];
            isOneToOne: false;
            referencedRelation: "schools";
            referencedColumns: ["id"];
          },
        ];
      };
      medical_records: {
        Row: {
          allergy: string | null;
          condition: string | null;
          created_at: string;
          id: string;
          medication: string | null;
          notes: string | null;
          school_id: string;
          student_id: string;
        };
        Insert: {
          allergy?: string | null;
          condition?: string | null;
          created_at?: string;
          id?: string;
          medication?: string | null;
          notes?: string | null;
          school_id: string;
          student_id: string;
        };
        Update: {
          allergy?: string | null;
          condition?: string | null;
          created_at?: string;
          id?: string;
          medication?: string | null;
          notes?: string | null;
          school_id?: string;
          student_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "medical_records_school_id_fkey";
            columns: ["school_id"];
            isOneToOne: false;
            referencedRelation: "schools";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "medical_records_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "students";
            referencedColumns: ["id"];
          },
        ];
      };
      messages: {
        Row: {
          audience: string;
          body: string;
          created_at: string;
          id: string;
          school_id: string;
          sender_id: string | null;
          subject: string;
        };
        Insert: {
          audience?: string;
          body: string;
          created_at?: string;
          id?: string;
          school_id: string;
          sender_id?: string | null;
          subject: string;
        };
        Update: {
          audience?: string;
          body?: string;
          created_at?: string;
          id?: string;
          school_id?: string;
          sender_id?: string | null;
          subject?: string;
        };
        Relationships: [
          {
            foreignKeyName: "messages_school_id_fkey";
            columns: ["school_id"];
            isOneToOne: false;
            referencedRelation: "schools";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "messages_sender_id_fkey";
            columns: ["sender_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          created_at: string;
          email: string | null;
          full_name: string | null;
          id: string;
          is_form_tutor: boolean;
          is_headteacher: boolean;
          phone: string | null;
          role: Database["public"]["Enums"]["user_role"];
          school_id: string | null;
          tutor_group: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          email?: string | null;
          full_name?: string | null;
          id: string;
          is_form_tutor?: boolean;
          is_headteacher?: boolean;
          phone?: string | null;
          role?: Database["public"]["Enums"]["user_role"];
          school_id?: string | null;
          tutor_group?: string | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          email?: string | null;
          full_name?: string | null;
          id?: string;
          is_form_tutor?: boolean;
          is_headteacher?: boolean;
          phone?: string | null;
          role?: Database["public"]["Enums"]["user_role"];
          school_id?: string | null;
          tutor_group?: string | null;
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
      safeguarding_concerns: {
        Row: {
          concern: string;
          created_at: string;
          id: string;
          raised_by: string | null;
          school_id: string;
          status: string;
          student_id: string | null;
        };
        Insert: {
          concern: string;
          created_at?: string;
          id?: string;
          raised_by?: string | null;
          school_id: string;
          status?: string;
          student_id?: string | null;
        };
        Update: {
          concern?: string;
          created_at?: string;
          id?: string;
          raised_by?: string | null;
          school_id?: string;
          status?: string;
          student_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "safeguarding_concerns_raised_by_fkey";
            columns: ["raised_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "safeguarding_concerns_school_id_fkey";
            columns: ["school_id"];
            isOneToOne: false;
            referencedRelation: "schools";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "safeguarding_concerns_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "students";
            referencedColumns: ["id"];
          },
        ];
      };
      school_trips: {
        Row: {
          cost: number | null;
          created_at: string;
          destination: string | null;
          id: string;
          name: string;
          school_id: string;
          trip_date: string | null;
        };
        Insert: {
          cost?: number | null;
          created_at?: string;
          destination?: string | null;
          id?: string;
          name: string;
          school_id: string;
          trip_date?: string | null;
        };
        Update: {
          cost?: number | null;
          created_at?: string;
          destination?: string | null;
          id?: string;
          name?: string;
          school_id?: string;
          trip_date?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "school_trips_school_id_fkey";
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
      send_records: {
        Row: {
          created_at: string;
          id: string;
          need_type: string;
          review_date: string | null;
          school_id: string;
          student_id: string;
          support_plan: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          need_type: string;
          review_date?: string | null;
          school_id: string;
          student_id: string;
          support_plan?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          need_type?: string;
          review_date?: string | null;
          school_id?: string;
          student_id?: string;
          support_plan?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "send_records_school_id_fkey";
            columns: ["school_id"];
            isOneToOne: false;
            referencedRelation: "schools";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "send_records_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "students";
            referencedColumns: ["id"];
          },
        ];
      };
      staff: {
        Row: {
          created_at: string;
          department: string | null;
          full_name: string;
          id: string;
          job_title: string | null;
          profile_id: string | null;
          school_id: string;
          status: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          department?: string | null;
          full_name: string;
          id?: string;
          job_title?: string | null;
          profile_id?: string | null;
          school_id: string;
          status?: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          department?: string | null;
          full_name?: string;
          id?: string;
          job_title?: string | null;
          profile_id?: string | null;
          school_id?: string;
          status?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "staff_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "staff_school_id_fkey";
            columns: ["school_id"];
            isOneToOne: false;
            referencedRelation: "schools";
            referencedColumns: ["id"];
          },
        ];
      };
      staff_leave_requests: {
        Row: {
          created_at: string;
          end_date: string;
          id: string;
          reason: string | null;
          school_id: string;
          staff_id: string;
          start_date: string;
          status: string;
        };
        Insert: {
          created_at?: string;
          end_date: string;
          id?: string;
          reason?: string | null;
          school_id: string;
          staff_id: string;
          start_date: string;
          status?: string;
        };
        Update: {
          created_at?: string;
          end_date?: string;
          id?: string;
          reason?: string | null;
          school_id?: string;
          staff_id?: string;
          start_date?: string;
          status?: string;
        };
        Relationships: [
          {
            foreignKeyName: "staff_leave_requests_school_id_fkey";
            columns: ["school_id"];
            isOneToOne: false;
            referencedRelation: "schools";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "staff_leave_requests_staff_id_fkey";
            columns: ["staff_id"];
            isOneToOne: false;
            referencedRelation: "staff";
            referencedColumns: ["id"];
          },
        ];
      };
      students: {
        Row: {
          admission_number: string | null;
          created_at: string;
          date_of_birth: string | null;
          form_class: string | null;
          full_name: string;
          gender: string | null;
          guardian_email: string | null;
          guardian_name: string | null;
          guardian_phone: string | null;
          guardian_profile_id: string | null;
          house: string | null;
          id: string;
          school_id: string;
          status: string;
          student_profile_id: string | null;
          updated_at: string;
        };
        Insert: {
          admission_number?: string | null;
          created_at?: string;
          date_of_birth?: string | null;
          form_class?: string | null;
          full_name: string;
          gender?: string | null;
          guardian_email?: string | null;
          guardian_name?: string | null;
          guardian_phone?: string | null;
          guardian_profile_id?: string | null;
          house?: string | null;
          id?: string;
          school_id: string;
          status?: string;
          student_profile_id?: string | null;
          updated_at?: string;
        };
        Update: {
          admission_number?: string | null;
          created_at?: string;
          date_of_birth?: string | null;
          form_class?: string | null;
          full_name?: string;
          gender?: string | null;
          guardian_email?: string | null;
          guardian_name?: string | null;
          guardian_phone?: string | null;
          guardian_profile_id?: string | null;
          house?: string | null;
          id?: string;
          school_id?: string;
          status?: string;
          student_profile_id?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "students_guardian_profile_id_fkey";
            columns: ["guardian_profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "students_school_id_fkey";
            columns: ["school_id"];
            isOneToOne: false;
            referencedRelation: "schools";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "students_student_profile_id_fkey";
            columns: ["student_profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      timetable_entries: {
        Row: {
          class_name: string;
          created_at: string;
          day_of_week: number;
          end_time: string;
          id: string;
          room: string | null;
          school_id: string;
          start_time: string;
          subject: string;
          teacher_id: string | null;
        };
        Insert: {
          class_name: string;
          created_at?: string;
          day_of_week: number;
          end_time: string;
          id?: string;
          room?: string | null;
          school_id: string;
          start_time: string;
          subject: string;
          teacher_id?: string | null;
        };
        Update: {
          class_name?: string;
          created_at?: string;
          day_of_week?: number;
          end_time?: string;
          id?: string;
          room?: string | null;
          school_id?: string;
          start_time?: string;
          subject?: string;
          teacher_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "timetable_entries_school_id_fkey";
            columns: ["school_id"];
            isOneToOne: false;
            referencedRelation: "schools";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "timetable_entries_teacher_id_fkey";
            columns: ["teacher_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      trip_consents: {
        Row: {
          consent_given: boolean;
          created_at: string;
          id: string;
          school_id: string;
          student_id: string;
          trip_id: string;
        };
        Insert: {
          consent_given?: boolean;
          created_at?: string;
          id?: string;
          school_id: string;
          student_id: string;
          trip_id: string;
        };
        Update: {
          consent_given?: boolean;
          created_at?: string;
          id?: string;
          school_id?: string;
          student_id?: string;
          trip_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "trip_consents_school_id_fkey";
            columns: ["school_id"];
            isOneToOne: false;
            referencedRelation: "schools";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "trip_consents_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "students";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "trip_consents_trip_id_fkey";
            columns: ["trip_id"];
            isOneToOne: false;
            referencedRelation: "school_trips";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    // mobile_otp_* functions belong to the mobile app team's OTP system
    // (private.mobile_app_email_otps) - called only via their Edge
    // Functions (send-otp/create-account/reset-password-otp), never
    // directly from this codebase. Do not touch.
    Functions: {
      mobile_otp_consume: { Args: { p_id: string }; Returns: undefined };
      mobile_otp_get_latest_unconsumed: {
        Args: { p_email: string; p_purpose: string };
        Returns: { attempts: number; code_hash: string; created_at: string; expires_at: string; id: string }[];
      };
      mobile_otp_get_recent: {
        Args: { p_email: string; p_purpose: string };
        Returns: { created_at: string }[];
      };
      mobile_otp_increment_attempts: { Args: { p_id: string }; Returns: undefined };
      mobile_otp_insert: {
        Args: { p_code_hash: string; p_email: string; p_expires_at: string; p_purpose: string };
        Returns: undefined;
      };
      submit_school_registration: {
        Args: {
          p_address?: string;
          p_contact_email?: string;
          p_contact_name?: string;
          p_contact_phone?: string;
          p_district?: string;
          p_name: string;
          p_school_type?: string;
          p_student_band?: string;
        };
        Returns: { code: string; id: string }[];
      };
    };
    Enums: {
      school_status: "pending_review" | "approved" | "rejected" | "more_info_requested" | "suspended";
      user_role: "super_admin" | "school_admin" | "teacher" | "parent" | "student" | "bursar" | "librarian";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      school_status: ["pending_review", "approved", "rejected", "more_info_requested", "suspended"],
      user_role: ["super_admin", "school_admin", "teacher", "parent", "student", "bursar", "librarian"],
    },
  },
} as const;
