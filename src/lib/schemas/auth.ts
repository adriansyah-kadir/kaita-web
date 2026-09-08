import * as v from "valibot"

export type SignInSchema = v.InferOutput<typeof signInSchema>

export const signInSchema = v.objectAsync({
  email: v.pipe(v.string(), v.email(), v.minLength(9)),
  password: v.pipe(v.string(), v.minLength(4)),
});
