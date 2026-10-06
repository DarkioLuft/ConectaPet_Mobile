import { profileService } from "./profileService";
import { supabase } from "./supabase";

export const photoUploadService = {
    /**
     * Converte base64 e realiza o upload do avatar do usuário para o Supabase Storage,
     * atualizando o perfil em seguida.
     */
    async uploadAvatar(base64Image: string, userId: string): Promise<string> {
        // 1. Converte base64 para Uint8Array
        const bytes = convertBase64ToUint8Array(base64Image);

        const fileName = `${userId}_avatar.jpg`;
        const filePath = `avatars/${fileName}`;

        // 2. Upload para o Supabase Storage
        await uploadToStorage(filePath, bytes);

        // 3. Obtém a URL pública da imagem
        const publicUrl = getPublicUrlFromImage(filePath);

        // 4. Atualiza o perfil do usuário com a nova URL
        await profileService.updateAvatarUrl(userId, publicUrl);

        return publicUrl;
    },
};

const convertBase64ToUint8Array = (base64Image: string) => {
    const binaryString = atob(base64Image);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }

    return bytes
}

const uploadToStorage = async (filePath: string, bytes: Uint8Array<ArrayBuffer>) => {
    const { error: uploadError } = await supabase.storage
        .from('profile-photos')
        .upload(filePath, bytes, {
            contentType: 'image/jpeg',
            upsert: true,
        });

    if (uploadError) {
        throw new Error(`Erro no upload da imagem: ${uploadError.message}`);
    }
}

const getPublicUrlFromImage = (filePath: string) => {
    const { data } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(filePath);

    const publicUrl = data.publicUrl;
    return publicUrl;
}