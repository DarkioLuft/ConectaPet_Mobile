import * as ImagePicker from 'expo-image-picker';
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native';

interface ImagePickerGridProps {
  images: string[];
  coverIndex: number;
  onAddImages: (uris: string[]) => void;
  onRemoveImage: (index: number) => void;
  onSetCover: (index: number) => void;
  maxImages?: number;
}

export function ImagePickerGrid({
  images,
  coverIndex,
  onAddImages,
  onRemoveImage,
  onSetCover,
  maxImages = 5,
}: ImagePickerGridProps) {
  const pickImages = async () => {
    if (images.length >= maxImages) {
      Alert.alert('Limite atingido', `Só pode selecionar até ${maxImages} fotografias.`);
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'É preciso permissão para aceder à galeria de fotos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: maxImages - images.length,
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      const uris = result.assets.map((asset) => asset.uri);
      onAddImages(uris);
    }
  };

  return (
    <View className="w-full my-2">
      <View className="flex-row flex-wrap gap-3">
        {images.map((uri, index) => {
          const isCover = index === coverIndex;
          return (
            <View key={uri} className="relative w-24 h-24 rounded-2xl overflow-hidden border border-gray-200">
              <Image source={{ uri }} className="w-full h-full" resizeMode="cover" />
              
              {/* Botão Remover */}
              <TouchableOpacity
                onPress={() => onRemoveImage(index)}
                className="absolute top-1 right-1 bg-black/60 rounded-full w-6 h-6 items-center justify-center"
              >
                <Text className="text-white text-xs font-bold">✕</Text>
              </TouchableOpacity>

              {/* Tag / Botão de Capa */}
              <TouchableOpacity
                onPress={() => onSetCover(index)}
                className={`absolute bottom-0 inset-x-0 py-0.5 items-center justify-center ${
                  isCover ? 'bg-emerald-600' : 'bg-black/40'
                }`}
              >
                <Text className="text-[10px] text-white font-medium">
                  {isCover ? 'Principal' : 'Definir capa'}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}

        {images.length < maxImages && (
          <TouchableOpacity
            onPress={pickImages}
            activeOpacity={0.7}
            className="w-24 h-24 rounded-2xl border-2 border-dashed border-gray-300 items-center justify-center bg-gray-50"
          >
            <Text className="text-2xl text-gray-400 font-light">+</Text>
            <Text className="text-[11px] text-gray-500 mt-1">Adicionar</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}