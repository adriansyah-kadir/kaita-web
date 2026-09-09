import supabase from ".";

export async function fetchTags() {
  const {data, error} = await supabase.from("tags").select()
  if (error) throw error;
  return data
}
