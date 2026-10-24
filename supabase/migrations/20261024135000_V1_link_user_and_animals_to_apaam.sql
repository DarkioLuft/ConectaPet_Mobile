-- 1. Garante o vínculo do usuário na tabela ong_members com a APAAM
INSERT INTO public.ong_members (profiles_id, ongs_id)
SELECT 
  'cc97421b-1c04-4f00-8679-4ec39c316f3b',
  id
FROM public.ongs 
WHERE name = 'APAAM'
  AND EXISTS (SELECT 1 FROM public.profiles WHERE id = 'cc97421b-1c04-4f00-8679-4ec39c316f3b')
ON CONFLICT (profiles_id, ongs_id) DO NOTHING;

-- 2. Atualiza animais existentes desse usuário que estavam sem ONG vinculada
UPDATE public.animals
SET ongs_id = (SELECT id FROM public.ongs WHERE name = 'APAAM' LIMIT 1)
WHERE created_by = 'cc97421b-1c04-4f00-8679-4ec39c316f3b'
  AND ongs_id IS NULL;