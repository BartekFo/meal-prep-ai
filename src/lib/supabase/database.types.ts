export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      chat: {
        Row: {
          createdAt: string;
          id: string;
          title: string;
          userId: string;
        };
        Insert: {
          createdAt?: string;
          id?: string;
          title: string;
          userId: string;
        };
        Update: {
          createdAt?: string;
          id?: string;
          title?: string;
          userId?: string;
        };
        Relationships: [];
      };
      dietary_options: {
        Row: {
          description: string;
          icon: string;
          id: string;
          title: string;
        };
        Insert: {
          description: string;
          icon: string;
          id?: string;
          title: string;
        };
        Update: {
          description?: string;
          icon?: string;
          id?: string;
          title?: string;
        };
        Relationships: [];
      };
      favorites: {
        Row: {
          created_at: string;
          id: number;
          recipe_id: number;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          recipe_id: number;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          recipe_id?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "favorites_recipe_id_fkey";
            columns: ["recipe_id"];
            isOneToOne: false;
            referencedRelation: "recipes";
            referencedColumns: ["id"];
          },
        ];
      };
      message: {
        Row: {
          chatId: string;
          createdAt: string;
          id: string;
          parts: Json;
          role: string;
        };
        Insert: {
          chatId: string;
          createdAt?: string;
          id?: string;
          parts: Json;
          role: string;
        };
        Update: {
          chatId?: string;
          createdAt?: string;
          id?: string;
          parts?: Json;
          role?: string;
        };
        Relationships: [
          {
            foreignKeyName: "Message_chatId_fkey";
            columns: ["chatId"];
            isOneToOne: false;
            referencedRelation: "chat";
            referencedColumns: ["id"];
          },
        ];
      };
      preferences: {
        Row: {
          created_at: string;
          id: number;
          key: string;
          updated_at: string;
          user_id: string;
          value: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          key: string;
          updated_at?: string;
          user_id: string;
          value: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          key?: string;
          updated_at?: string;
          user_id?: string;
          value?: string;
        };
        Relationships: [];
      };
      recipes: {
        Row: {
          calories: number;
          carbs: number;
          cook_time: number;
          created_at: string;
          description: string | null;
          fat: number;
          id: number;
          image_url: string | null;
          ingredients: Json;
          instructions: Json;
          meal_type: Database["public"]["Enums"]["meal_type"];
          prep_time: number;
          protein: number;
          servings: number;
          title: string;
          user_id: string;
        };
        Insert: {
          calories: number;
          carbs: number;
          cook_time: number;
          created_at?: string;
          description?: string | null;
          fat: number;
          id?: number;
          image_url?: string | null;
          ingredients: Json;
          instructions: Json;
          meal_type: Database["public"]["Enums"]["meal_type"];
          prep_time: number;
          protein: number;
          servings: number;
          title: string;
          user_id: string;
        };
        Update: {
          calories?: number;
          carbs?: number;
          cook_time?: number;
          created_at?: string;
          description?: string | null;
          fat?: number;
          id?: number;
          image_url?: string | null;
          ingredients?: Json;
          instructions?: Json;
          meal_type?: Database["public"]["Enums"]["meal_type"];
          prep_time?: number;
          protein?: number;
          servings?: number;
          title?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      stream: {
        Row: {
          chatId: string;
          createdAt: string;
          id: string;
        };
        Insert: {
          chatId: string;
          createdAt?: string;
          id?: string;
        };
        Update: {
          chatId?: string;
          createdAt?: string;
          id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "Stream_chatId_fkey";
            columns: ["chatId"];
            isOneToOne: false;
            referencedRelation: "chat";
            referencedColumns: ["id"];
          },
        ];
      };
      vote: {
        Row: {
          chatId: string;
          isUpvoted: boolean;
          messageId: string;
        };
        Insert: {
          chatId: string;
          isUpvoted: boolean;
          messageId: string;
        };
        Update: {
          chatId?: string;
          isUpvoted?: boolean;
          messageId?: string;
        };
        Relationships: [
          {
            foreignKeyName: "Vote_chatId_fkey";
            columns: ["chatId"];
            isOneToOne: false;
            referencedRelation: "chat";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "Vote_messageId_fkey";
            columns: ["messageId"];
            isOneToOne: false;
            referencedRelation: "message";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      meal_type: "breakfast" | "lunch" | "dinner" | "snack";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      meal_type: ["breakfast", "lunch", "dinner", "snack"],
    },
  },
} as const;
