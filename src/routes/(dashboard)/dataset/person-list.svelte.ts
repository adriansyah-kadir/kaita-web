import FetchState from "$lib/runes/fetch.svelte";
import Debounced from "$lib/runes/debounced.svelte";
import PaginationState from "$lib/runes/pagination.svelte";
import { personsPaginated } from "$lib/supabase/persons";
import type { Tables } from "$lib/supabase/types";
import { watch } from "runed";

export default class PersonsListState {
  pagination = new PaginationState();
  fetch = new FetchState(personsPaginated);
  search = new Debounced(() => "");
  tags = $state<Tables<"tags">[]>([]);
  loading = new Debounced(() => this.fetch.fetching);

  constructor() {
    $effect(() => {
      this.pagination.total = this.fetch.current?.count ?? null;
    });

    watch(
      [
        () => this.pagination.page,
        () => this.pagination.pageSize,
        () => this.search.value,
        () => this.tags.map((t) => t.name),
      ],
      ([page, pageSize, search, tags], [, , prevSearch, prevTags]) => {
        const filterChanged =
          search !== prevSearch ||
          new Set(tags).symmetricDifference(new Set(prevTags)).size > 0;

        if (filterChanged && page !== 1) {
          this.pagination.reset();
          return;
        }

        this.fetch.fetch({ page, pageSize, searchName: search, containTags: tags });
      },
    );
  }
}
