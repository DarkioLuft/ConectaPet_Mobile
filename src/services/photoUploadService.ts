import { decodeBase64ToBytes } from "@/utils/photoUtils";
import { profileService } from "./profileService";
import { supabase } from "./supabase";

type buckets = 'profile-photos' | 'animal-photos' | 'announcement-photos';

export const photoUploadService = {
    /**
     * Converte base64 e realiza o upload do avatar do usuário para o Supabase Storage,
     * atualizando o perfil em seguida com cache-buster na URL.
     */
    async uploadAvatar(base64Image: string, userId: string): Promise<string> {
        const bytes = decodeBase64ToBytes(base64Image);

        const fileName = `${userId}_avatar.jpg`;
        const filePath = `avatars/${fileName}`;

        // Upload para o Supabase Storage sobrescrevendo o arquivo anterior
        await uploadToStorage('profile-photos', filePath, bytes);

        // Obtém a URL pública e adiciona timestamp (?t=...) para quebrar o cache do React Native Image
        const basePublicUrl = getPublicUrlFromImage('profile-photos', filePath);
        const cacheBustedUrl = `${basePublicUrl}?t=${Date.now()}`;

        // Atualiza o perfil do usuário com a nova URL versionada
        await profileService.updateAvatarUrl(userId, cacheBustedUrl);

        return cacheBustedUrl;
    },

    async uploadAnimalPhoto(base64Data: string, animalName: string): Promise<string> {
        const cleanName = animalName.toLowerCase().replace(/[^a-z0-9]/g, '_');
        const filePath = `${Date.now()}_${cleanName}.jpg`;

        const bytes = decodeBase64ToBytes(base64Data);

        await uploadToStorage('animal-photos', filePath, bytes);

        const publicUrl = getPublicUrlFromImage('animal-photos', filePath);

        return publicUrl;
    },

    async uploadAnnouncementPhoto(base64Data: string, title: string): Promise<string> {
        const cleanName = title.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 40);
        const filePath = `${Date.now()}_${cleanName || 'anuncio'}.jpg`;
        const bytes = decodeBase64ToBytes(base64Data);

        await uploadToStorage('announcement-photos', filePath, bytes);

        return getPublicUrlFromImage('announcement-photos', filePath);
    },
};

const uploadToStorage = async (bucket: buckets, filePath: string, bytes: Uint8Array<ArrayBufferLike>) => {
    const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, bytes, {
            contentType: 'image/jpeg',
            upsert: true,
        });

    if (uploadError) {
        throw new Error(`Erro no upload da imagem: ${uploadError.message}`);
    }
};

const getPublicUrlFromImage = (bucket: buckets, filePath: string) => {
    const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

    return data.publicUrl;
};