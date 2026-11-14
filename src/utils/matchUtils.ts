import { PetListItemDTO } from '@/dtos/animal.dto';

export interface AdopterMatchContext {
  isComplete: boolean;
  housingTypeId: number | null;
   housingTypeName?: string;
  hasChildren: boolean;
  hasOtherDogs: boolean;
  hasOtherCats: boolean;
  hoursAlonePerDay: number;
  firstTimeOwner: boolean;
  acceptsSpecialNeeds: boolean;
  preferredSpecies: string;
  preferredSizes: string[];
  matchVector: string;
}

/**
 * Gera a string de tokens vetoriais do adotante para persistir na coluna match_vector
 * da tabela adopter_preferences.
 */
export function buildAdopterMatchVector(prefs: {
  housingTypeId?: number | null;
  hasChildren?: boolean | null;
  hasOtherDogs?: boolean | null;
  hasOtherCats?: boolean | null;
  hoursAlonePerDay?: number | null;
  acceptsSpecialNeeds?: boolean | null;
  preferredSpecies?: string | null;
  preferredSizes?: string[] | null;
}): string {
  const tokens: string[] = [];

  if (prefs.hasChildren) tokens.push('kids_true');
  if (prefs.hasOtherDogs) tokens.push('dogs_true');
  if (prefs.hasOtherCats) tokens.push('cats_true');

  // IDs 3 e 4 na tabela housing_types correspondem a Apartamentos
  const needsApartmentFriendly = prefs.housingTypeId === 3 || prefs.housingTypeId === 4;
  if (needsApartmentFriendly) {
    tokens.push('apartment_true');
  }

  // Relaciona horas sozinho por dia com o nível de energia ideal do pet
  const hours = prefs.hoursAlonePerDay ?? 4;
  if (hours >= 6) {
    tokens.push('energy_low');
  } else if (hours >= 3) {
    tokens.push('energy_low', 'energy_medium');
  } else {
    tokens.push('energy_low', 'energy_medium', 'energy_high');
  }

  tokens.push(prefs.acceptsSpecialNeeds ? 'special_true' : 'special_false');

  if (prefs.preferredSpecies) {
    tokens.push(`species_${prefs.preferredSpecies}`);
  }

  if (Array.isArray(prefs.preferredSizes)) {
    prefs.preferredSizes.forEach((size) => tokens.push(`size_${size}`));
  }

  return tokens.join(' ');
}

/**
 * Verifica se o usuário atingiu 100% dos 9 critérios necessários para liberar o Match Inteligente.
 */
export function isUserMatchProfileComplete(
  profile: any,
  address: any,
  prefs: any
): boolean {
  if (!profile || !address || !prefs) return false;

  const hasPersonal =
    Boolean(profile.full_name?.trim()) &&
    Boolean(profile.cpf?.trim()) &&
    Boolean(profile.phone?.trim()) &&
    Boolean(profile.birth_date?.trim());

  const hasAddress =
    Boolean(address.postal_code?.trim()) && Boolean(address.street?.trim());

  const hasPrefs =
    prefs.housing_types_id != null &&
    prefs.hours_alone_per_day != null &&
    prefs.has_children != null &&
    Boolean(prefs.preferred_species);

  return hasPersonal && hasAddress && hasPrefs;
}

/**
 * Calcula a pontuação de afinidade (0 a 100) cruzando os vetores e atributos
 * do Adotante com as características e match_vector do Pet.
 */
export function calculatePetMatchScore(
  pet: PetListItemDTO,
  adopter: AdopterMatchContext
): number {
  const rawPrefs = pet.animals_preferences;
  const petPrefs = Array.isArray(rawPrefs) ? rawPrefs[0] : rawPrefs;

  let totalWeight = 0;
  let earnedWeight = 0;

  // 1. Espécie preferida (Peso 20)
  totalWeight += 20;
  if (
    !adopter.preferredSpecies ||
    adopter.preferredSpecies === 'all' ||
    adopter.preferredSpecies === pet.species
  ) {
    earnedWeight += 20;
  }

  // 2. Porte preferido (Peso 15)
  totalWeight += 15;
  if (
    !adopter.preferredSizes ||
    adopter.preferredSizes.length === 0 ||
    adopter.preferredSizes.includes(pet.size)
  ) {
    earnedWeight += 15;
  }

  // Se o animal não tiver preferências comportamentais cadastradas, retorna proporcional ao básico
  if (!petPrefs) {
    return Math.round((earnedWeight / totalWeight) * 100);
  }

  const petVectorStr = String(petPrefs.match_vector || '');

  // 3. Convivência com Crianças - Peso A (20 pontos)
  totalWeight += 20;
  if (adopter.hasChildren) {
    if (petPrefs.good_with_kids || petVectorStr.includes('kids_true')) {
      earnedWeight += 20;
    }
  } else {
    earnedWeight += 20; // Sem crianças em casa, qualquer pet é compatível neste quesito
  }

  // 4. Convivência com outros Cães - Peso A (15 pontos)
  totalWeight += 15;
  if (adopter.hasOtherDogs) {
    if (petPrefs.good_with_dogs || petVectorStr.includes('dogs_true')) {
      earnedWeight += 15;
    }
  } else {
    earnedWeight += 15;
  }

  // 5. Convivência com outros Gatos - Peso A (15 pontos)
  totalWeight += 15;
  if (adopter.hasOtherCats) {
    if (petPrefs.good_with_cats || petVectorStr.includes('cats_true')) {
      earnedWeight += 15;
    }
  } else {
    earnedWeight += 15;
  }

  // 6. Adequação ao Tipo de Moradia - Peso B (15 pontos)
  totalWeight += 15;
  const livesInApartment =
    adopter.housingTypeId === 3 ||
    adopter.housingTypeId === 4 ||
    Boolean(adopter.housingTypeName?.toLowerCase().includes('apartamento'));

  if (livesInApartment) {
    if (petPrefs.apartment_friendly || petVectorStr.includes('apartment_true')) {
      earnedWeight += 15;
    }
  } else {
    earnedWeight += 15;
  }

  // 7. Tempo sozinho vs Nível de Energia do Pet - Peso B (10 pontos)
  totalWeight += 10;
  const energy = petPrefs.energy;
  if (adopter.hoursAlonePerDay >= 6) {
    if (energy === 'low') earnedWeight += 10;
    else if (energy === 'medium') earnedWeight += 5;
  } else if (adopter.hoursAlonePerDay >= 3) {
    if (energy === 'low' || energy === 'medium') earnedWeight += 10;
    else earnedWeight += 6;
  } else {
    earnedWeight += 10;
  }

  // 8. Necessidades Especiais - Peso C (10 pontos)
  totalWeight += 10;
  if (petPrefs.special_needs) {
    if (adopter.acceptsSpecialNeeds) {
      earnedWeight += 10;
    }
  } else {
    earnedWeight += 10;
  }

  return Math.round((earnedWeight / totalWeight) * 100);
}