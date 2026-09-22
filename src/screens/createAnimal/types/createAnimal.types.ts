// Tipos e interfaces do formulário de cadastro, alinhados aos enums do banco.

import {
  AGE_GROUP_LABELS,
  ENERGY_LABELS,
  SEX_LABELS,
  SIZE_LABELS,
  SPECIES_LABELS,
} from '../../../constants/enums';

export type SpeciesEnum = keyof typeof SPECIES_LABELS;
export type SexEnum = keyof typeof SEX_LABELS;
export type SizeEnum = keyof typeof SIZE_LABELS;
export type AgeGroupEnum = keyof typeof AGE_GROUP_LABELS;
export type EnergyEnum = keyof typeof ENERGY_LABELS;

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