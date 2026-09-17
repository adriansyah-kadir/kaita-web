export function objValues<T extends object>(obj: T): T[keyof T][] {
  return Object.values(obj)
}

export function objKeys<T extends Record<string, any>>(obj: T): (keyof T)[] {
  return Object.keys(obj) as unknown as (keyof T)[]
}

export function objEntries<T extends Record<string, any>>(
  obj: T
): { [K in keyof T]: [K, T[K]] }[keyof T][] {
  return Object.entries(obj) as { [K in keyof T]: [K, T[K]] }[keyof T][]
}

export function objFrom<K extends PropertyKey, V>(
  entries: Iterable<readonly [K, V]>
): Record<K, V> {
  return Object.fromEntries(entries) as Record<K, V>
}

export function pickFiles(accept = ""): Promise<File[]> {
  const { promise, reject, resolve } = Promise.withResolvers<File[]>()
  const input = document.createElement("input")

  input.type = "file"
  input.accept = accept
  input.multiple = true
  input.oncancel = () => reject(new DOMException("File selection cancelled", "AbortError"))
  input.onchange = () => resolve([...input.files ?? []])

  input.click()

  return promise
}

export async function requestMediaDevices(constraints?: MediaStreamConstraints) {
  constraints ??= { audio: true, video: true }
  await navigator.mediaDevices.getUserMedia(constraints)
  const devices = await navigator.mediaDevices.enumerateDevices()
  return devices.filter(device => {
    const isAudio = constraints.audio && device.kind === "audioinput"
    const isVideo = constraints.video && device.kind === "videoinput"
    const isKind = constraints.audio && constraints.video || isAudio || isVideo
    return isKind
  })
}
