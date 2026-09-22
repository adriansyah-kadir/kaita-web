import { stateChange } from "$lib/hooks/state-change"
import WebRTCState from "$lib/runes/webrtc.svelte"
import type { LiveSchema } from "$lib/schemas/live"
import { fetchEmbeddings, type FaceEmbedding } from "$lib/supabase/faces"
import ky from "ky"

const API_BASE_URL = "http://localhost:8000"
const EMBEDDING_DIM = 512

export default class RecognitionService {
  webrtc: WebRTCState

  #local = $state<RTCRtpSender>()

  #session = $state<string>()

  #recognized = $state<Record<string, RecognizeEvent>>({})

  #sse = $state<EventSource>()

  constructor() {
    this.webrtc = new WebRTCState({
      iceServers: [{ urls: ["stun:stun.l.google.com:19302"] }]
    }, {
      onIceCandidate: this.#sendIceCandidate,
      onNegotiationNeeded: this.#negotiate
    })
  }

  get waitSession() {
    return stateChange(() => this.#session, session => session !== undefined)
  }

  get session() {
    return this.#session
  }

  get connected() {
    return this.#session !== undefined && this.webrtc.connectionState === "connected"
  }

  get recognized() {
    return this.#recognized
  }

  get local() {
    return this.#local ? new MediaStream([this.#local.track!]) : undefined
  }

  get remote() {
    const track = this.webrtc.videoTracks.at(0)
    return track ? new MediaStream([track]) : undefined
  }

  start = async (config: LiveSchema) => {
    const tags = config.tags?.map(e => e.id)
    const embeddings = await fetchEmbeddings(tags)
    this.#local = await this.#setupCam(config.device)
    this.#session = await this.#requestSession(embeddings)
    this.#sse = await this.#listenEvent()
    return this
  }

  stop = () => {
    this.webrtc.restart()
    this.#local = undefined
    this.#session = undefined
    this.#sse?.close()
    this.#sse = undefined
  }

  async #listenEvent() {
    const session = await this.waitSession
    const sse = new EventSource(`${API_BASE_URL}/${session}/events`)
    sse.addEventListener("recognized", ev => {
      console.log(ev.data)
    })
    return sse
  }

  async #setupCam(device: MediaStream) {
    const pc = await this.webrtc.waitInstance
    pc.addTransceiver("video", { direction: "sendrecv" })
    const local = pc.addTrack(device.getVideoTracks()[0])
    const params = local.getParameters()
    params.degradationPreference = "maintain-resolution"
    params.encodings[0].scaleResolutionDownBy = 1
    await local.setParameters(params)
    return local
  }

  #negotiate = async () => {
    const session = await this.waitSession
    const offer = await this.webrtc.offer()
    const sdp = await ky.post(`${API_BASE_URL}/webrtc/${session}/sdp`, { json: offer }).json<RTCSessionDescription | undefined>()
    if (sdp) this.webrtc.answer(sdp);
  }

  async #requestSession(embeddings: FaceEmbedding[]) {
    const body = await this.#buildMetadata(embeddings)
    return ky.post(`${API_BASE_URL}/webrtc`, { body }).json<string>()
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

type RecognizeEvent = {
  identity: string,
  cropped: Blob,
  confidence: number
}
