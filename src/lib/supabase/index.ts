import { SUPABASE_PUBLISHABLE, SUPABASE_URL } from "$app/env/public"
import { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "./types"

export default new SupabaseClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE)
