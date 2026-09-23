create or replace function get_faces_by_tags(
    p_tags uuid[] default null
)
returns setof faces
language sql
security invoker
as $$
    select distinct f.*
    from faces f
    where
        -- null = all faces
        p_tags is null

        -- [] = faces whose person has no tags
        or (
            cardinality(p_tags) = 0
            and not exists (
                select 1
                from person_tags pt
                where pt.person_id = f.person_id
            )
        )

        -- non-empty = faces whose person has at least one requested tag
        or (
            cardinality(p_tags) > 0
            and exists (
                select 1
                from person_tags pt
                where pt.person_id = f.person_id
                  and pt.tag_id = any(p_tags)
            )
        );
$$;
