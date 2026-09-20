import { stateChange } from "$lib/hooks/state-change"
import WebRTCState from "$lib/runes/webrtc.svelte"
import type { LiveSchema } from "$lib/schemas/live"
import supabase from "$lib/supabase"
import ky from "ky"

const API_BASE_URL = "http://localhost:8000"
const EMBEDDING_DIM = 512

export default class RecognitionService {
  webrtc: WebRTCState

  #local = $state<RTCRtpSender>()
  #session = $state<string>()

  constructor() {
    this.webrtc = new WebRTCState({
      iceServers: [{ urls: ["stun:stun.l.google.com:19302"] }]
    }, { onIceCandidate: this.#sendIceCandidate, onNegotiationNeeded: this.#negotiate })
  }

  get session() {
    return this.#session
  }

  get connected() {
    return this.#session !== undefined && this.webrtc.connectionState === "connected"
  }

  get local() {
    return this.#local ? new MediaStream([this.#local.track!]) : undefined
  }

  get remote() {
    const track = this.webrtc.videoTracks.at(0)
    return track ? new MediaStream([track]) : undefined
  }

  start = async (config: LiveSchema) => {
    this.#local = await this.#setupRTC(config.device)
    this.#session = await this.#requestSession(await this.#fetchEmbeddings())
    return this
  }

  stop = () => {
    this.webrtc.restart()
    this.#local = undefined
    this.#session = undefined
  }

  async #setupRTC(device: MediaStream) {
    this.webrtc.instance?.addTransceiver("video", { direction: "sendrecv" })
    return this.webrtc.instance?.addTrack(device.getVideoTracks()[0])
  }

  #negotiate = async () => {
    const session = await stateChange(() => this.#session, session => session !== undefined)
    const offer = await this.webrtc.offer()
    const sdp = await ky.post(`${API_BASE_URL}/webrtc/${session}/sdp`, { json: offer }).json<RTCSessionDescription | undefined>()
    if (sdp) this.webrtc.answer(sdp);
  }

  async #requestSession(embeddings: FaceEmbedding[]) {
    const body = await this.#buildMetadata(embeddings)
    return ky.post(`${API_BASE_URL}/webrtc`, { body }).json<string>()
  }

  async #fetchEmbeddings(tags?: string[]): Promise<FaceEmbedding[]> {
    const { data, error } = await supabase.rpc("get_faces_by_tags", { p_tags: tags })
    if (error) throw error;
    return data.map((row) => ({
      identity: row.person_id,
      embedding: parseEmbedding(row.embedding),
    }))
  }

  #sendIceCandidate = async (candidate: RTCIceCandidate) => {
    const session = await stateChange(() => this.#session, session => session !== undefined)
    await ky.post(`${API_BASE_URL}/webrtc/${session}/ice`, { json: candidate.toJSON() })
  }

  async #buildMetadata(embeddings: FaceEmbedding[]) {
    for (const { identity, embedding } of embeddings) {
      if (embedding.length !== EMBEDDING_DIM) {
        throw new Error(`Embedding for "${identity}" has ${embedding.length} dims, expected ${EMBEDDING_DIM}`)
      }
    }

    const identities = embeddings.map(f => f.identity)
    const vectors = new Float32Array(embeddings.length * EMBEDDING_DIM)
    embeddings.forEach(({ embedding }, i) => vectors.set(embedding, i * EMBEDDING_DIM))

    const form = new FormData()
    form.append("identities", JSON.stringify(identities))
    form.append("embeddings", new Blob([vectors.buffer], { type: "application/octet-stream" }))
    return form
  }
}

type FaceEmbedding = {
  identity: string
  embedding: Float32Array
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
