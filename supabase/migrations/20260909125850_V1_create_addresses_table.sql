create table public.countries (
    id              uuid primary key default gen_random_uuid(),
    name            text not null unique,
    abbreviation    char(5) not null unique,
    created_at      timestamptz not null default now(),
    updated_at      timestamptz not null default now()
);

create table public.states (
    id              uuid primary key default gen_random_uuid(),
    country_id      uuid not null references public.countries(id) on delete cascade,
    name            text not null unique,
    abbreviation    char(5) not null unique,
    created_at      timestamptz not null default now(),
    updated_at      timestamptz not null default now()
);

create table public.cities (
    id              uuid primary key default gen_random_uuid(),
    state_id        uuid not null references public.states(id) on delete cascade,
    name            text not null,
    created_at      timestamptz not null default now(),
    updated_at      timestamptz not null default now()
);

create table public.adresses (
    id              uuid primary key default gen_random_uuid(),
    city_id         uuid not null references public.cities(id) on delete cascade,
    street          text not null,
    number          text not null,
    district        text not null,
    complement      text,
    postal_code     char(9) not null,
    location        geography(point, 4326) not null,
    created_at      timestamptz not null default now(),
    updated_at      timestamptz not null default now()
);

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

alter table public.countries enable row level security;
alter table public.states enable row level security;
alter table public.cities enable row level security;
alter table public.addresses enable row level security;