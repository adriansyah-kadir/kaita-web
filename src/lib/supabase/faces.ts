import supabase from ".";

export const selectFaces = supabase.from("faces").select()

export async function selectPersonFaces(personId: string) {
  const { count, data, error } = await supabase.from("faces").select(undefined, { count: "exact" }).eq("person_id", personId)
  if (error) throw error;
  return { count, data }
}

export async function insertFace(personId: string, embedding: Float32Array, imageId: string) {
  const query = supabase.from("faces").insert({
    embedding: JSON.stringify(Array.from(embedding)),
    image_id: imageId,
    person_id: personId
  }).select().single()
  const result = await query
  if (result.error) throw result.error;
  return result.data
}
