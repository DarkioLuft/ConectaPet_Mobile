import { supabase } from './supabase';

export interface CreateAnimalDTO {
  name: string;
  species: 'dog' | 'cat' | 'other';
  sex: 'male' | 'female';
  size: 'small' | 'medium' | 'large';
  age_group: 'puppy' | 'young' | 'adult' | 'senior';
  age_years?: number;
  birth_date?: string;
  weight_kg?: number;
  color?: string;
  description?: string;
  is_vaccinated: boolean;
  is_neutered: boolean;
  is_dewormed: boolean;
  has_microchip: boolean;
  energy: 'low' | 'medium' | 'high';
  good_with_kids: boolean;
  good_with_dogs: boolean;
  good_with_cats: boolean;
  apartment_friendly: boolean;
  special_needs: boolean;
  special_needs_desc?: string;
  cover_photo_url?: string;
}

export const animalService = {
  // ... uploadAnimalPhoto permanece igual ...
  async uploadAnimalPhoto(uri: string, animalName: string): Promise<string> {
    const response = await fetch(uri);
    const blob = await response.blob();
    const fileExt = uri.split('.').pop()?.toLowerCase() ?? 'jpg';
    const cleanName = animalName.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const fileName = `${Date.now()}_${cleanName}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('animal-photos')
      .upload(fileName, blob, {
        contentType: `image/${fileExt}`,
        upsert: false,
      });

    if (uploadError) throw new Error(`Falha no upload da foto: ${uploadError.message}`);

    const { data } = supabase.storage
      .from('animal-photos')
      .getPublicUrl(fileName);
    return data.publicUrl;

  },

  async createAnimal(animal: CreateAnimalDTO) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado.');

    // 1. Calcula a data de nascimento
    let calculatedBirthDate = animal.birth_date;
    if (!calculatedBirthDate && animal.age_years !== undefined) {
      const d = new Date();
      d.setFullYear(d.getFullYear() - Math.floor(animal.age_years));
      const months = Math.round((animal.age_years % 1) * 12);
      d.setMonth(d.getMonth() - months);
      calculatedBirthDate = d.toISOString().split('T')[0];
    }

    // 2. Isola os dados da tabela principal (animals)
    const animalData = {
      name: animal.name,
      species: animal.species,
      sex: animal.sex,
      size: animal.size,
      age_group: animal.age_group,
      birth_date: calculatedBirthDate,
      weight_kg: animal.weight_kg,
      color: animal.color,
      description: animal.description,
      is_vaccinated: animal.is_vaccinated,
      is_neutered: animal.is_neutered,
      is_dewormed: animal.is_dewormed,
      has_microchip: animal.has_microchip,
      cover_photo_url: animal.cover_photo_url,
      created_by: user.id,
      status: 'available'
    };

    // INSERÇÃO 1: Cria o animal
    const { data: createdAnimal, error: animalError } = await supabase
      .from('animals')
      .insert([animalData])
      .select('id')
      .single();

    if (animalError) throw new Error(`Erro ao criar animal: ${animalError.message}`);

    const animalId = createdAnimal.id;

    try {
      // INSERÇÃO 2: Cria as preferências usando o ID do animal
      const preferencesData = {
        animal_id: animalId,
        energy: animal.energy,
        good_with_kids: animal.good_with_kids,
        good_with_dogs: animal.good_with_dogs,
        good_with_cats: animal.good_with_cats,
        apartment_friendly: animal.apartment_friendly,
        special_needs: animal.special_needs,
        special_needs_desc: animal.special_needs_desc,
      };

      const { error: prefError } = await supabase
        .from('animals_preferences')
        .insert([preferencesData]);

      if (prefError) throw prefError;

      // INSERÇÃO 3: Registra a foto se existir
      if (animal.cover_photo_url) {
        // Extrai o nome do arquivo da URL para o storage_path
        const fileName = animal.cover_photo_url.split('/').pop() || 'unknown.jpg';

        const photoData = {
          animal_id: animalId,
          storage_path: fileName,
          public_url: animal.cover_photo_url,
          is_cover: true,
        };

        const { error: photoError } = await supabase
          .from('animal_photos')
          .insert([photoData]);

        if (photoError) throw photoError;
      }

      return createdAnimal;

    } catch (error: any) {
      // Compensação manual (Rollback fake) se algo der errado nas tabelas dependentes
      await supabase.from('animals').delete().eq('id', animalId);
      throw new Error(`Falha ao salvar dados complementares. Operação desfeita. Detalhes: ${error.message}`);
    }
  },
};