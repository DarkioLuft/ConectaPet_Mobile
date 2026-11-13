-- Anúncios do carrossel da tela inicial.
-- A ordem de exibição é a ordem de cadastro (created_at crescente).
-- Reversão: supabase/rollbacks/20261027140000_V1_create_announcements_table.down.sql

create table public.announcements (
  id          uuid primary key default gen_random_uuid(),
  ongs_id     uuid references public.ongs(id) on delete set null,
  created_by  uuid not null references public.profiles(id),
  title       text not null check (char_length(trim(title)) between 1 and 120),
  subtitle    text not null check (char_length(trim(subtitle)) between 1 and 240),
  image_url   text not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index announcements_created_at_idx on public.announcements (created_at asc);

alter table public.announcements enable row level security;

create policy "Leitura pública de anúncios"
  on public.announcements for select
  using (true);

create policy "Autenticados gerenciam anúncios"
  on public.announcements for all
  to authenticated
  using (true)
  with check (true);

insert into storage.buckets (id, name, public)
values ('announcement-photos', 'announcement-photos', true)
on conflict (id) do nothing;

create policy "Fotos de anúncios são públicas para leitura"
  on storage.objects for select
  to public
  using (bucket_id = 'announcement-photos');

create policy "Autenticados enviam fotos de anúncios"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'announcement-photos');

create policy "Autenticados atualizam fotos de anúncios"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'announcement-photos')
  with check (bucket_id = 'announcement-photos');

create policy "Autenticados removem fotos de anúncios"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'announcement-photos');
