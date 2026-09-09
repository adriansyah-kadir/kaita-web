import supabase from ".";

export async function personsPaginated(page: number = 1, pageSize: number = 10, search = "") {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  return (
    await supabase.from("persons").select().ilike("name", `%${search}%`).range(from, to).throwOnError()
  ).data;
}
