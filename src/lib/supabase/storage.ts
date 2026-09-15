import supabase from ".";
import { getUser } from "./auth";

export async function uploadFile(file: File, name = crypto.randomUUID()) {
  const user = await getUser()
  const path = `${user.id}/${name}`
  const resp = await supabase.storage.from("uploads").upload(path, file)
  if (resp.error) throw resp.error;
  return resp.data
}
