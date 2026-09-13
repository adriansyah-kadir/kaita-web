import * as v from "valibot"

export const addPersonSchema = v.object({
  name: v.pipe(v.string(), v.minLength(3)),
  tagIds: v.array(v.pipe(v.string(), v.uuid()))
})

export type AddPersonOutput = v.InferOutput<typeof addPersonSchema>
