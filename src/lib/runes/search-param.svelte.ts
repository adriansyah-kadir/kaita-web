import { building } from "$app/env"
import { goto } from "$app/navigation"
import { page } from "$app/state"
import { watch } from "runed"

type CoderFunction<T> = (value: string | null) => T
type CoderObject<T> = { decode: (value: string | null) => T, encode: (value: T) => string | null }
type Coder<T> = CoderFunction<T> | CoderObject<T>

type Params = Record<string, Coder<unknown>>

type Value<T extends Params, K extends keyof T> = T[K] extends CoderFunction<unknown> ? ReturnType<T[K]> : T[K] extends CoderObject<unknown> ? ReturnType<T[K]["decode"]> : never

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
      const coder = this.schema[k]
      const param = typeof coder === "function" ? String(value) : coder.encode(value)
      if (param === null || !value) url.searchParams.delete(k);
      else url.searchParams.set(k, param);
    }
    goto(url, { keepFocus: true, noScroll: true })
  }

  #buildValues() {
    return Object.fromEntries(Object.keys(this.schema).map(this.#map.bind(this)))
  }

  #map(k: string) {
    const coder = this.schema[k]
    const param = this.#param(k)
    const value = typeof coder === "function" ? coder(param) : coder.decode(param)
    return [k, value]
  }

  #param(k: string) {
    if (!building) return page.url.searchParams.get(k);
    else return null
  }
}
