import { AnimalAndPreferencesDTO, AnimalDTO, AnimalPreferencesDTO, PetListItemDTO } from '@/dtos/animal.dto';
import { animalPhotoService } from './animalPhotoService';
import { animalPreferencesService } from './animalPreferencesService';
import { authService } from './authService';
import { supabase } from './supabase';

const ANIMALS_TABLE_NAME = 'animals';

const PREFERENCES_KEYS = [
  'energy', 'good_with_kids', 'good_with_dogs', 'good_with_cats',
  'apartment_friendly', 'special_needs', 'special_needs_desc'
];

export const animalService = {
  async getAnimalById(animalId: string) {
    const { data, error } = await supabase
      .from(ANIMALS_TABLE_NAME)
      .select('*')
      .eq('id', animalId)
      .single()

    if (error) {
      throw new Error(`Erro ao buscar dados do animal: ${error.message}`)
    }

    return data as unknown as AnimalDTO
  },

  async getAnimalDataAndPreferencesByAnimalId(animalId: string) {
    const { data, error } = await supabase
      .from('animals')
      .select(`
    *,
    ...animals_preferences (*)
  `)
      .eq('id', animalId)
      .single()

    if (error) {
      throw new Error(`Erro ao buscar dados completos do animal: ${error.message}`)
    }

    return data as unknown as AnimalAndPreferencesDTO
  },

  async insert(animalData: any) {
    const { data, error } = await supabase
      .from(ANIMALS_TABLE_NAME)
      .insert([animalData])
      .select()
      .single()

    if (error) throw new Error(`Erro ao criar animal: ${error.message}`)

    return data
  },

  async update(animalData: any, animalId: string) {
    const { data, error } = await supabase
      .from(ANIMALS_TABLE_NAME)
      .update([animalData])
      .eq('id', animalId)
      .select()
      .single()

    if (error) throw new Error(`Erro ao atualizar animal: ${error.message}`)

    return data
  },

  async createAnimal(animal: AnimalAndPreferencesDTO) {
    const user = await authService.getAuthenticatedUser();
    if (!user) throw new Error('Usuário não autenticado.');

    try {
      const {
        energy,
        good_with_kids,
        good_with_dogs,
        good_with_cats,
        apartment_friendly,
        special_needs,
        special_needs_desc,
        // Pega o resto e guarda na variável
        ...animalData
      } = animal;

      const newAnimal = await this.insert({
        ...animalData,
        created_by: user.id,
        status: 'available'
      });

      if (!newAnimal || !newAnimal.id) {
        throw new Error('Erro ao cadastrar animal.');
      }

      await animalPreferencesService.insert({
        animal_id: newAnimal.id,
        energy,
        good_with_kids,
        good_with_dogs,
        good_with_cats,
        apartment_friendly,
        special_needs,
        special_needs_desc,
      } as unknown as AnimalPreferencesDTO);

      if (animal.cover_photo_url) {
        const fileName = animal.cover_photo_url.split('/').pop() || 'unknown.jpg';

        await animalPhotoService.insert({
          animal_id: newAnimal.id,
          storage_path: fileName,
          public_url: animal.cover_photo_url,
          is_cover: true,
          is_active: true,
          sort_order: 1
        })
      }

      return newAnimal;

    } catch (error: any) {
      throw new Error(`Falha ao salvar dados complementares. Operação desfeita. Detalhes: ${error.message}`);
    }
  },

  async updateAnimal(animalId: string, animal: AnimalAndPreferencesDTO) {
    const user = await authService.getAuthenticatedUser();
    if (!user) throw new Error('Usuário não autenticado.');

    console.log("SERVICE")
    console.log(animal)
    console.log("SERVICE")

    try {
      // Remove elementos indesejados
      const { photoUri, match_vector, animal_id, ...rest } = animal as any;

      // Prepara os dois objetos separados
      const animalData: any = {};
      const preferencesData: any = { animal_id: animalId }; // Garante o ID da relação

      // Varre as propriedades restantes e distribuímos
      for (const [key, value] of Object.entries(rest)) {
        if (PREFERENCES_KEYS.includes(key)) {
          preferencesData[key] = value;
        } else {
          animalData[key] = value;
        }
      }

      // Chamadas limpas para o banco
      await this.update(animalData as AnimalDTO, animalId);
      await animalPreferencesService.update(preferencesData as AnimalPreferencesDTO, animalId);

      if (animal.cover_photo_url) {
        const fileName = animal.cover_photo_url.split('/').pop() || 'unknown.jpg';

        await animalPhotoService.update({
          animal_id: animalId,
          storage_path: fileName,
          public_url: animal.cover_photo_url,
          is_cover: true,
          is_active: true,
          sort_order: 1,
          updated_at: new Date().toISOString()
        })
      }

      return animal;
    } catch (error: any) {
      throw new Error(`Falha ao atualizar animal. Detalhes: ${error.message}`);
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