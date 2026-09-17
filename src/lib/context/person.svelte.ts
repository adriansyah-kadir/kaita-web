import FetchState from "$lib/runes/fetch.svelte";
import type { Person } from "$lib/supabase";
import { selectPersonFaces } from "$lib/supabase/faces";
import { createContext } from "svelte";

export function initPersonContext(person: Person) {
  const faces = new FetchState(selectPersonFaces.bind(null, person.id!))

  $effect(() => {
    faces.fetch()
  })

  return {
    person,
    faces
  }
}

export type PersonContext = ReturnType<typeof initPersonContext>

export const [getPersonContext, setPersonContext, hasPersonContext] = createContext<PersonContext>()
