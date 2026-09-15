import supabase from ".";

export async function getUser() {
  const { data, error } = await supabase.auth.getUser()
  if (error) throw error;
  return data.user
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession()
  if (error) throw error;
  return data.session
}
