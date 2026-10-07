import { AgeGroupEnum, EnergyEnum, SexEnum, SizeEnum, SpeciesEnum } from "@/types/animal.types";

export interface AnimalAndPreferencesDTO extends AnimalDTO, AnimalPreferencesDTO {}

export type CreateAnimalDTO = Omit<AnimalDTO, 'id' | 'created_at' | 'created_by'>;

export interface AnimalDTO {
    id: string;
    ongs_id?: string;
    created_by: string;
    adopted_by?: string;
    name: string;
    sex: SexEnum;
    size: SizeEnum;
    age_group: AgeGroupEnum;
    species: SpeciesEnum;
    breed?: string;
    age_years?: number;
    weight_kg?: number;
    color?: string;
    description?: string;
    is_vaccinated: boolean;
    is_neutered: boolean;
    is_dewormed: boolean;
    has_microchip: boolean;
    status: string;
    cover_photo_url?: string;
    views_count: number;
    published_at?: string;
    adopted_at?: string;
    created_at: string;
    updated_at?: string;
}

export interface AnimalPreferencesDTO {
    animal_id: string;
    energy: EnergyEnum;
    good_with_kids: boolean;
    good_with_dogs: boolean;
    good_with_cats: boolean;
    apartment_friendly: boolean;
    special_needs: boolean;
    special_needs_desc?: string;
    match_vector: string;
    created_at: string;
    updated_at?: string;
}

export interface CreateAnimalFormData {
    // Etapa 1: Identificação Básica
    name: string;
    species: SpeciesEnum | null;
    sex: SexEnum | null;
    size: SizeEnum | null;
    age_group: AgeGroupEnum | null;
    age_years: string;
    weight_kg: string;
    color: string;

    // Etapa 2: Histórico e Saúde
    description: string;
    is_vaccinated: boolean | null;
    is_neutered: boolean | null;
    is_dewormed: boolean | null;
    has_microchip: boolean | null;

    // Etapa 3: Preferências de Convivência
    energy: EnergyEnum | null;
    good_with_kids: boolean | null;
    good_with_dogs: boolean | null;
    good_with_cats: boolean | null;
    apartment_friendly: boolean | null;
    special_needs: boolean | null;
    special_needs_desc: string;

    // Etapa 4: Imagem de Capa
    photoUri: string | null;
}

export interface UpdateAnimalFormData extends CreateAnimalFormData {
    id: string;
    created_at: string;
    updated_at: string;
}

export interface PetListItemDTO {
    id: string;
    name: string;
    species: SpeciesEnum;
    sex: SexEnum;
    size: SizeEnum;
    age_group: AgeGroupEnum;
    is_vaccinated: boolean;
    cover_photo_url: string | null;
    ongs: {
        name: string;
    } | null;
}

export interface AnimalPhotoDTO {
    id: string,
    animal_id: string,
    storage_path: string,
    public_url: string,
    sort_order: number,
    is_cover: boolean,
    is_active: boolean,
    created_at: string,
    updated_at: string
}

export type CreateAnimalPhotoDTO = Omit<AnimalPhotoDTO, 'id' | 'created_at' | 'updated_at'>
export type UpdateAnimalPhotoDTO = Omit<AnimalPhotoDTO, 'id' | 'created_at'>