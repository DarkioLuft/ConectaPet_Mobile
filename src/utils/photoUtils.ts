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

/**
 * Converte base64 para Uint8Array sem dependências externas
 */
export const decodeBase64ToBytes = (base64: string): Uint8Array => {
  if (typeof atob === 'function') {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let bufferLength = base64.length * 0.75;
  if (base64.endsWith('=')) bufferLength--;
  if (base64.endsWith('==')) bufferLength--;
  const bytes = new Uint8Array(bufferLength);
  let p = 0;
  for (let i = 0; i < base64.length; i += 4) {
    const enc1 = chars.indexOf(base64[i]);
    const enc2 = chars.indexOf(base64[i + 1]);
    const enc3 = chars.indexOf(base64[i + 2]);
    const enc4 = chars.indexOf(base64[i + 3]);
    bytes[p++] = (enc1 << 2) | (enc2 >> 4);
    if (enc3 !== -1 && base64[i + 2] !== '=') bytes[p++] = ((enc2 & 15) << 4) | (enc3 >> 2);
    if (enc4 !== -1 && base64[i + 3] !== '=') bytes[p++] = ((enc3 & 3) << 6) | (enc4 & 63);
  }
  return bytes;
}