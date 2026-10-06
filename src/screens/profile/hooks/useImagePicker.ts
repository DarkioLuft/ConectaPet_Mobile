import { authService } from '@/services/authService';
import { photoUploadService } from '@/services/photoUploadService';
import { handleError } from '@/utils/errorHandler';
import { AppToast } from '@/utils/toast';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';

interface UseImagePickerOptions {
    onSuccess: (newAvatarUrl: string) => void;
}

export function useImagePicker({ onSuccess }: UseImagePickerOptions) {
    const [saving, setSaving] = useState(false);

    const handlePickAvatar = async () => {
        // Abre a galeria de imagens
        const res = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
            base64: true,
        });

        if (res.canceled || !res.assets[0]?.base64) {
            return;
        }

        try {
            setSaving(true);

            // Garante que o usuário está autenticado
            const user = await authService.getAuthenticatedUser();

            // 3. Delega o processamento e upload ao serviço
            const avatarUrl = await photoUploadService.uploadAvatar(
                res.assets[0].base64,
                user.id
            );

            // 4. Notifica a tela de sucesso
            onSuccess(avatarUrl);
            AppToast.success("Sucesso", "Avatar atualizado com sucesso!")
        } catch (error: any) {
            handleError(error.message, 'Falha ao salvar nova imagem.')
        } finally {
            setSaving(false);
        }
    };

    return {
        saving,
        handlePickAvatar,
    };
}