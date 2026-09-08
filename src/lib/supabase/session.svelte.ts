import type { Session } from "@supabase/supabase-js"
import { readable } from "svelte/store"
import supabase from "."

export default readable<Session | null | undefined>(undefined, set => {
  supabase.auth.onAuthStateChange((_, session) => set(session))
})
