create or replace view public.user_complete_address_view as
select 
    p.id as user_id,
    a.id as address_id,
    a.street,
    a.number,
    a.district,
    a.complement,
    a.postal_code,
    st_astext(a.location) as location_text, -- Converte a geografia para texto legível
    ci.name as city_name,
    st.name as state_name,
    st.abbreviation as state_abbreviation,
    co.name as country_name,
    co.abbreviation as country_abbreviation
from public.profiles p
inner join public.addresses a on p.address_id = a.id
inner join public.cities ci on a.city_id = ci.id
inner join public.states st on ci.state_id = st.id
inner join public.countries co on st.country_id = co.id;