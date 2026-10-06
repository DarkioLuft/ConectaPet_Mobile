// Card com resumo e foto do pet para exibição na tela principal e em listagens de pets.
import { colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AGE_GROUP_LABELS, SIZE_LABELS, SPECIES_LABELS } from '../../../constants/enums';
import { HomePetCardData } from '../types/home.types';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

interface PetCardProps {
  pet: HomePetCardData;
  isFavorite?: boolean;
  onPressCard?: () => void;
  onToggleFavorite?: () => void;
}

export function PetCard({ pet, isFavorite = false, onPressCard, onToggleFavorite }: PetCardProps) {
  const [imageError, setImageError] = useState(false);

  const speciesLabel = SPECIES_LABELS[pet.species] || 'Pet';
  const sizeLabel = SIZE_LABELS[pet.size] || '';
  const ageLabel = AGE_GROUP_LABELS[pet.age_group] || '';
  const specs = `${ageLabel} • ${sizeLabel} • ${pet.isVaccinated ? 'Vacinado' : 'Não vac.'}`;

  const imageUrl = pet.coverPhotoUrl || (pet as any).cover_photo_url;
  const hasValidImage = Boolean(imageUrl) && !imageError;

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPressCard} style={styles.card}>
      <View style={styles.imageContainer}>
        {hasValidImage ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <View style={styles.placeholderContainer}>
            <Ionicons name="paw" size={32} color={colors.neutral[400]} />
          </View>
        )}

        <View style={styles.speciesBadge}>
          <Text style={styles.speciesText}>{speciesLabel}</Text>
        </View>

        <TouchableOpacity activeOpacity={0.8} onPress={onToggleFavorite} style={styles.favoriteButton}>
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={16}
            color={isFavorite ? colors.semantic.error : colors.white}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {pet.name}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {specs}
        </Text>

        <View style={styles.originRow}>
          <Ionicons name="location-sharp" size={13} color={colors.primary[500]} />
          <Text style={styles.originText} numberOfLines={1}>
            {pet.ongName}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    overflow: 'hidden',
    marginBottom: 14,
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  imageContainer: {
    width: '100%',
    height: 125,
    position: 'relative',
    backgroundColor: colors.neutral[100],
  },
  image: {
    width: '100%',
    height: 125,
  },
  placeholderContainer: {
    width: '100%',
    height: 125,
    alignItems: 'center',
    justifyContent: 'center',
  },
  speciesBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: colors.primary[500],
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  speciesText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 10,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.neutral[800],
  },
  subtitle: {
    fontSize: 11,
    color: colors.neutral[600],
    marginTop: 2,
  },
  originRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 3,
  },
  originText: {
    fontSize: 11,
    color: colors.primary[500],
    fontWeight: '600',
    flex: 1,
  },
});