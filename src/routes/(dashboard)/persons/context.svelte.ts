import FetchState from "$lib/runes/fetch.svelte";
import SearchParamsState from "$lib/runes/search-param.svelte";
import { personsPaginated } from "$lib/supabase/persons";
import { Context } from "runed";

export const initContext = () => {
  const paginated = async (...input: Parameters<typeof personsPaginated>) =>
    personsPaginated(...input);
  const persons = new FetchState(paginated);
  const params = new SearchParamsState({
    page: (v) => Number(v?.length ? v : 1),
    pageSize: (v) => Number(v?.length ? v : 10),
    name: (v) => v,
    tags: (...names) => names.filter((e) => e !== undefined),
  });

  const refetch = () =>
    persons.fetch({
      page: params.values.page,
      pageSize: params.values.pageSize,
      name: params.values.name,
      tags: params.values.tags,
    });

  $effect(() => {
    refetch();
  });

  return {
    persons,
    params,
    refetch,
  }
}

const PersonsPageContext = new Context<ReturnType<typeof initContext>>("persons-page-context")

export default PersonsPageContext
