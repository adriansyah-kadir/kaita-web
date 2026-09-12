import * as v from "valibot"

export const addPersonSchema = v.object({
  name: v.pipe(v.string(), v.minLength(3)),
  tagIds: v.array(v.string())
})

export type AddPersonOutput = v.InferOutput<typeof addPersonSchema>
