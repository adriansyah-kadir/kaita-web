export default class FetchState<F extends (...any: any) => Promise<any>, E = any> {
  fetching = $state(false)
  current = $state<Awaited<ReturnType<F>>>()
  error = $state<E>()

  constructor(readonly fn: F) { }

  fetch = async (...input: Parameters<F>) => {
    this.fetching = true
    try {
      const value = await this.fn(...input)
      this.current = value
      return value
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
