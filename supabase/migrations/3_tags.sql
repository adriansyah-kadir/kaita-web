create table tags (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    owner_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
    created_at timestamptz not null default now(),
    unique (owner_id, name)
);

alter table tags enable row level security;

create policy "allow crud to owner"
on tags for all to public
using (
    (select auth.uid()) = tags.owner_id
);

