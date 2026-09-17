import { SUPABASE_PUBLISHABLE, SUPABASE_URL } from "$app/env/public"
import { SupabaseClient } from "@supabase/supabase-js"
import type { Database, Tables } from "./types"

export default new SupabaseClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE)

export type Person = Tables<"persons_view">
export type Face = Tables<"faces">
export type Tag = Tables<"tags">
