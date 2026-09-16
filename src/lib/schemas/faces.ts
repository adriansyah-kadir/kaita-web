import * as v from "valibot"

const MAX_IMAGE_SIZE = 5 * 1024 * 1024

export const createFaceSchema = v.object({
  image: v.pipe(v.file(), v.maxSize(MAX_IMAGE_SIZE), v.mimeType(["image/jpeg", "image/png"])),
})
