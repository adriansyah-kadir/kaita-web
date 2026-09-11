import { watch, type Getter } from "runed"

export default class Debounced<T> {
  value: T
  target: T
  duration_ms: number

  #scheduled?: ReturnType<typeof setTimeout>

  get scheduled() {
    return this.#scheduled !== undefined
  }

  constructor(getter: Getter<T>, duration_ms: number = 500) {
    this.duration_ms = duration_ms
    this.value = $state(getter())
    this.target = $state(getter())
    watch(getter, this.set)
  }

  set = (v: T) => {
    this.cancel()

    this.target = v

    this.#scheduled = setTimeout(() => {
      this.value = v
      this.#scheduled = undefined
    }, this.duration_ms)
  }

  cancel = () => {
    if (!this.scheduled) {
      return false
    }

    clearTimeout(this.#scheduled)
    this.#scheduled = undefined
    this.target = this.value

    return true
  }
}
