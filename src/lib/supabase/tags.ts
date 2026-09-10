import supabase from ".";

export async function fetchTags(searchName?: string) {
  const { data, error } = await supabase.from("tags").select().ilike("name", `%${searchName}%`)
  if (error) throw error;
  return data
}
