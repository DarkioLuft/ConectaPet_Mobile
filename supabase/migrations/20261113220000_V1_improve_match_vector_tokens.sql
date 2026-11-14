-- Atualiza a coluna gerada match_vector em animals_preferences usando expressões 100% IMMUTABLE
ALTER TABLE public.animals_preferences
DROP COLUMN IF EXISTS match_vector;

ALTER TABLE public.animals_preferences
ADD COLUMN match_vector tsvector GENERATED ALWAYS AS (
  setweight(to_tsvector('simple'::regconfig, CASE WHEN good_with_kids IS TRUE THEN 'kids_true' ELSE 'kids_false' END), 'A') ||
  setweight(to_tsvector('simple'::regconfig, CASE WHEN good_with_dogs IS TRUE THEN 'dogs_true' ELSE 'dogs_false' END), 'A') ||
  setweight(to_tsvector('simple'::regconfig, CASE WHEN good_with_cats IS TRUE THEN 'cats_true' ELSE 'cats_false' END), 'A') ||
  setweight(to_tsvector('simple'::regconfig, CASE WHEN apartment_friendly IS TRUE THEN 'apartment_true' ELSE 'apartment_false' END), 'B') ||
  setweight(to_tsvector('simple'::regconfig, CASE 
    WHEN energy = 'low'::public.energy_level THEN 'energy_low'
    WHEN energy = 'high'::public.energy_level THEN 'energy_high'
    ELSE 'energy_medium'
  END), 'B') ||
  setweight(to_tsvector('simple'::regconfig, CASE WHEN special_needs IS TRUE THEN 'special_true' ELSE 'special_false' END), 'C') ||
  setweight(to_tsvector('english'::regconfig, coalesce(special_needs_desc, '')), 'D')
) STORED;

-- Índice GIN para acelerar consultas vetoriais no match_vector
CREATE INDEX IF NOT EXISTS idx_animals_preferences_match_vector
ON public.animals_preferences USING GIN (match_vector);