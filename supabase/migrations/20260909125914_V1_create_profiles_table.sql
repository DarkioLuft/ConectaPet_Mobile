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

alter table public.profiles enable row level security;

-- =====================================================
-- POLICIES
-- =====================================================

create policy "perfis são públicos para leitura"
  on public.profiles for select using (true);
create policy "usuário edita o próprio perfil"
  on public.profiles for update using (auth.uid() = id);

-- =====================================================
-- FUNCTIONS
-- =====================================================

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