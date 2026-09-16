import { building } from "$app/env"
import { goto } from "$app/navigation"
import { page } from "$app/state"
import { objKeys } from "$lib"
import { watch } from "runed"

type DecodeFunction<T = any> = (...values: (string | undefined)[]) => T
type CoderObject = {
  decode: DecodeFunction,
  encode: (value: any) => string[] | string | null
}
type Coder = DecodeFunction | CoderObject

type Params = Record<string, Coder>

type Value<P extends Params, K extends keyof P> =
  P[K] extends DecodeFunction ? ReturnType<P[K]> :
  P[K] extends CoderObject ? ReturnType<P[K]["decode"]> :
  never

type Values<P extends Params> = {
  [K in keyof P]: Value<P, K>
}

export default class SearchParamsState<P extends Params> {
  values!: Values<P>
  schema: P

  constructor(schema: P) {
    this.schema = schema
    this.values = $state(this.#buildValues())

    if (!building) {
      watch(() => page.url.searchParams, () => {
        this.values = this.#buildValues()
      })
    }
  }

  update = (values: Partial<Values<P>>) => {
    const url = page.url
    for (const k in values) {
      const value = values[k]
      const encode = this.#encoder(k)
      const params = encode(value)
      if (!params?.length) url.searchParams.delete(k);
      else if (Array.isArray(params)) params.forEach(url.searchParams.append.bind(url.searchParams, k));
      else url.searchParams.set(k, params)
    }
    goto(url, { keepFocus: true, noScroll: true })
  }

  clear = (...keys: (keyof P)[]) => {
    const url = page.url
    if (keys.length > 0) keys.map(String).forEach(key => url.searchParams.delete(key))
    else objKeys(this.values).map(String).forEach(key => url.searchParams.delete(key))
    goto(url, { keepFocus: true, noScroll: true })
  }

  #buildValues() {
    return Object.fromEntries(Object.keys(this.schema).map(this.#map.bind(this)))
  }

  #map(k: string) {
    const decode = this.#decoder(k)
    const params = this.#params(k)
    const value = decode(...params)
    return [k, value]
  }

  #encoder(k: string) {
    const s = this.schema[k]
    if (typeof s === "function") return (value: unknown) => {
      if (Array.isArray(value)) return value.map(String);
      return String(value)
    }
    return s.encode
  }

  #decoder(k: string): DecodeFunction {
    const s = this.schema[k]
    if (typeof s === "function") return s;
    return s.decode
  }

  #params(k: string) {
    if (building) return []
    return page.url.searchParams.getAll(k)
  }
}
