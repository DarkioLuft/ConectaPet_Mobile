-- Reverte supabase/migrations/20261027140000_V1_create_announcements_table.sql
-- Cole no SQL Editor e execute. Esta pasta não entra no supabase db push.
-- Apaga anúncios cadastrados e as fotos do bucket announcement-photos.

drop policy if exists "Fotos de anúncios são públicas para leitura" on storage.objects;
drop policy if exists "Autenticados enviam fotos de anúncios" on storage.objects;
drop policy if exists "Autenticados atualizam fotos de anúncios" on storage.objects;
drop policy if exists "Autenticados removem fotos de anúncios" on storage.objects;

delete from storage.objects where bucket_id = 'announcement-photos';
delete from storage.buckets where id = 'announcement-photos';

drop table if exists public.announcements;

-- Se a migration entrou pelo CLI, apague o registro para poder aplicá-la de novo:
-- delete from supabase_migrations.schema_migrations where version = '20261027140000';
