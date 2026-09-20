import { requestMediaDevices } from "$lib"
import supabase from "$lib/supabase"
import * as v from "valibot"

export type LiveSchema = v.InferOutput<typeof liveSchema>

export const liveSchema = v.objectAsync({
  tags: v.pipeAsync(
    v.nullable(v.array(v.pipe(
      v.string(),
      v.uuid(),
    )), null),
    v.transformAsync(async tags => {
      if (tags === null) return undefined;
      const { data, error } = await supabase.from("tags").select("*").in("id", [...new Set(tags)])
      if (error) throw error;
      return data
    })
  ),
  device: v.pipeAsync(
    v.string(),
    v.checkAsync(async deviceId => {
      const devices = await requestMediaDevices({ video: { deviceId } })
      return devices.some(dev => dev.deviceId === deviceId)
    }, "Invalid device id"),
    v.transformAsync(async deviceId => {
      return navigator.mediaDevices.getUserMedia({ video: { deviceId } })
    })
  )
})

