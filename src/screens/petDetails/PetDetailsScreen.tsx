import { colors } from '@/constants/colors';
import { AGE_GROUP_LABELS, SIZE_LABELS, SPECIES_LABELS } from '@/constants/enums';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PetDetailsHeader } from './components/PetDetailsHeader';
import { usePetDetails } from './hooks/usePetDetails';

// Tradutor para o nível de energia
const ENERGY_LABELS: Record<string, string> = {
  high: 'Alto',
  moderate: 'Moderado',
  low: 'Baixo / Calmo',
};

export function PetDetailsScreen() {
  const navigation = useNavigation<any>();
  const { pet, loading } = usePetDetails();

  if (loading || !pet) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <PetDetailsHeader onBack={() => navigation.goBack()} title="Detalhes do Pet" />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
        </View>
      </SafeAreaView>
    );
  }

  const speciesLabel = SPECIES_LABELS[pet.species as keyof typeof SPECIES_LABELS] || 'Pet';
  const sizeLabel = SIZE_LABELS[pet.size as keyof typeof SIZE_LABELS] || '';
  const ageLabel = AGE_GROUP_LABELS[pet.age_group as keyof typeof AGE_GROUP_LABELS] || '';
  const ong = pet.ongs;
  const address = ong?.addresses;
  const prefs = pet.animals_preferences?.[0] || pet.animals_preferences;

  // Tradução do nível de energia
  const rawEnergy = prefs?.energy ? String(prefs.energy).toLowerCase() : '';
  const energyLabel = ENERGY_LABELS[rawEnergy] || prefs?.energy || 'Não informado';

  // Coordenadas padrão (Lajeado/RS)
  const defaultLatitude = -29.4631;
  const defaultLongitude = -51.9617;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <PetDetailsHeader onBack={() => navigation.goBack()} title={pet.name} />

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Foto de Capa Estilizada */}
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
          {/* Card Principal de Identificação */}
          <View style={styles.card}>
            <Text style={styles.petName}>{pet.name}</Text>
            <Text style={styles.petSpecs}>
              {ageLabel} • {sizeLabel} • {pet.sex === 'M' ? 'Macho' : 'Fêmea'}
            </Text>

            <View style={styles.detailsGrid}>
              {pet.breed && (
                <View style={styles.detailItem}>
                  <Ionicons name="paw-outline" size={16} color={colors.primary[500]} />
                  <Text style={styles.detailText}>Raça: <Text style={styles.detailBold}>{pet.breed}</Text></Text>
                </View>
              )}
              {pet.weight_kg && (
                <View style={styles.detailItem}>
                  <Ionicons name="fitness-outline" size={16} color={colors.primary[500]} />
                  <Text style={styles.detailText}>Peso: <Text style={styles.detailBold}>{pet.weight_kg} kg</Text></Text>
                </View>
              )}
              {pet.color && (
                <View style={styles.detailItem}>
                  <Ionicons name="color-palette-outline" size={16} color={colors.primary[500]} />
                  <Text style={styles.detailText}>Cor: <Text style={styles.detailBold}>{pet.color}</Text></Text>
                </View>
              )}
            </View>

            {/* Badges de Saúde Modernas */}
            <View style={styles.badgesRow}>
              <View style={[styles.badge, pet.is_vaccinated ? styles.badgeSuccess : styles.badgeDefault]}>
                <Ionicons name={pet.is_vaccinated ? 'checkmark-circle' : 'close-circle'} size={14} color={pet.is_vaccinated ? colors.primary[700] : colors.neutral[600]} />
                <Text style={[styles.badgeText, pet.is_vaccinated && styles.badgeTextSuccess]}>{pet.is_vaccinated ? 'Vacinado' : 'Não vacinado'}</Text>
              </View>
              <View style={[styles.badge, pet.is_neutered ? styles.badgeSuccess : styles.badgeDefault]}>
                <Ionicons name={pet.is_neutered ? 'checkmark-circle' : 'close-circle'} size={14} color={pet.is_neutered ? colors.primary[700] : colors.neutral[600]} />
                <Text style={[styles.badgeText, pet.is_neutered && styles.badgeTextSuccess]}>{pet.is_neutered ? 'Castrado' : 'Não castrado'}</Text>
              </View>
            </View>

            <View style={styles.badgesRow}>
              <View style={[styles.badge, pet.is_dewormed ? styles.badgeSuccess : styles.badgeDefault]}>
                <Ionicons name={pet.is_dewormed ? 'checkmark-circle' : 'close-circle'} size={14} color={pet.is_dewormed ? colors.primary[700] : colors.neutral[600]} />
                <Text style={[styles.badgeText, pet.is_dewormed && styles.badgeTextSuccess]}>{pet.is_dewormed ? 'Desparasitado' : 'Não despar.'}</Text>
              </View>
              <View style={[styles.badge, pet.has_microchip ? styles.badgeSuccess : styles.badgeDefault]}>
                <Ionicons name={pet.has_microchip ? 'checkmark-circle' : 'close-circle'} size={14} color={pet.has_microchip ? colors.primary[700] : colors.neutral[600]} />
                <Text style={[styles.badgeText, pet.has_microchip && styles.badgeTextSuccess]}>{pet.has_microchip ? 'Com microchip' : 'Sem microchip'}</Text>
              </View>
            </View>

            {pet.description ? (
              <View style={styles.descriptionBox}>
                <Text style={styles.sectionTitle}>Sobre o pet</Text>
                <Text style={styles.descriptionText}>{pet.description}</Text>
              </View>
            ) : null}
          </View>

          {/* Card de Comportamento e Convivência */}
          {prefs && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Comportamento e Convivência</Text>
              
              <View style={styles.behaviorRow}>
                <Ionicons name="flash-outline" size={18} color={colors.primary[500]} />
                <Text style={styles.behaviorLabel}>Nível de Energia:</Text>
                <Text style={styles.behaviorValue}>{energyLabel}</Text>
              </View>

              <View style={styles.behaviorRow}>
                <Ionicons name="happy-outline" size={18} color={colors.primary[500]} />
                <Text style={styles.behaviorLabel}>Bom com crianças:</Text>
                <Text style={styles.behaviorValue}>{prefs.good_with_kids ? 'Sim' : 'Não'}</Text>
              </View>

              <View style={styles.behaviorRow}>
                <Ionicons name="paw-outline" size={18} color={colors.primary[500]} />
                <Text style={styles.behaviorLabel}>Bom com cães:</Text>
                <Text style={styles.behaviorValue}>{prefs.good_with_dogs ? 'Sim' : 'Não'}</Text>
              </View>

              <View style={styles.behaviorRow}>
                <Ionicons name="logo-octocat" size={18} color={colors.primary[500]} />
                <Text style={styles.behaviorLabel}>Bom com gatos:</Text>
                <Text style={styles.behaviorValue}>{prefs.good_with_cats ? 'Sim' : 'Não'}</Text>
              </View>

              <View style={styles.behaviorRow}>
                <Ionicons name="home-outline" size={18} color={colors.primary[500]} />
                <Text style={styles.behaviorLabel}>Adequado para apê:</Text>
                <Text style={styles.behaviorValue}>{prefs.apartment_friendly ? 'Sim' : 'Não'}</Text>
              </View>

              {prefs.special_needs && (
                <View style={styles.specialNeedsBox}>
                  <Text style={styles.specialNeedsTitle}>⚠️ Necessidades Especiais</Text>
                  <Text style={styles.descriptionText}>
                    {prefs.special_needs_desc || 'O pet requer cuidados especiais detalhados pela ONG.'}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Card de Localização da ONG e Mapa */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Localização da ONG</Text>
            
            <View style={styles.ongHeaderRow}>
              <View style={styles.ongIconContainer}>
                <Ionicons name="business" size={20} color={colors.primary[600]} />
              </View>
              <View>
                <Text style={styles.ongName}>{ong?.name || 'APAAM'}</Text>
                {address && (
                  <Text style={styles.addressText}>
                    {address.street}, {address.number} - {address.district}, {address.cities?.name}/{address.cities?.states?.abbreviation}
                  </Text>
                )}
              </View>
            </View>

            {/* Mapa Corrigido (Com container de tamanho rígido para evitar tela preta) */}
            <View style={styles.mapContainer}>
                <MapView
                    style={styles.map}
                    provider="google"
                    initialRegion={{
                        latitude: pet.coordinates?.latitude || -29.396414,
                        longitude: pet.coordinates?.longitude || -51.942209,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    }}
                    >
                <Marker
                    coordinate={{
                        latitude: pet.coordinates?.latitude || -29.396414,
                        longitude: pet.coordinates?.longitude || -51.942209,
                    }}
                    title={ong?.name || 'APAAM'}
                    description={address ? `${address.street}, ${address.number}` : 'Localização da ONG'}
                />
                </MapView>
            </View>
          </View>
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
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 18,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: { ios: 0.06, android: 0.1 }[1] || 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  petName: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.neutral[900],
  },
  petSpecs: {
    fontSize: 14,
    color: colors.neutral[600],
    marginTop: 4,
    marginBottom: 12,
  },
  detailsGrid: {
    gap: 8,
    marginBottom: 14,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: colors.neutral[700],
  },
  detailBold: {
    fontWeight: '700',
    color: colors.neutral[900],
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  badge: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  badgeSuccess: {
    backgroundColor: colors.primary[50],
    borderWidth: 1,
    borderColor: colors.primary[200],
  },
  badgeDefault: {
    backgroundColor: colors.neutral[100],
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.neutral[700],
  },
  badgeTextSuccess: {
    color: colors.primary[800],
  },
  descriptionBox: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[100],
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.neutral[900],
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 14,
    color: colors.neutral[600],
    lineHeight: 20,
  },
  behaviorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
    gap: 8,
  },
  behaviorLabel: {
    flex: 1,
    fontSize: 14,
    color: colors.neutral[700],
  },
  behaviorValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.neutral[900],
  },
  specialNeedsBox: {
    marginTop: 12,
    backgroundColor: '#fffbeb',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fef3c7',
  },
  specialNeedsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#92400e',
    marginBottom: 4,
  },
  ongHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  ongIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  ongName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.neutral[900],
  },
  addressText: {
    fontSize: 13,
    color: colors.neutral[600],
    marginTop: 2,
    maxWidth: '90%',
  },
  mapContainer: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.neutral[200],
    backgroundColor: colors.neutral[100],
  },
  map: {
    width: '100%',
    height: '100%',
  },
} as any);