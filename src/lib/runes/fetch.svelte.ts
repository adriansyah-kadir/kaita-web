export default class FetchState<I extends Array<any>, O, E = any> {
  fetching = $state(false)
  current = $state<O>()
  error = $state<E>()

  constructor(readonly fn: (...input: I) => Promise<O>) { }

  fetch = async (...input: I) => {
    this.fetching = true
    try {
      this.current = await this.fn(...input)
    } catch (e) {
      this.error = e as any
    } finally {
      this.fetching = false
    }
  }

  reset = () => {
    this.current = undefined
    this.error = undefined
  }
}
