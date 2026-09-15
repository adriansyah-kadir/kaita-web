import supabase from ".";

export async function getUser() {
  const {data, error} = await supabase.auth.getUser()
  if (error) throw error;
  return data.user
}
