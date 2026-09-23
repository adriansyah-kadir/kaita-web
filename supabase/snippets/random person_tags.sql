insert into person_tags (person_id, tag_id)
select
    p.id,
    t.id
from persons p
cross join lateral (
    select id
    from tags
    where tags.owner_id = p.owner_id
    order by random()
    limit floor(random() * 5)::int
) t
on conflict (person_id, tag_id) do nothing;