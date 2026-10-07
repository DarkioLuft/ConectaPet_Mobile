import * as ImagePicker from 'expo-image-picker';
import { AppToast } from './toast';

export interface PhotoInterface {
    photoUri: string,
    photoBase64: string
}

export const takePhoto = async (): Promise<PhotoInterface | undefined> => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
        AppToast.error('Permissão necessária', 'É preciso permissão para usar a câmara.');
        return;
    }
    const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.8,
        base64: true, // Lê a imagem diretamente no Android
    });
    if (!result.canceled && result.assets.length > 0) {
        return {
            photoUri: result.assets[0].uri,
            photoBase64: result.assets[0].base64
        } as PhotoInterface
    }
};

export const pickFromGallery = async (): Promise<PhotoInterface | undefined> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
        AppToast.error('Permissão necessária', 'É preciso permissão para usar a galeria.');
        return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        quality: 0.8,
        base64: true, // Lê a imagem diretamente no Android
    });
    if (!result.canceled && result.assets.length > 0) {
        return {
            photoUri: result.assets[0].uri,
            photoBase64: result.assets[0].base64
        } as PhotoInterface
    }
};