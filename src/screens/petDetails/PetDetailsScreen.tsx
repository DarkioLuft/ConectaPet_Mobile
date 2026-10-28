import { LocationCard } from '@/components/cards/LocationCard';
import { TitleHeader } from '@/components/navigation/TitleHeader';
import { LoadingIndicator } from '@/components/ui/LoadingIndicator';
import { colors } from '@/constants/colors';
import { SPECIES_LABELS } from '@/constants/enums';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PetBehaviorCard } from './components/PetBehaviorCard';
import { PetInfoCard } from './components/PetInfoCard';
import { usePetDetails } from './hooks/usePetDetails';

export function PetDetailsScreen() {
  const navigation = useNavigation<any>();
  const { pet, onCardClick, loading } = usePetDetails();

  console.log(pet)

  if (loading || !pet) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <TitleHeader
          title={"Detalhes do Pet"}
          onPressBackButton={() => navigation.goBack()}
        />
        <LoadingIndicator />
      </SafeAreaView>
    );
  }

  const speciesLabel = SPECIES_LABELS[pet.species as keyof typeof SPECIES_LABELS] || 'Pet';
  const prefs = pet.animals_preferences?.[0] || pet.animals_preferences;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <TitleHeader
        title={pet.name}
        onPressBackButton={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          {pet.cover_photo_url ? (
            <Image source={{ uri: pet.cover_photo_url }} style={styles.image} resizeMode="cover" />
          ) : (
            <View style={styles.placeholderContainer}>
              <Ionicons name="paw" size={48} color={colors.neutral[400]} />
            </View>
          )}
          <View style={styles.speciesBadge}>
            <Text style={styles.speciesText}>{speciesLabel}</Text>
          </View>
        </View>

        <View style={styles.contentWrapper}>
          <PetInfoCard pet={pet} />
          <PetBehaviorCard prefs={prefs} />
          <LocationCard
            sectionTitle="Localização da ONG"
            title={pet?.ongs?.name}
            addressData={pet?.ongs?.addresses}
            fallbackCoordinates={pet?.coordinates}

            // Customizações
            iconName="business"
            actionText="Mais detalhes da ONG"
            onActionPress={() => onCardClick(pet?.ongs?.id)}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  imageContainer: {
    width: '100%',
    height: 280,
    backgroundColor: colors.neutral[200],
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 280,
  },
  placeholderContainer: {
    width: '100%',
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
  },
  speciesBadge: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: colors.primary[500],
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  speciesText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  contentWrapper: {
    padding: 16,
    gap: 16,
    marginTop: -20,
  },
});