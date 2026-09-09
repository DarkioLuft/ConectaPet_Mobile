create extension if not exists "uuid-ossp";
create extension if not exists postgis with schema extensions;      -- busca por raio

-- O PostGIS vive no schema 'extensions' no Supabase; inclua-o no caminho de busca
-- para que os tipos (geography) e funcoes (st_*) resolvam durante este script.
set search_path = public, extensions;

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

create table public.profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  address_id      uuid references public.adresses(id) on delete cascade,
  full_name       text not null,
  email           text not null unique,
  cpf             varchar(11) not null unique,
  birth_date      date not null,
  avatar_url      text,
  phone           text not null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);


-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

alter table public.profiles            enable row level security;
alter table public.cities              enable row level security;
alter table public.states              enable row level security;
alter table public.countries           enable row level security;

-- PROFILES
create policy "perfis são públicos para leitura"
  on public.profiles for select using (true);
create policy "usuário edita o próprio perfil"
  on public.profiles for update using (auth.uid() = id);


-- =====================================================
-- FUNÇÕES
-- =====================================================

-- Verifica permissões
CREATE OR REPLACE FUNCTION public.has_permission(_user_id uuid, _required_permission text)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.role_permissions rp ON ur.role_id = rp.role_id
    JOIN public.permissions p ON p.id = rp.permission_id
    WHERE ur.profile_id = _user_id 
      AND p.slug = _required_permission
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Exemplo de uso: 
CREATE POLICY "Apenas usuários com permissão podem deletar pets" ON public.animals FOR DELETE USING ( public.has_permission(auth.uid(), 'pets:delete') ); 

-- Criação de novo usuário (trigger para salvar na tabela profiles)
-- Criação da Função
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, cpf, phone, avatar_url, birth_date)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'email',
    NEW.raw_user_meta_data->>'cpf',
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'avatar_url',
    (NEW.raw_user_meta_data->>'birth_date')::date
  );

  -- Limpa os metadados brutos do auth.users
  NEW.raw_user_meta_data := '{}'::jsonb;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 
-- O "SECURITY DEFINER" permite que o gatilho ignore o RLS e tenha permissão de inserir na tabela profiles em nome do sistema.

-- Associação do Gatilho à tabela auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
