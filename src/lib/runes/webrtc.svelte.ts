import { objValues } from "$lib"
import { stateChange } from "$lib/hooks/state-change"
import { untrack } from "svelte"

export default class WebRTCState {
  #instance = $state<RTCPeerConnection>()
  #streams = $state<Record<string, MediaStream>>({})
  #candidates = $state<RTCIceCandidate[]>([])
  #connectionState = $state<RTCPeerConnectionState>()
  #gatheringState = $state<RTCIceGatheringState>()

  #configuration: RTCConfiguration
  #listeners?: WebRTCListeners

  constructor(configuration: RTCConfiguration, listeners?: WebRTCListeners) {
    this.#configuration = configuration
    this.#listeners = listeners

    // Create the initial connection once on mount. Wrapped in untrack
    // so this effect doesn't itself depend on (and re-run from) #instance.
    $effect(() => {
      untrack(() => this.#instance === undefined && this.restart())
    })

    // Re-binds listeners whenever #instance changes — including when
    // restart() swaps in a fresh RTCPeerConnection.
    $effect(() => {
      const instance = this.#instance
      if (!instance) return;
      return untrack(() => this.#bind(instance))
    })
  }

  get instance() { return this.#instance }
  get waitInstance() { return stateChange(() => this.#instance, pc => pc !== undefined) }
  get streams() { return this.#streams }
  get tracks() { return objValues(this.#streams).flatMap(s => s.getTracks()) }
  get videoTracks() { return objValues(this.#streams).flatMap(s => s.getVideoTracks()) }
  get audioTracks() { return objValues(this.#streams).flatMap(s => s.getAudioTracks()) }
  get candidates() { return this.#candidates }
  get connectionState() { return this.#connectionState }
  get connected() { return this.#connectionState === "connected" }
  get gatheringState() { return this.#gatheringState }
  get gatheringComplete() { return this.#gatheringState === "complete" }

  /**
   * Tears down the current connection (if any — via the binding
   * effect's cleanup) and replaces it with a fresh one. Optionally
   * takes a new config, otherwise reuses the configuration passed
   * to the constructor.
   */
  restart(configuration?: RTCConfiguration) {
    if (configuration) this.#configuration = configuration;
    this.#instance = new RTCPeerConnection(this.#configuration)
  }

  async offer(options?: RTCOfferOptions) {
    const pc = this.#requireInstance()
    const offer = await pc.createOffer(options)
    await pc.setLocalDescription(offer)
    return offer
  }

  async answer(remoteDescription: RTCSessionDescriptionInit) {
    const pc = this.#requireInstance()
    await pc.setRemoteDescription(remoteDescription)
    if (remoteDescription.type !== "offer") return undefined;

    const answer = await pc.createAnswer()
    await pc.setLocalDescription(answer)
    return answer
  }

  #requireInstance() {
    if (!this.#instance) throw new Error("WebRTCState: peer connection is not ready yet")
    return this.#instance
  }

  #bind(pc: RTCPeerConnection) {
    pc.addEventListener("track", this.#handleTrack)
    pc.addEventListener("connectionstatechange", this.#handleConnectionStateChange)
    pc.addEventListener("icecandidate", this.#handleIceCandidate)
    pc.addEventListener("icegatheringstatechange", this.#handleGatheringStateChange)
    pc.addEventListener("negotiationneeded", this.#handleNegotiationNeeded)

    this.#connectionState = pc.connectionState
    this.#gatheringState = pc.iceGatheringState

    return () => {
      pc.removeEventListener("track", this.#handleTrack)
      pc.removeEventListener("connectionstatechange", this.#handleConnectionStateChange)
      pc.removeEventListener("icecandidate", this.#handleIceCandidate)
      pc.removeEventListener("icegatheringstatechange", this.#handleGatheringStateChange)
      pc.removeEventListener("negotiationneeded", this.#handleNegotiationNeeded)

      if (pc.connectionState !== "closed") pc.close();

      this.#streams = {}
      this.#candidates = []
      this.#connectionState = undefined
      this.#gatheringState = undefined
    }
  }

  #handleNegotiationNeeded = () => {
    this.#listeners?.onNegotiationNeeded?.()
  }

  #handleGatheringStateChange = () => {
    this.#gatheringState = this.#instance?.iceGatheringState
  }

  #handleIceCandidate = (event: RTCPeerConnectionIceEvent) => {
    if (!event.candidate) return;
    this.#candidates = [...this.#candidates, event.candidate]
    this.#listeners?.onIceCandidate?.(event.candidate)
  }

  #handleConnectionStateChange = () => {
    this.#connectionState = this.#instance?.connectionState
  }

  #handleTrack = (event: RTCTrackEvent) => {
    console.log(event.track)
    for (const stream of event.streams) {
      this.#streams[stream.id] = stream
    }
  }
}

export type WebRTCListeners = {
  onIceCandidate?: (candidate: RTCIceCandidate) => any,
  onNegotiationNeeded?: () => any
}
