create table person_tags(
    tag_id uuid not null references tags(id),
    person_id uuid not null references persons(id),
    primary key (tag_id, person_id)
);

alter table person_tags enable row level security;

create policy "allow crud to owner"
on person_tags
for all
to public
using (
    exists (
        select 1
        from persons p
        join tags t on t.id = person_tags.tag_id
        where p.id = person_tags.person_id
          and p.owner_id = (select auth.uid())
          and t.owner_id = (select auth.uid())
    )
);
