import supabase from ".";

export async function fetchTags(searchName?: string) {
  const { data, error } = await supabase.from("tags").select().ilike("name", `%${searchName ?? ''}%`)
  if (error) throw error;
  return data
}

export async function insertTag(name: string) {
  const tag = await supabase.from("tags").insert({ name }).select().single()
  if (tag.error) throw tag.error;
  return tag.data
}
