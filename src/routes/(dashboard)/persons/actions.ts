import { getSession } from "$lib/supabase/auth";
import { insertFace } from "$lib/supabase/faces";
import { uploadFile } from "$lib/supabase/storage";

export async function getEmbedding(file: File) {
  const session = await getSession()
  if (!session) throw Error("not logged in");
  const bytes = await fetch("http://localhost:8000/embeddings/extract", {
    method: "POST",
    headers: { "content-type": file.type, "authorization": "Bearer " + session.access_token },
    body: file,
  }).then((r) => r.bytes());
  return new Float32Array(bytes.buffer)
}

export async function uploadFace(personId: string, image: File) {
  const embedding = await getEmbedding(image)
  const uploaded = await uploadFile(image)
  const face = await insertFace(personId, embedding, uploaded.id)
  return face
}
