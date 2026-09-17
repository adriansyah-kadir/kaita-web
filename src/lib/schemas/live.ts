import { requestMediaDevices } from "$lib"
import supabase from "$lib/supabase"
import * as v from "valibot"

export type LiveSchema = v.InferOutput<typeof liveSchema>

export const liveSchema = v.objectAsync({
  tags: v.pipeAsync(
    v.array(v.pipe(
      v.string(),
      v.uuid(),
    )),
    v.checkAsync(async tags => {
      const { data, error } = await supabase.from("tags").select("id").in("id", [...new Set(tags)])
      if (error) return false
      return data.length === tags.length
    }, "Tags not in database")
  ),
  device: v.pipeAsync(
    v.string(),
    v.checkAsync(async deviceId => {
      const devices = await requestMediaDevices({ video: { deviceId } })
      return devices.some(dev => dev.deviceId === deviceId)
    }, "Invalid device id")
  )
})

