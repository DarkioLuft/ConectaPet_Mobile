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
  ong_id?: string;
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
    const { ong_id, age_years, ...animalData } = animal;

    let targetOngId = ong_id;
    if (!targetOngId) {
      const { data: defaultOng, error: ongError } = await supabase
        .from('ongs')
        .select('id')
        .limit(1)
        .single();

      if (ongError || !defaultOng) {
        throw new Error('Nenhuma ONG cadastrada foi encontrada no banco.');
      }
      targetOngId = defaultOng.id;
    }

    // Calcula a data de nascimento aproximada com base nos anos digitados
    let calculatedBirthDate = animal.birth_date;
    if (!calculatedBirthDate && age_years !== undefined) {
      const d = new Date();
      d.setFullYear(d.getFullYear() - Math.floor(age_years));
      const months = Math.round((age_years % 1) * 12);
      d.setMonth(d.getMonth() - months);
      calculatedBirthDate = d.toISOString().split('T')[0];
    }

    const { data, error } = await supabase
      .from('animals')
      .insert([
        {
          ...animalData,
          birth_date: calculatedBirthDate,
          ong_id: targetOngId,
          created_by: user?.id ?? null,
          status: 'available',
        },
      ])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },
};