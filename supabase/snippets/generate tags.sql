insert into tags (name, owner_id)
select
    tag.name,
    (select id from auth.users order by created_at limit 1)
from (
    values
        ('student'),
        ('teacher'),
        ('staff'),
        ('admin'),
        ('active'),
        ('inactive'),
        ('vip'),
        ('new'),
        ('verified'),
        ('unverified')
) as tag(name);