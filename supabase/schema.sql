-- ConectaPet — Schema inicial do Supabase (PostgreSQL)
-- Gerado a partir de ARQUITETURA_ConectaPet.md
-- Execute no SQL Editor do Supabase, na ordem abaixo.


-- =====================================================
-- EXTENSOES E ENUMS
-- =====================================================

create extension if not exists "uuid-ossp";
create extension if not exists postgis with schema extensions;      -- busca por raio

-- O PostGIS vive no schema 'extensions' no Supabase; inclua-o no caminho de busca
-- para que os tipos (geography) e funcoes (st_*) resolvam durante este script.
set search_path = public, extensions;

create type animal_species    as enum ('dog','cat','other');
create type animal_sex        as enum ('male','female');
create type animal_size       as enum ('small','medium','large');
create type animal_age_group  as enum ('puppy','young','adult','senior');
create type energy_level      as enum ('low','medium','high');
create type animal_status     as enum ('draft','available','in_process','adopted','unavailable');

create type housing_type      as enum ('apartment','house_no_yard','house_with_yard','rural');
create type ong_member_role   as enum ('owner','admin','volunteer');
create type interest_status   as enum ('new','contacted','in_review','approved','rejected','completed','cancelled');
create type donation_status   as enum ('intent','confirmed','cancelled');
create type health_event_type as enum ('vaccine','deworming','neutering','consultation','exam','medication','other');
create type post_type         as enum ('news','campaign','event','urgent');


-- =====================================================
-- TABELAS DO NUCLEO
-- =====================================================

-- ---------- PERFIS ----------
create table public.profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  full_name       text not null,
  avatar_url      text,
  phone           text,
  city            text,
  state           char(2) default 'RS',
  is_platform_admin boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Estilo de vida do adotante → insumo do algoritmo de match
create table public.adopter_preferences (
  profile_id        uuid primary key references public.profiles(id) on delete cascade,
  housing           housing_type,
  has_children      boolean not null default false,
  children_age_min  int,
  has_other_dogs    boolean not null default false,
  has_other_cats    boolean not null default false,
  hours_alone_per_day int check (hours_alone_per_day between 0 and 24),
  activity_level    energy_level,
  first_time_owner  boolean not null default true,
  accepts_special_needs boolean not null default false,
  preferred_species animal_species[] default '{}',
  preferred_sizes   animal_size[]    default '{}',
  search_radius_km  int not null default 30 check (search_radius_km between 1 and 500),
  updated_at        timestamptz not null default now()
);

