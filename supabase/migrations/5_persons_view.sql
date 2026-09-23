create view persons_view
with (security_invoker = on) as
select
    p.*,
    coalesce(
        array_agg(distinct t.name) filter (where t.name is not null),
        '{}'
    ) as tags,
    count(distinct f.id) as faces
from persons p
left join person_tags pt
    on pt.person_id = p.id
left join tags t
    on pt.tag_id = t.id
left join faces f
    on f.person_id = p.id
group by p.id;
