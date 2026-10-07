import { AnimalPreferencesDTO } from "@/dtos/animal.dto";
import { supabase } from "./supabase";

const ANIMALS_PREFERENCES_TABLE_NAME = 'animals_preferences'

const PREFERENCES_KEYS = [
  'energy', 'good_with_kids', 'good_with_dogs', 'good_with_cats',
  'apartment_friendly', 'special_needs', 'special_needs_desc'
];

export const animalPreferencesService = {
    async insert(preferences: AnimalPreferencesDTO) {
        const { data, error } = await supabase
            .from(ANIMALS_PREFERENCES_TABLE_NAME)
            .insert([preferences])
            .select()
            .single()

        if (error) throw new Error(`Erro ao salvar preferências do animal: ${error.message}`)

        return data
    },

    async update(preferences: AnimalPreferencesDTO, animalId: string) {
        const { data, error } = await supabase
            .from(ANIMALS_PREFERENCES_TABLE_NAME)
            .update([preferences])
            .eq('animal_id', animalId)
            .select()
            .single()

        if (error) throw new Error(`Erro ao atualizar preferências do animal: ${error.message}`)

        return data
    },

    async getAnimalPreferencesByAnimalId(animalId: string) {
        const { data, error } = await supabase
            .from(ANIMALS_PREFERENCES_TABLE_NAME)
            .select('*')
            .eq('animal_id', animalId)
            .single()

        if (error) {
            throw new Error(`Erro ao buscar preferências do animal: ${error.message}`)
        }

        return data as unknown as AnimalPreferencesDTO
    },
}