import { decodeBase64ToBytes } from "@/utils/photoUtils";
import { profileService } from "./profileService";
import { supabase } from "./supabase";

type buckets = 'profile-photos' | 'animal-photos'

export const photoUploadService = {
    /**
     * Converte base64 e realiza o upload do avatar do usuário para o Supabase Storage,
     * atualizando o perfil em seguida.
     */
    async uploadAvatar(base64Image: string, userId: string): Promise<string> {
        // Converte base64 para Uint8Array
        const bytes = decodeBase64ToBytes(base64Image);

        const fileName = `${userId}_avatar.jpg`;
        const filePath = `avatars/${fileName}`;

        // Upload para o Supabase Storage
        await uploadToStorage('profile-photos', filePath, bytes);

        // Obtém a URL pública da imagem
        const publicUrl = getPublicUrlFromImage('profile-photos', filePath);

        // Atualiza o perfil do usuário com a nova URL
        await profileService.updateAvatarUrl(userId, publicUrl);

        return publicUrl;
    },

    async uploadAnimalPhoto(base64Data: string, animalName: string): Promise<string> {
        const cleanName = animalName.toLowerCase().replace(/[^a-z0-9]/g, '_');
        const filePath = `${Date.now()}_${cleanName}.jpg`;

        const bytes = decodeBase64ToBytes(base64Data);

        // Upload para o Supabase Storage
        await uploadToStorage('animal-photos', filePath, bytes);

        // Obtém a URL pública da imagem
        const publicUrl = getPublicUrlFromImage('animal-photos', filePath);

        return publicUrl;
    },
};

const uploadToStorage = async (bucket: buckets, filePath: string, bytes: Uint8Array<ArrayBufferLike>) => {
    const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, bytes, {
            contentType: 'image/jpg',
            upsert: true,
        });

    if (uploadError) {
        throw new Error(`Erro no upload da imagem: ${uploadError.message}`);
    }
}

const getPublicUrlFromImage = (bucket: buckets, filePath: string) => {
    const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

    const publicUrl = data.publicUrl;
    return publicUrl;
}