import { ProfileDto } from '@/dtos/profile.dto';
import { supabase } from './supabase';

const TABLE_NAME = 'profiles';

export const profileService = {
    async findById(id: string) {
        console.log('profileService.findById', id)
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .eq('id', id)

        if (error) throw error
        if (!data || data.length === 0) {
            return null;
        }
        
        const profile = convertToProfileDto(data[0]);

        return profile;
    },
};

async function convertToProfileDto(user: any): Promise<ProfileDto> {
    return {
        id: user.id,
        addressId: user.addressId || null,
        email: user.email,
        fullName: user.full_name,
        cpf: user.cpf,
        phone: user.phone,
        avatarUrl: user.avatar_url || null,
        birthDate: user.birth_date,
        createdAt: user.created_at,
        updatedAt: user.updatedAt || null
    } as ProfileDto;
}