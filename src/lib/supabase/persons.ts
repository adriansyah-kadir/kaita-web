import supabase from ".";

type Query = {
  page?: number,
  pageSize?: number,
  searchName?: string,
  containTags?: string[],
  faces?: number,
}

export async function personsPaginated({ page = 1, pageSize = 10, containTags = [], searchName = "", faces }: Query) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const q = supabase.from("persons_view").select().ilike("name", `%${searchName}%`).range(from, to)
  if (containTags.length) q.contains("tags", containTags);
  if (faces !== undefined) q.gte("faces", faces);
  const { data, error } = await q
  if (error !== null) throw error;
  return data
}
