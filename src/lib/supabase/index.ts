import { SUPABASE_PUBLISHABLE, SUPABASE_URL } from "$app/env/public"
import {SupabaseClient} from "@supabase/supabase-js"

export default new SupabaseClient(SUPABASE_URL, SUPABASE_PUBLISHABLE)
