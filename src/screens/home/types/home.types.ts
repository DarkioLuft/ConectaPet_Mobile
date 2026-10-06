// Contratos de dados da tela inicial, cards de animais e notícias mockadas.
export type CategoryFilter = 'all' | 'dog' | 'cat' | 'other';

export interface HomePetCardData {
  id: string;
  name: string;
  species: 'dog' | 'cat' | 'other';
  sex: 'male' | 'female';
  size: 'small' | 'medium' | 'large';
  age_group: 'puppy' | 'young' | 'adult' | 'senior';
  isVaccinated: boolean;
  coverPhotoUrl: string | null;
  ongName: string;
}

export interface BannerItem {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
}