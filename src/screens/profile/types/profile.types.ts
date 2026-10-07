export type ProfileTabType = 'personal' | 'address' | 'preferences';

export type PreferredSpecies = 'dog' | 'cat' | 'all';

export type PreferredSizes = 'small' | 'medium' | 'large';

export interface PersonalFormData {
  fullName: string;
  email: string;
  cpf: string;
  phone: string;
  birthDate: string;
  avatarUrl: string;
}

export interface AddressFormData {
  addressId: string | null;
  postalCode: string;
  street: string;
  number: string;
  complement: string | null;
  district: string;
  location: string | null;
  cityId: string | null;
  cityName: string;
  stateId: string | null;
  stateName: string;
  stateAbbreviation: string;
  countryId: number | null;
  countryName: string;
  countryAbbreviation: string;
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
  preferredSpecies: PreferredSpecies | null;
  preferredSizes: string[]; // ['small', 'medium', 'large']
}

export interface HousingTypeOption {
  id: number;
  name: string;
}