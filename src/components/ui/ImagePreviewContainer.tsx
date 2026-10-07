import { colors } from "@/constants/colors";
import { styles } from "@/constants/styles";
import { PhotoInterface } from "@/utils/photoUtils";
import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, View } from "react-native";
import { SubtleActionButton } from "../buttons/SubtleActionButton";

interface ImagePreviewContainerProps {
    photoUri: string | null;
    onTakePhoto: () => Promise<PhotoInterface | undefined>;
    onPickGallery: () => Promise<PhotoInterface | undefined>;
    onRemovePhoto: () => void;
    onUpdatePhoto: (photoData: PhotoInterface) => void;
}

export function ImagePreviewContainer({
    photoUri,
    onTakePhoto,
    onPickGallery,
    onRemovePhoto,
    onUpdatePhoto
}: ImagePreviewContainerProps) {
    const handleTakePhoto = async () => {
        const photo = await onTakePhoto();
        if (photo) {
            onUpdatePhoto(photo);
        }
    };

    const handlePickGallery = async () => {
        const photo = await onPickGallery();
        if (photo) {
            onUpdatePhoto(photo);
        }
    };

    return (
        <View>
            <View style={stylesLocal.imagePreviewBox}>
                {photoUri ? (
                    <Image
                        source={{ uri: photoUri }}
                        style={stylesLocal.image}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={stylesLocal.emptyContainer}>
                        <View style={[stylesLocal.placeholderIconCircle, styles.shadow]}>
                            <Ionicons
                                name="camera-outline"
                                size={24}
                                color={colors.neutral[800]}
                            />
                        </View>
                        <Text style={stylesLocal.emptyTitle}>Sua foto aparecerá aqui</Text>
                        <Text style={stylesLocal.emptySubtitle}>
                            Selecione uma imagem com boa iluminação
                        </Text>
                    </View>
                )}
            </View>

            {/* Renderização Condicional dos Botões */}
            {photoUri ? (
                <View style={stylesLocal.buttonSingleRow}>
                    <SubtleActionButton
                        text="Remover Imagem"
                        onPress={onRemovePhoto}
                        iconName="trash-outline"
                        variant="danger"
                    />
                </View>
            ) : (
                <View style={stylesLocal.buttonsRow}>
                    <SubtleActionButton
                        text="Tirar Foto"
                        onPress={handleTakePhoto}
                        iconName="camera-outline"
                    />
                    <SubtleActionButton
                        text="Escolher da Galeria"
                        onPress={handlePickGallery}
                        iconName="images-outline"
                    />
                </View>
            )}
        </View>
    );
}

const stylesLocal = StyleSheet.create({
    imagePreviewBox: {
        width: '100%',
        height: 280,
        borderRadius: 18,
        backgroundColor: colors.neutral[100],
        borderWidth: 1.5,
        borderColor: colors.neutral[400],
        borderStyle: 'dashed',
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 25
    },
    image: {
        width: '100%',
        height: '100%',
    },
    emptyContainer: {
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    placeholderIconCircle: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    emptyTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: colors.neutral[800],
    },
    emptySubtitle: {
        fontSize: 13,
        color: colors.neutral[400],
        marginTop: 2,
        textAlign: 'center',
    },
    buttonsRow: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 16,
    },
    buttonSingleRow: {
        flexDirection: 'row',
        marginTop: 16,
    },
});