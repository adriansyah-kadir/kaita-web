insert into persons (name, owner_id, sub, metadata)
select
    'Person ' || i,
    (select id from auth.users limit 1),
    'person-' || i,
    jsonb_build_object(
        'index', i,
        'random_value', floor(random() * 1000)::int
    )
from generate_series(1, 100) as i;