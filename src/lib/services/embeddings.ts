import { getSession } from "$lib/supabase/auth"

export type ExtractedRaw = {
  embedding: string,
  cropped: string
}

export type Extracted = {
  embedding: Float32Array,
  cropped: Blob
}

async function b64JPEGToBlob(b64: string) {
  const resp = await fetch(`data:image/jpeg;base64,${b64}`)
  return resp.blob()
}

function b64EmbeddingToArray(b64: string) {
  const binary = atob(b64)
  const bytes = new Uint8Array(binary.length)
  bytes.forEach((_, i) => bytes[i] = binary.charCodeAt(i))
  return new Float32Array(bytes.buffer)
}

async function getToken() {
  const session = await getSession()
  if (!session) throw Error("not logged in");
  return session.access_token
}

export async function extractEmbeddings(file: File): Promise<Extracted[]> {
  const results: ExtractedRaw[] = await fetch("http://localhost:8000/embeddings/extract", {
    method: "POST",
    headers: { "content-type": file.type, "authorization": "Bearer " + await getToken() },
    body: file,
  }).then((r) => r.json());
  return Promise.all(results.map(async d => ({
    embedding: b64EmbeddingToArray(d.embedding),
    cropped: await b64JPEGToBlob(d.cropped)
  })))
}
