-- =====================================================
-- ENUMS
-- =====================================================

create type animal_species    as enum ('dog','cat','other');
create type animal_sex        as enum ('male','female');
create type animal_size       as enum ('small','medium','large');
create type animal_age_group  as enum ('puppy','young','adult','senior');
create type energy_level      as enum ('low','medium','high');
create type animal_status     as enum ('draft','available','in_process','adopted','unavailable');

-- =====================================================
-- TABLES
-- =====================================================

create table public.animals (
  id            uuid primary key default gen_random_uuid(),
--   ong_id        uuid references public.ongs(id) on delete cascade, -- Não incluído pois a tabela ongs não está criada ainda, mas será necessária para relacionar o animal à ONG que o cadastrou
  created_by    uuid not null references public.profiles(id) on delete,
  adopted_by    uuid references public.profiles(id) on delete default null,
  name          text not null,
  sex           animal_sex not null,
  size          animal_size not null,
  age_group     animal_age_group not null,
  species       animal_species not null,
  breed         text,
  birth_date    date,
  weight_kg     numeric(5,2),
  color         text,
  description   text,
  is_vaccinated boolean not null,
  is_neutered   boolean not null,
  is_dewormed   boolean not null,
  has_microchip boolean not null,
  status        animal_status not null default 'draft',
  cover_photo_url text,
  views_count   int not null default 0,
  published_at  timestamptz,
  adopted_at    timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz
);

create table public.animals_preferences(
    animal_id uuid not null references public.animals(id) on delete cascade,
    energy energy_level not null,
    good_with_kids     boolean,
    good_with_dogs     boolean,
    good_with_cats     boolean,
    apartment_friendly boolean not null default true,
    special_needs      boolean not null default false,
    special_needs_desc text,
    match_vector tsvector generated always as (
        setweight(to_tsvector('english', coalesce(good_with_kids::text, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(good_with_dogs::text, '')), 'B') ||
        setweight(to_tsvector('english', coalesce(good_with_cats::text, '')), 'C') ||
        setweight(to_tsvector('english', coalesce(apartment_friendly::text, '')), 'D') ||
        setweight(to_tsvector('english', coalesce(special_needs::text, '')), 'D') ||
        setweight(to_tsvector('english', coalesce(special_needs_desc, '')), 'D')
    ) stored,
    created_at    timestamptz not null default now(),
    updated_at    timestamptz
);

create table public.animal_photos (
  id           uuid primary key default gen_random_uuid(),
  animal_id    uuid not null references public.animals(id) on delete cascade,
  storage_path text not null,                 -- bucket animal-photos
  public_url   text not null,
  sort_order   int not null default 0,
  is_cover     boolean not null default false,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz
);

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

alter table public.animals enable row level security;
alter table public.animals_preferences enable row level security;
alter table public.animal_photos enable row level security;

-- =====================================================
-- POLICIES
-- =====================================================

-- Políticas para a tabela animals
create policy "Permitir tudo para autenticados em animals"
on public.animals for all
to authenticated
using (true)
with check (true);

-- Políticas para a tabela animals_preferences
create policy "Permitir tudo para autenticados em preferences"
on public.animals_preferences for all
to authenticated
using (true)
with check (true);

-- Políticas para a tabela animal_photos
create policy "Permitir tudo para autenticados em photos"
on public.animal_photos for all
to authenticated
using (true)
with check (true);