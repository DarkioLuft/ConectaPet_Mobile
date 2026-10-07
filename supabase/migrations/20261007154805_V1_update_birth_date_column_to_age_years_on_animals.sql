-- Cria a nova coluna para armazenar a idade como número inteiro
ALTER TABLE animals 
ADD COLUMN age_years INT;

-- Calcula a idade atual com base na birth_date e salvar na nova coluna
UPDATE animals 
SET age_years = EXTRACT(YEAR FROM AGE(NOW(), birth_date));

-- 3. Remove a coluna antiga de data de nascimento
ALTER TABLE animals 
DROP COLUMN birth_date;