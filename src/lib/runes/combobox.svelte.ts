import { SvelteMap } from "svelte/reactivity"

type Props<T> = {
  items: T[]
  key: (item: T) => string
  selection?: "preserve" | "sync" | "clear"
}

export default class ComboboxState<T> {
  #items = new SvelteMap<string, T>()
  #selected = new SvelteMap<string, T>()

  get items() {
    return this.#items.values().toArray()
  }

  get selected() {
    return this.#selected.values().toArray()
  }

  available = $derived.by(() =>
    this.#items.entries()
      .filter(([key]) => !this.#selected.has(key))
      .map(([, item]) => item)
      .toArray()
  )

  constructor(props: () => Props<T>) {
    $effect(() => {
      const {
        items,
        key,
        selection = "preserve",
      } = props()

      const next = new Map(items.map(item => [key(item), item]))

      this.#items.clear()

      for (const [key, item] of next) {
        this.#items.set(key, item)
      }

      switch (selection) {
        case "clear":
          this.#selected.clear()
          break

        case "sync":
          for (const key of this.#selected.keys()) {
            if (!next.has(key)) {
              this.#selected.delete(key)
            } else {
              this.#selected.set(key, next.get(key)!)
            }
          }
          break

        case "preserve":
          for (const key of this.#selected.keys()) {
            const item = next.get(key)
            if (item !== undefined) {
              this.#selected.set(key, item)
            }
          }
          break
      }
    })
  }

  isSelected = (key: string) => {
    return this.#selected.has(key)
  }

  get isSelectedAll() {
    const itemKeys = new Set(this.#items.keys())
    const selectedKeys = new Set(this.#selected.keys())
    return selectedKeys.isSupersetOf(itemKeys)
  }

  clear = () => {
    this.#selected.clear()
  }

  select = (key: string) => {
    if (this.isSelected(key)) return false

    const item = this.#items.get(key)
    if (item === undefined) return false

    this.#selected.set(key, item)
    return true
  }

  unselect = (key: string) => {
    if (this.isSelected(key)) return this.#selected.delete(key);
    return false
  }

  toggle = (key: string, checked?: boolean) => {
    const select = checked ?? !this.isSelected(key)
    if (!select) this.unselect(key);
    else this.select(key)
    return this.isSelected(key)
  }

  toggleall = (checked?: boolean) => {
    this.#items.keys().forEach(k => this.toggle(k, checked))
  }
}
