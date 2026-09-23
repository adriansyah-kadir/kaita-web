create table faces (
    id uuid primary key default gen_random_uuid(),
    person_id uuid not null references persons(id) on delete cascade,
    embedding vector(512) not null,
    image_id uuid not null references storage.objects(id),
    metadata jsonb not null default '{}',
    created_at timestamptz not null default now()
);

alter table faces enable row level security;

create policy "allow crud to owner"
on faces for all to public
using (
    exists (
        select 1 from persons p
        where p.id = faces.person_id
            and p.owner_id = (select auth.uid())
    )
);

