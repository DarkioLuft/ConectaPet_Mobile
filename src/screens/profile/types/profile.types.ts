export type ProfileTabType = 'personal' | 'address' | 'preferences';

export interface PersonalFormData {
  fullName: string;
  email: string;
  cpf: string;
  phone: string;
  birthDate: string;
  avatarUrl: string | null;
}

export interface AddressFormData {
  postalCode: string;
  street: string;
  number: string;
  complement: string;
  district: string;
  city: string;
  state: string;
}

export interface AdopterPreferencesFormData {
  housingTypeId: number | null;
  hasChildren: boolean | null;
  childrenAgeMin?: number | null;
  hasOtherDogs: boolean | null;
  hasOtherCats: boolean | null;
  hoursAlonePerDay: number | null;
  firstTimeOwner: boolean | null;
  acceptsSpecialNeeds: boolean | null;
  preferredSpecies: 'dog' | 'cat' | 'all' | null;
  preferredSizes: string[]; // ['small', 'medium', 'large']
}

export interface HousingTypeOption {
  id: number;
  name: string;
}