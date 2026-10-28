// src/components/cards/LocationCard.tsx

import { CustomPrimaryActionButton } from '@/components/buttons/CustomPrimaryActionButton';
import { CustomMap } from '@/components/maps/CustomMap';
import { colors } from '@/constants/colors';
import { GenericAddressData, useLocationCard } from '@/hooks/useLocationCard';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

interface LocationCardProps {
    sectionTitle?: string;
    title?: string;
    addressData?: GenericAddressData | GenericAddressData[];
    fallbackCoordinates?: { latitude: number; longitude: number };

    // Customizações visuais e de ação
    iconName?: keyof typeof Ionicons.glyphMap;
    actionText?: string;
    onActionPress?: () => void;
}

export function LocationCard({
    sectionTitle = 'Localização',
    title,
    addressData,
    fallbackCoordinates,
    iconName = 'location',
    actionText,
    onActionPress
}: LocationCardProps) {

    const {
        displayTitle,
        formattedAddress,
        latitude,
        longitude
    } = useLocationCard({
        title,
        addressData,
        fallbackCoordinates
    });

    return (
        <View style={styles.card}>
            <Text style={styles.sectionTitle}>{sectionTitle}</Text>

            <View style={styles.headerRow}>
                <View style={styles.iconContainer}>
                    <Ionicons name={iconName} size={20} color={colors.primary[600]} />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{displayTitle}</Text>
                    <Text style={styles.addressText}>{formattedAddress}</Text>
                </View>
            </View>

            <View style={styles.mapWrapper}>
                <CustomMap
                    latitude={latitude}
                    longitude={longitude}
                    markerTitle={displayTitle}
                    markerDescription={formattedAddress}
                />
            </View>

            {/* Renderiza o botão apenas se receber a função onActionPress e o texto */}
            {onActionPress && actionText && (
                <CustomPrimaryActionButton
                    text={actionText}
                    onPress={onActionPress}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: 18,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: colors.neutral[200],
    },
    sectionTitle: {
        fontSize: 16, fontWeight: '700', color: colors.neutral[900], marginBottom: 10,
    },
    headerRow: {
        flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14,
    },
    iconContainer: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: colors.primary[50],
        alignItems: 'center', justifyContent: 'center',
    },
    textContainer: { flex: 1 },
    title: {
        fontSize: 16, fontWeight: '700', color: colors.neutral[900],
    },
    addressText: {
        fontSize: 13, color: colors.neutral[600], marginTop: 2,
    },
    mapWrapper: {
        marginBottom: 16, // Só aplica espaçamento caso tenha botão, ajustado pelo flex do React Native
    }
});