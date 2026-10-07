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

export interface PetListItemDTO {
  id: string;
  name: string;
  species: 'dog' | 'cat' | 'other';
  sex: 'male' | 'female';
  size: 'small' | 'medium' | 'large';
  age_group: 'puppy' | 'young' | 'adult' | 'senior';
  is_vaccinated: boolean;
  cover_photo_url: string | null;
  ongs: {
    name: string;
  } | null;
}

export const animalService = {
  async createAnimal(animal: CreateAnimalDTO) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado.');

    let calculatedBirthDate = animal.birth_date;
    if (!calculatedBirthDate && animal.age_years !== undefined) {
      const d = new Date();
      d.setFullYear(d.getFullYear() - Math.floor(animal.age_years));
      const months = Math.round((animal.age_years % 1) * 12);
      d.setMonth(d.getMonth() - months);
      calculatedBirthDate = d.toISOString().split('T')[0];
    }

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
      status: 'available',
    };

    const { data: createdAnimal, error: animalError } = await supabase
      .from('animals')
      .insert([animalData])
      .select('id')
      .single();

    if (animalError) throw new Error(`Erro ao criar animal: ${animalError.message}`);

    const animalId = createdAnimal.id;

    try {
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

      if (animal.cover_photo_url) {
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
      await supabase.from('animals').delete().eq('id', animalId);
      throw new Error(`Falha ao salvar dados complementares. Operação desfeita. Detalhes: ${error.message}`);
    }
  },

  async getAvailablePets(speciesFilter?: string): Promise<PetListItemDTO[]> {
    let query = supabase
      .from('animals')
      .select(`
        id,
        name,
        species,
        sex,
        size,
        age_group,
        is_vaccinated,
        cover_photo_url,
        ongs ( name )
      `)
      .order('created_at', { ascending: false });

    if (speciesFilter && speciesFilter !== 'all') {
      query = query.eq('species', speciesFilter);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return (data as unknown as PetListItemDTO[]) || [];
  },

  async checkUserIsVolunteer(userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('ong_members')
      .select('id')
      .eq('profiles_id', userId)
      .limit(1);

    if (error || !data) return false;
    return data.length > 0;
  },
};