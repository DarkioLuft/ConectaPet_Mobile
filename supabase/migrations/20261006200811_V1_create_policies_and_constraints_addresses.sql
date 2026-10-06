-- Adiciona a restrição única na tabela states
ALTER TABLE states ADD CONSTRAINT unique_state_name_country UNIQUE (name, country_id);

-- Adiciona a restrição única na tabela cities
ALTER TABLE cities ADD CONSTRAINT unique_city_name_state UNIQUE (name, state_id);

-- Adiciona coluna para verificar se o endereço é público ou privado na tabela addresses
ALTER TABLE public.addresses ADD column IF NOT EXISTS is_public BOOLEAN NOT NULL DEFAULT FALSE;

-- Adiciona a coluna created_by vinculada ao usuário autenticado
alter table public.addresses 
add column if not exists created_by uuid references auth.users(id) default auth.uid();

-- Remove a restrição NOT NULL da coluna location na tabela addresses
alter table public.addresses 
alter column location drop not null;

-- Insere o país padrão (Brasil) na tabela countries
insert into public.countries (name, abbreviation)
values ('Brasil', 'BRA');

-- Todos podem visualizar países
create policy "Permitir leitura pública de países"
on public.countries
for select
using ( true );

-- Todos podem visualizar estados
create policy "Permitir leitura pública de estados"
on public.states
for select
using ( true );

-- Apenas usuários autenticados podem inserir estados.
create policy "Apenas autenticados podem inserir estados"
on public.states
for insert
to authenticated
with check ( true );

-- Todos podem visualizar cidades
create policy "Permitir leitura pública de cidades"
on public.cities
for select
using ( true );

-- Apenas usuários autenticados podem inserir cidades. 
create policy "Apenas autenticados podem inserir cidades"
on public.cities
for insert
to authenticated
with check ( true );

-- Apenas usuários autenticados podem inserir endereços.
create policy "Apenas autenticados podem inserir endereços"
on public.addresses
for insert
to authenticated
with check ( true );

-- Permitir que usuários autenticados vejam seus próprios endereços, endereços públicos ou que recém criaram
create policy "Ver endereços públicos, próprios ou recém-criados"
on public.addresses
for select
to authenticated
using (
  is_public = true
  or created_by = auth.uid()
  or id in (
    select address_id 
    from public.profiles 
    where id = auth.uid()
  )
);