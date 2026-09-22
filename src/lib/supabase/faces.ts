import supabase from ".";

const EMBEDDING_DIM = 512

export type FaceEmbedding = {
  identity: string
  embedding: Float32Array
}

export const selectFaces = supabase.from("faces").select()

export async function selectPersonFaces(personId: string) {
  const { count, data, error } = await supabase.from("faces").select("*", { count: "exact" }).eq("person_id", personId)
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

export async function fetchEmbeddings(tags?: string[]): Promise<FaceEmbedding[]> {
  const { data, error } = await supabase.rpc("get_faces_by_tags", { p_tags: tags })
  if (error) throw error;
  return data.map((row) => ({
    identity: row.person_id,
    embedding: parseEmbedding(row.embedding),
  }))
}

function parseEmbedding(raw: string | number[], expectedDim = EMBEDDING_DIM): Float32Array {
  const values = typeof raw === "string"
    ? JSON.parse(raw) as number[]
    : raw

  if (!Array.isArray(values) || values.length !== expectedDim) {
    throw new Error(`Invalid embedding: expected ${expectedDim} values, got ${Array.isArray(values) ? values.length : typeof values}`)
  }

  return Float32Array.from(values)
}
