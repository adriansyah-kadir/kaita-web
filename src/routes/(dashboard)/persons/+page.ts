import { personsPaginated } from "$lib/supabase/persons";

export async function load() {
  return {
    persons: await personsPaginated({})
  }
}
