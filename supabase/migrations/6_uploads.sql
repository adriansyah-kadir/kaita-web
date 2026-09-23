create view uploads
with (security_invoker = true)
as select
    id,
    bucket_id,
    name,
    owner_id,
    created_at,
    updated_at,
    last_accessed_at,
    metadata
from storage.objects
where bucket_id = 'uploads';

insert into storage.buckets (id, name, public)
values ('uploads', 'uploads', true);

create policy "Allow all on user folder"
on storage.objects for all
to authenticated using (
    bucket_id = 'uploads'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
);
