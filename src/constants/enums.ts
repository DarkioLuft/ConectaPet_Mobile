/** Rotulos PT-BR dos enums do banco. As chaves espelham os enums do PostgreSQL. */

export const SPECIES_LABELS = {
  dog: 'Cachorro',
  cat: 'Gato',
  other: 'Outro',
} as const;

export const SEX_LABELS = {
  male: 'Macho',
  female: 'Femea',
} as const;

export const SIZE_LABELS = {
  small: 'Pequeno',
  medium: 'Medio',
  large: 'Grande',
} as const;

export const AGE_GROUP_LABELS = {
  puppy: 'Filhote',
  young: 'Jovem',
  adult: 'Adulto',
  senior: 'Idoso',
} as const;

export const ENERGY_LABELS = {
  low: 'Calmo',
  medium: 'Moderado',
  high: 'Agitado',
} as const;

export const ANIMAL_STATUS_LABELS = {
  draft: 'Rascunho',
  available: 'Disponivel',
  in_process: 'Em processo',
  adopted: 'Adotado',
  unavailable: 'Indisponivel',
} as const;

export const HOUSING_LABELS = {
  apartment: 'Apartamento',
  house_no_yard: 'Casa sem patio',
  house_with_yard: 'Casa com patio',
  rural: 'Zona rural',
} as const;

export const INTEREST_STATUS_LABELS = {
  new: 'Novo',
  contacted: 'Contatado',
  in_review: 'Em analise',
  approved: 'Aprovado',
  rejected: 'Recusado',
  completed: 'Concluido',
  cancelled: 'Cancelado',
} as const;

export const POST_TYPE_LABELS = {
  news: 'Noticia',
  campaign: 'Campanha',
  event: 'Evento',
  urgent: 'Urgente',
} as const;
