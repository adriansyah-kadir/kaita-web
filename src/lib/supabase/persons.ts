import supabase from ".";

type Query = {
  page?: number,
  pageSize?: number,
  name?: string | null,
  tags?: string[],
  faces?: number,
}

export function personsPaginated({ page = 1, pageSize = 10, tags: containTags = [], name: searchName = "", faces }: Query) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const q = supabase.from("persons_view").select("*", { count: 'exact' }).ilike("name", `%${searchName ?? ""}%`).range(from, to)
  if (containTags.length) q.contains("tags", containTags);
  if (faces !== undefined) q.gte("faces", faces);
  return q
}

export async function insertPerson(name: string, tagIds: string[]) {
  const person = await supabase.from("persons").insert({ name }).select().single()
  if (person.error) throw person.error;
  const tags = await supabase.from("person_tags").insert(tagIds.map(e => ({ person_id: person.data.id, tag_id: e }))).select()
  if (tags.error) throw tags.error;
  return { person: person.data, tags: tags.data }
}
