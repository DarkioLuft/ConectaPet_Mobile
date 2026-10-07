import { CreateAnimalPhotoDTO, UpdateAnimalPhotoDTO } from "@/dtos/animal.dto";
import { supabase } from "./supabase";

const ANIMAL_PHOTO_TABLE_NAME = 'animal_photos';

export const animalPhotoService = {
    async insert(photoData: CreateAnimalPhotoDTO) {
        const { data, error } = await supabase
            .from(ANIMAL_PHOTO_TABLE_NAME)
            .insert([photoData])
            .select()
            .single()

        if (error) throw new Error(`Erro ao inserir foto do animal: ${error.message}`)

        return data
    },

    async update(photoData: UpdateAnimalPhotoDTO) {
        const { data, error } = await supabase
            .from(ANIMAL_PHOTO_TABLE_NAME)
            .update([photoData])
            .eq('animal_id', photoData.animal_id)
            .select()
            .single()

        if (error) throw new Error(`Erro ao atualizar foto do animal: ${error.message}`)

        return data
    }
}