import { defineEnvVars } from "@sveltejs/kit/env";

export const variables = defineEnvVars({
  SUPABASE_URL: { public: true },
  SUPABASE_PUBLISHABLE: { public: true }
})
