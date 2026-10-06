-- Permite que qualquer pessoa veja/baixe as fotos de perfil (Leitura pública)
create policy "Fotos de perfil são públicas para leitura"
on storage.objects for select
to public
using ( bucket_id = 'profile-photos' );

-- Permite que usuários autenticados façam upload na própria pasta/nome de arquivo
create policy "Usuários podem enviar sua própria foto de perfil"
on storage.objects for insert
to authenticated
with check ( bucket_id = 'profile-photos' );

-- Permite atualização
create policy "Usuários podem atualizar sua própria foto de perfil"
on storage.objects for update
to authenticated
using ( bucket_id = 'profile-photos' )
with check ( bucket_id = 'profile-photos' );

-- Permite deleção
create policy "Usuários podem deletar sua própria foto de perfil"
on storage.objects for delete
to authenticated
using ( bucket_id = 'profile-photos' );