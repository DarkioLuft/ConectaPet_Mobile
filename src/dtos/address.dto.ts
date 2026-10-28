export interface AddressDTO {
    coordinates: CoordinatesDTO;
    city: CityDTO;
    street: String;
    number: String;
    district: String;
    complement?: String;
    postalCode: String;
    isPublic: Boolean;
}

export interface CityDTO {
    id: String;
    name: String;
    state: StateDTO
}

export interface StateDTO {
    id: String;
    name: String;
    abbreviation: String;
    country: CountryDTO;
}

export interface CountryDTO {
    id: String;
    name: String;
    abbreviation: String;
}

export interface CoordinatesDTO {
    latitude: number;
    longitude: number;
}