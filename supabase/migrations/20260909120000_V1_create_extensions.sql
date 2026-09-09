create extension if not exists "uuid-ossp";
create extension if not exists postgis with schema extensions;      -- busca por raio

-- O PostGIS vive no schema 'extensions' no Supabase; inclua-o no caminho de busca
-- para que os tipos (geography) e funcoes (st_*) resolvam durante este script.
set search_path = public, extensions;