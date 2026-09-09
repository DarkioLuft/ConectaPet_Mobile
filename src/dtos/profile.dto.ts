export interface RegisterProfileDto {
    fullName: string,
    email: string,
    password: string
    cpf: string,
    phone: string,
    avatarUrl?: string | null,
    birthDate?: string | null,
}

export interface ProfileDto {
    id: string,
    addressId: string | null,
    fullName: string,
    email: string,
    cpf: string,
    phone: string,
    avatarUrl: string | null,
    birthDate: string,
    createdAt: string,
    updatedAt: string | null
}