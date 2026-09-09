export interface RegisterUserDto {
        full_name: string,
        email: string,
        password: string
        cpf: string,
        phone: string,
        avatar_url?: string | null,
        birth_date?: string | null,
}