-- Insere a cidade de Arroio do Meio caso ainda não exista
INSERT INTO public.cities (id, state_id, name)
SELECT 
  gen_random_uuid(), 
  s.id, 
  'Arroio do Meio'
FROM public.states s
WHERE s.name ILIKE '%Rio Grande do Sul%'
AND NOT EXISTS (
  SELECT 1 FROM public.cities WHERE name ILIKE '%Arroio do Meio%'
);

-- Insere o endereço oficial da APAAM com geolocalização PostGIS
INSERT INTO public.addresses (id, city_id, street, number, district, postal_code, location, is_public)
VALUES (
  gen_random_uuid(),
  (SELECT id FROM public.cities WHERE name ILIKE '%Arroio do Meio%' LIMIT 1),
  'Dom Pedro II',
  'S/N',
  'Centro',
  '95940000',
  ST_SetSRID(ST_MakePoint(-51.942209, -29.396414), 4326)::geography,
  true
);

-- Vincula o endereço à APAAM
UPDATE public.ongs
SET address_id = (
  SELECT id FROM public.addresses 
  WHERE street = 'Dom Pedro II' 
  ORDER BY created_at DESC 
  LIMIT 1
)
WHERE name = 'APAAM';