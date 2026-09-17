export default class FetchState<F extends (...any: any) => Promise<any>, E = Error> {
  fetching = $state(false)
  current = $state<Awaited<ReturnType<F>>>()
  error = $state<E>()
  #success = $state<boolean>()

  success(): this is {
    current: Awaited<ReturnType<F>>
  } {
    return this.#success === true
  }

  failed(): this is {
    error: E
  } {
    return this.#success === false
  }


  constructor(readonly fn: F) { }

  fetch = async (...input: Parameters<F>): Promise<Awaited<ReturnType<F>>> => {
    this.fetching = true
    try {
      const value = await this.fn(...input)
      this.current = value
      this.fetching = false
      this.#success = true
      return value
    } catch (e) {
      this.#success = false
      this.fetching = false
      this.error = e as any
      throw e
    }
  }

  reset = () => {
    this.current = undefined
    this.error = undefined
    this.#success = undefined
  }
}
