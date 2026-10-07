import {
    AGE_GROUP_LABELS,
    ENERGY_LABELS,
    SEX_LABELS,
    SIZE_LABELS,
    SPECIES_LABELS,
} from '@/constants/enums';
import { CreateAnimalFormData, UpdateAnimalFormData } from '@/dtos/animal.dto';

export type SpeciesEnum = keyof typeof SPECIES_LABELS;
export type SexEnum = keyof typeof SEX_LABELS;
export type SizeEnum = keyof typeof SIZE_LABELS;
export type AgeGroupEnum = keyof typeof AGE_GROUP_LABELS;
export type EnergyEnum = keyof typeof ENERGY_LABELS;

// Junta todas as chaves de ambos os formulários em um só lugar
export type AnyAnimalForm = Partial<CreateAnimalFormData & UpdateAnimalFormData>;