-- Cria a tabela de ONGs (usando UUID e bool alinhados ao banco)
CREATE TABLE IF NOT EXISTS public.ongs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  address_id UUID REFERENCES public.adresses(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT,
  logo_url TEXT,
  cnpj TEXT,
  email TEXT,
  phone TEXT,
  whatsapp TEXT,
  instagram TEXT,
  website TEXT,
  is_verified BOOLEAN DEFAULT false NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Cria os tipos de papéis da ONG
CREATE TABLE IF NOT EXISTS public.ong_roles_types (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Cria a relação entre perfis e ONGs
CREATE TABLE IF NOT EXISTS public.ong_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profiles_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  ongs_id UUID NOT NULL REFERENCES public.ongs(id) ON DELETE CASCADE,
  ong_roles_types_id UUID REFERENCES public.ong_roles_types(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(profiles_id, ongs_id)
);

-- Adiciona a chave estrangeira na tabela animals
ALTER TABLE public.animals 
ADD COLUMN IF NOT EXISTS ongs_id UUID REFERENCES public.ongs(id) ON DELETE SET NULL;

-- Habilita Row Level Security e políticas de leitura pública
ALTER TABLE public.ongs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ong_roles_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ong_members ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Leitura pública de ongs" ON public.ongs FOR SELECT USING (true);
  CREATE POLICY "Leitura pública de tipos de papel" ON public.ong_roles_types FOR SELECT USING (true);
  CREATE POLICY "Leitura pública de membros" ON public.ong_members FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;