-- ---------- ONGs ----------
create table public.ongs (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  slug           text unique not null,
  description    text,
  logo_url       text,
  cnpj           text unique,
  email          text,
  phone          text,
  whatsapp       text,
  instagram      text,
  website        text,
  address_street text,
  address_number text,
  address_district text,
  city           text not null,
  state          char(2) not null default 'RS',
  postal_code    text,
  location       geography(Point, 4326),          -- (long, lat)
  pix_key        text,
  pix_key_type   text check (pix_key_type in ('cpf','cnpj','email','phone','random')),
  pix_receiver_name text,
  pix_city       text,
  is_verified    boolean not null default false,  -- aprovada pelo admin
  is_active      boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index ongs_location_idx on public.ongs using gist (location);
create index ongs_city_idx     on public.ongs (city, state);

create table public.ong_members (
  ong_id     uuid not null references public.ongs(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  role       ong_member_role not null default 'volunteer',
  created_at timestamptz not null default now(),
  primary key (ong_id, profile_id)
);
create index ong_members_profile_idx on public.ong_members (profile_id);

-- ---------- ANIMAIS ----------
create table public.animals (
  id            uuid primary key default gen_random_uuid(),
  ong_id        uuid not null references public.ongs(id) on delete cascade,
  created_by    uuid references public.profiles(id) on delete set null,
  adopted_by    uuid references public.profiles(id) on delete set null,

  name          text not null,
  species       animal_species not null,
  breed         text,
  sex           animal_sex not null,
  size          animal_size not null,
  age_group     animal_age_group not null,
  birth_date    date,
  weight_kg     numeric(5,2),
  color         text,

  description   text,
  energy        energy_level not null default 'medium',
  good_with_kids     boolean,
  good_with_dogs     boolean,
  good_with_cats     boolean,
  apartment_friendly boolean not null default true,
  special_needs      boolean not null default false,
  special_needs_desc text,

  is_vaccinated boolean not null default false,
  is_neutered   boolean not null default false,
  is_dewormed   boolean not null default false,
  has_microchip boolean not null default false,

  status        animal_status not null default 'draft',
  cover_photo_url text,
  views_count   int not null default 0,
  published_at  timestamptz,
  adopted_at    timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index animals_ong_idx     on public.animals (ong_id);
create index animals_status_idx  on public.animals (status) where status = 'available';
create index animals_filter_idx  on public.animals (species, size, age_group, status);

create table public.animal_photos (
  id           uuid primary key default gen_random_uuid(),
  animal_id    uuid not null references public.animals(id) on delete cascade,
  storage_path text not null,                 -- bucket animal-photos
  public_url   text not null,
  sort_order   int not null default 0,
  is_cover     boolean not null default false,
  created_at   timestamptz not null default now()
);
create index animal_photos_animal_idx on public.animal_photos (animal_id, sort_order);
create unique index animal_photos_one_cover on public.animal_photos (animal_id) where is_cover;

-- ---------- ENGAJAMENTO ----------
create table public.favorites (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  animal_id  uuid not null references public.animals(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (profile_id, animal_id)
);

create table public.adoption_interests (
  id           uuid primary key default gen_random_uuid(),
  animal_id    uuid not null references public.animals(id) on delete cascade,
  profile_id   uuid not null references public.profiles(id) on delete cascade,
  ong_id       uuid not null references public.ongs(id) on delete cascade,
  message      text,
  match_score  int,                            -- score no momento do interesse
  status       interest_status not null default 'new',
  ong_notes    text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (animal_id, profile_id)
);
create index adoption_interests_ong_idx on public.adoption_interests (ong_id, status);

-- ---------- DOAÇÕES ----------
create table public.donations (
  id           uuid primary key default gen_random_uuid(),
  ong_id       uuid not null references public.ongs(id) on delete cascade,
  profile_id   uuid references public.profiles(id) on delete set null,  -- anônimo permitido
  amount_cents int not null check (amount_cents > 0),
  method       text not null default 'pix',
  status       donation_status not null default 'intent',
  txid         text,                          -- identificador do BR Code
  is_anonymous boolean not null default false,
  message      text,
  created_at   timestamptz not null default now(),
  confirmed_at timestamptz
);
create index donations_ong_idx on public.donations (ong_id, created_at desc);

-- ---------- FEED DE AVISOS ----------
create table public.posts (
  id           uuid primary key default gen_random_uuid(),
  ong_id       uuid not null references public.ongs(id) on delete cascade,
  author_id    uuid references public.profiles(id) on delete set null,
  type         post_type not null default 'news',
  title        text not null,
  body         text not null,
  image_url    text,
  event_date   timestamptz,
  is_published boolean not null default false,
  published_at timestamptz,
  created_at   timestamptz not null default now()
);
create index posts_feed_idx on public.posts (is_published, published_at desc);

-- ---------- PUSH ----------
create table public.device_tokens (
  id           uuid primary key default gen_random_uuid(),
  profile_id   uuid not null references public.profiles(id) on delete cascade,
  expo_token   text not null unique,
  platform     text check (platform in ('ios','android','web')),
  last_seen_at timestamptz not null default now(),
  created_at   timestamptz not null default now()
);


-- =====================================================
-- TABELAS COMPLEMENTARES
-- =====================================================

-- Pet Care
create table public.health_records (
  id          uuid primary key default gen_random_uuid(),
  animal_id   uuid not null references public.animals(id) on delete cascade,
  created_by  uuid references public.profiles(id) on delete set null,
  event_type  health_event_type not null,
  title       text not null,
  notes       text,
  event_date  date not null,
  next_due_date date,                          -- lembrete de reforço
  vet_name    text,
  attachment_url text,
  created_at  timestamptz not null default now()
);
create index health_records_animal_idx on public.health_records (animal_id, event_date desc);

-- Painel analítico
create table public.animal_views (
  id         bigserial primary key,
  animal_id  uuid not null references public.animals(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete set null,
  viewed_at  timestamptz not null default now()
);
create index animal_views_animal_idx on public.animal_views (animal_id, viewed_at desc);

-- Gamificação
create table public.badges (
  id          uuid primary key default gen_random_uuid(),
  code        text unique not null,
  name        text not null,
  description text,
  icon_url    text,
  points      int not null default 0
);

create table public.user_badges (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  badge_id   uuid not null references public.badges(id) on delete cascade,
  earned_at  timestamptz not null default now(),
  primary key (profile_id, badge_id)
);

-- Clube de vantagens
create table public.partners (
  id       uuid primary key default gen_random_uuid(),
  name     text not null,
  category text,
  city     text,
  location geography(Point, 4326),
  logo_url text,
  is_active boolean not null default true
);

create table public.coupons (
  id           uuid primary key default gen_random_uuid(),
  partner_id   uuid not null references public.partners(id) on delete cascade,
  code         text not null,
  title        text not null,
  description  text,
  discount_pct int,
  valid_until  date,
  max_uses     int,
  uses_count   int not null default 0
);

create table public.coupon_redemptions (
  id          uuid primary key default gen_random_uuid(),
  coupon_id   uuid not null references public.coupons(id) on delete cascade,
  profile_id  uuid not null references public.profiles(id) on delete cascade,
  redeemed_at timestamptz not null default now(),
  unique (coupon_id, profile_id)
);


-- =====================================================
-- TRIGGERS E FUNCOES
-- =====================================================

-- updated_at automático
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger trg_profiles_updated  before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger trg_animals_updated   before update on public.animals
  for each row execute function public.set_updated_at();
create trigger trg_ongs_updated      before update on public.ongs
  for each row execute function public.set_updated_at();
create trigger trg_interests_updated before update on public.adoption_interests
  for each row execute function public.set_updated_at();

-- Cria o profile automaticamente no signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Helper de permissão usado nas policies
create or replace function public.is_ong_member(_ong_id uuid, _roles ong_member_role[] default null)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.ong_members m
    where m.ong_id = _ong_id
      and m.profile_id = auth.uid()
      and (_roles is null or m.role = any(_roles))
  );
$$;


-- =====================================================
-- MATCH E BUSCA (RPC)
-- =====================================================

create or replace function public.calculate_match_score(_animal public.animals, _pref public.adopter_preferences)
returns int language plpgsql immutable as $$
declare s int := 50;   -- base neutra
begin
  if _pref is null then return s; end if;

  -- Moradia
  if _pref.housing = 'apartment' then
    if _animal.apartment_friendly then s := s + 10; else s := s - 25; end if;
    if _animal.size = 'large' then s := s - 10; end if;
    if _animal.energy = 'high' then s := s - 8; end if;
  elsif _pref.housing in ('house_with_yard','rural') then
    if _animal.size = 'large' then s := s + 8; end if;
    if _animal.energy = 'high' then s := s + 6; end if;
  end if;

  -- Convivência
  if _pref.has_children then
    if _animal.good_with_kids is true then s := s + 15;
    elsif _animal.good_with_kids is false then s := s - 30; end if;
  end if;
  if _pref.has_other_dogs then
    if _animal.good_with_dogs is true then s := s + 10;
    elsif _animal.good_with_dogs is false then s := s - 25; end if;
  end if;
  if _pref.has_other_cats then
    if _animal.good_with_cats is true then s := s + 10;
    elsif _animal.good_with_cats is false then s := s - 25; end if;
  end if;

  -- Rotina e experiência
  if _pref.hours_alone_per_day >= 8 and _animal.energy = 'high' then s := s - 12; end if;
  if _pref.first_time_owner and _animal.special_needs then s := s - 15; end if;
  if _pref.activity_level = _animal.energy then s := s + 12; end if;

  -- Necessidades especiais
  if _animal.special_needs and not _pref.accepts_special_needs then s := s - 20; end if;

  -- Preferências declaradas
  if array_length(_pref.preferred_species,1) is not null
     and _animal.species = any(_pref.preferred_species) then s := s + 10; end if;
  if array_length(_pref.preferred_sizes,1) is not null
     and _animal.size = any(_pref.preferred_sizes) then s := s + 8; end if;

  return greatest(0, least(100, s));
end $$;

-- Busca principal da vitrine
create or replace function public.search_animals(
  _lat            double precision default null,
  _lng            double precision default null,
  _radius_km      int  default null,
  _species        animal_species[] default null,
  _sizes          animal_size[]    default null,
  _age_groups     animal_age_group[] default null,
  _ong_id         uuid default null,
  _limit          int default 20,
  _offset         int default 0
)
returns table (
  id uuid, name text, species animal_species, sex animal_sex,
  size animal_size, age_group animal_age_group, cover_photo_url text,
  ong_id uuid, ong_name text, distance_km double precision, match_score int
)
language sql stable security definer set search_path = public, extensions as $$
  select
    a.id, a.name, a.species, a.sex, a.size, a.age_group, a.cover_photo_url,
    o.id as ong_id, o.name as ong_name,
    case when _lat is null then null
         else st_distance(o.location, st_point(_lng, _lat)::geography) / 1000.0
    end as distance_km,
    public.calculate_match_score(
      a,
      (select ap from public.adopter_preferences ap where ap.profile_id = auth.uid())
    ) as match_score
  from public.animals a
  join public.ongs o on o.id = a.ong_id
  where a.status = 'available'
    and o.is_active and o.is_verified
    and (_species    is null or a.species   = any(_species))
    and (_sizes      is null or a.size      = any(_sizes))
    and (_age_groups is null or a.age_group = any(_age_groups))
    and (_ong_id     is null or a.ong_id    = _ong_id)
    and (
      _lat is null or _radius_km is null
      or st_dwithin(o.location, st_point(_lng, _lat)::geography, _radius_km * 1000)
    )
  order by match_score desc nulls last, distance_km asc nulls last, a.published_at desc
  limit _limit offset _offset;
$$;


-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

alter table public.profiles            enable row level security;
alter table public.adopter_preferences enable row level security;
alter table public.ongs                enable row level security;
alter table public.ong_members         enable row level security;
alter table public.animals             enable row level security;
alter table public.animal_photos       enable row level security;
alter table public.favorites           enable row level security;
alter table public.adoption_interests  enable row level security;
alter table public.donations           enable row level security;
alter table public.posts               enable row level security;
alter table public.device_tokens       enable row level security;
alter table public.health_records      enable row level security;

-- PROFILES
create policy "perfis são públicos para leitura"
  on public.profiles for select using (true);
create policy "usuário edita o próprio perfil"
  on public.profiles for update using (auth.uid() = id);

-- PREFERÊNCIAS: privadas
create policy "preferências próprias"
  on public.adopter_preferences for all
  using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

-- ONGs
create policy "ONGs ativas visíveis a todos"
  on public.ongs for select using (is_active);
create policy "owner/admin editam a ONG"
  on public.ongs for update
  using (public.is_ong_member(id, array['owner','admin']::ong_member_role[]));

-- ANIMAIS
create policy "animais publicados são públicos"
  on public.animals for select
  using (status <> 'draft' or public.is_ong_member(ong_id));
create policy "membros da ONG gerenciam seus animais"
  on public.animals for insert with check (public.is_ong_member(ong_id));
create policy "membros da ONG atualizam seus animais"
  on public.animals for update using (public.is_ong_member(ong_id));
create policy "owner/admin excluem animais"
  on public.animals for delete
  using (public.is_ong_member(ong_id, array['owner','admin']::ong_member_role[]));

-- FOTOS
create policy "fotos seguem o animal"
  on public.animal_photos for select using (true);
create policy "membros gerenciam fotos"
  on public.animal_photos for all
  using (exists (select 1 from public.animals a
                 where a.id = animal_id and public.is_ong_member(a.ong_id)));

-- FAVORITOS
create policy "favoritos próprios"
  on public.favorites for all
  using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

-- INTERESSES: o adotante vê os seus; a ONG vê os que recebeu
create policy "interesses visíveis ao autor e à ONG"
  on public.adoption_interests for select
  using (auth.uid() = profile_id or public.is_ong_member(ong_id));
create policy "adotante cria interesse"
  on public.adoption_interests for insert with check (auth.uid() = profile_id);
create policy "ONG atualiza o funil"
  on public.adoption_interests for update using (public.is_ong_member(ong_id));

-- DOAÇÕES
create policy "doador vê as próprias doações"
  on public.donations for select
  using (auth.uid() = profile_id or public.is_ong_member(ong_id));
create policy "qualquer autenticado registra doação"
  on public.donations for insert with check (true);

-- POSTS
create policy "posts publicados são públicos"
  on public.posts for select
  using (is_published or public.is_ong_member(ong_id));
create policy "membros publicam"
  on public.posts for all using (public.is_ong_member(ong_id));

-- DEVICE TOKENS
create policy "tokens próprios"
  on public.device_tokens for all
  using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

-- HEALTH RECORDS: ONG dona + tutor adotante
create policy "histórico visível à ONG e ao tutor"
  on public.health_records for select
  using (exists (select 1 from public.animals a where a.id = animal_id
                 and (public.is_ong_member(a.ong_id) or a.adopted_by = auth.uid())));
create policy "ONG e tutor registram eventos"
  on public.health_records for insert
  with check (exists (select 1 from public.animals a where a.id = animal_id
                      and (public.is_ong_member(a.ong_id) or a.adopted_by = auth.uid())));


-- =====================================================
-- STORAGE
-- =====================================================

insert into storage.buckets (id, name, public) values
  ('animal-photos', 'animal-photos', true),
  ('ong-logos',     'ong-logos',     true),
  ('avatars',       'avatars',       true),
  ('health-docs',   'health-docs',   false)
on conflict do nothing;

-- Leitura pública dos buckets públicos
create policy "leitura pública de imagens"
  on storage.objects for select
  using (bucket_id in ('animal-photos','ong-logos','avatars'));

-- Upload: convenção de path = {ong_id}/{animal_id}/{uuid}.jpg
create policy "membros da ONG enviam fotos de animais"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'animal-photos'
    and public.is_ong_member(((storage.foldername(name))[1])::uuid)
  );

create policy "usuário envia o próprio avatar"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
