import * as v from "valibot"

export type CreateTagSchema = v.InferOutput<typeof createTagSchema>

export const createTagSchema = v.object({
  name: v.pipe(v.string(), v.minLength(1, "Name cannot be empty string")),
})
