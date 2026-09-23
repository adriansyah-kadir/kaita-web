create table persons (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    owner_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
    sub text,
    metadata jsonb not null default '{}',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

alter table persons enable row level security;

create policy "allow crud to owner"
on persons for all to public
using (
    (select auth.uid()) = persons.owner_id
);

