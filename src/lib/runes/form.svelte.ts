import { objFrom, objKeys, objValues } from "$lib"
import type { Attachment } from "svelte/attachments"
import { preventDefault } from "svelte/legacy"
import * as v from "valibot"

type FieldInput = FormDataEntryValue | FormDataEntryValue[] | null
type PlainFieldSchema = v.BaseSchema<FieldInput, unknown, v.BaseIssue<unknown>>
type PlainFieldSchemaAsync = v.BaseSchemaAsync<FieldInput, unknown, v.BaseIssue<unknown>>
type PlainObjectSchema = v.ObjectSchema<Record<string, PlainFieldSchema>, any>
type PlainObjectSchemaAsync = v.ObjectSchemaAsync<Record<string, PlainFieldSchemaAsync | PlainFieldSchema>, any>
type ObjectSchema = PlainObjectSchema | PlainObjectSchemaAsync
type Issues<S extends ObjectSchema> = {
  [K in Keys<S>]: v.InferIssue<S["entries"][K]>[]
}
type Inputs<S extends ObjectSchema> = Partial<{
  [K in Keys<S>]: v.InferInput<S["entries"][K]>
}>
type Keys<S extends ObjectSchema> = keyof S["entries"]
type OnSubmit<S extends ObjectSchema> = (output: v.InferOutput<S>) => unknown

export default class FormState<S extends ObjectSchema> {
  #node = $state<HTMLFormElement>()
  get node() { return this.#node }

  #validating = $state(false)
  get validating() { return this.#validating }

  result = $state<v.SafeParseResult<S>>()
  inputs = $state<Inputs<S>>()

  get issues(): Issues<S> {
    const map = (key: Keys<S>) => [key, this.result?.issues?.filter(e => e.path?.[0].key === key) ?? []] as const
    return objFrom(objKeys(this.schemas).map(map))
  }

  get outputs(): v.InferOutput<S> | undefined {
    return this.result?.success ? this.result.output : undefined
  }

  get invalid(): boolean {
    return objValues(this.issues).some(issues => issues.length > 0)
  }

  constructor(readonly schema: S, private onSubmit?: OnSubmit<S>) { }

  attach(): Attachment {
    return node => {
      const form = node.closest("form")
      if (!form) return
      return this.#setup(form)
    }
  }

  reset = () => {
    this.result = undefined
  }

  get schemas() {
    return this.schema.entries as {
      [K in Keys<S>]: S["entries"][K]
    }
  }

  #setup(form: HTMLFormElement) {
    const onSubmit = preventDefault(this.#submit.bind(this, form))

    this.#node = form
    form.addEventListener("submit", onSubmit)
    form.addEventListener("reset", this.reset)
    return () => {
      this.#node = undefined
      form.removeEventListener("submit", onSubmit)
      form.removeEventListener("reset", this.reset)
    }
  }

  async #submit(form: HTMLFormElement) {
    this.#validating = true
    try {
      const data = new FormData(form)
      this.inputs = this.#values(data)
      this.result = await v.safeParseAsync(this.schema, this.inputs)
      if (this.result.success) this.onSubmit?.(this.result.output)
    } finally {
      this.#validating = false
    }
  }

  #values(data: FormData) {
    const get = (key: Keys<S>): [Keys<S>, FieldInput] => {
      const schema = this.schemas[key]
      if (schema.type == "array") return [key, data.getAll(String(key))] as const
      return [key, data.get(String(key))] as const
    }

    const values = objKeys(this.schemas).map(get)
    return objFrom(values)
  }
}
