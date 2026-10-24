import { colors } from '@/constants/colors';
import { AGE_GROUP_LABELS, SIZE_LABELS } from '@/constants/enums';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

interface PetInfoCardProps {
  pet: any;
}

export function PetInfoCard({ pet }: PetInfoCardProps) {
  const sizeLabel = SIZE_LABELS[pet.size as keyof typeof SIZE_LABELS] || '';
  const ageLabel = AGE_GROUP_LABELS[pet.age_group as keyof typeof AGE_GROUP_LABELS] || '';
  const sexLabel = pet.sex === 'male' || pet.sex === 'M' ? 'Macho' : 'Fêmea';

  return (
    <View style={styles.card}>
      <Text style={styles.petName}>{pet.name}</Text>
      <Text style={styles.petSpecs}>
        {ageLabel} • {sizeLabel} • {sexLabel}
      </Text>

      <View style={styles.detailsGrid}>
        {pet.breed && (
          <View style={styles.detailItem}>
            <Ionicons name="paw-outline" size={16} color={colors.primary[500]} />
            <Text style={styles.detailText}>
              Raça: <Text style={styles.detailBold}>{pet.breed}</Text>
            </Text>
          </View>
        )}
        {pet.weight_kg && (
          <View style={styles.detailItem}>
            <Ionicons name="fitness-outline" size={16} color={colors.primary[500]} />
            <Text style={styles.detailText}>
              Peso: <Text style={styles.detailBold}>{pet.weight_kg} kg</Text>
            </Text>
          </View>
        )}
        {pet.color && (
          <View style={styles.detailItem}>
            <Ionicons name="color-palette-outline" size={16} color={colors.primary[500]} />
            <Text style={styles.detailText}>
              Cor: <Text style={styles.detailBold}>{pet.color}</Text>
            </Text>
          </View>
        )}
      </View>

      <View style={styles.badgesRow}>
        <HealthBadge active={pet.is_vaccinated} activeLabel="Vacinado" inactiveLabel="Não vacinado" />
        <HealthBadge active={pet.is_neutered} activeLabel="Castrado" inactiveLabel="Não castrado" />
      </View>

      <View style={styles.badgesRow}>
        <HealthBadge active={pet.is_dewormed} activeLabel="Desparasitado" inactiveLabel="Não despar." />
        <HealthBadge active={pet.has_microchip} activeLabel="Com microchip" inactiveLabel="Sem microchip" />
      </View>

      {pet.description ? (
        <View style={styles.descriptionBox}>
          <Text style={styles.sectionTitle}>Sobre o pet</Text>
          <Text style={styles.descriptionText}>{pet.description}</Text>
        </View>
      ) : null}
    </View>
  );
}

function HealthBadge({
  active,
  activeLabel,
  inactiveLabel,
}: {
  active: boolean;
  activeLabel: string;
  inactiveLabel: string;
}) {
  return (
    <View style={[styles.badge, active ? styles.badgeSuccess : styles.badgeDefault]}>
      <Ionicons
        name={active ? 'checkmark-circle' : 'close-circle'}
        size={14}
        color={active ? colors.primary[700] : colors.neutral[600]}
      />
      <Text style={[styles.badgeText, active && styles.badgeTextSuccess]}>
        {active ? activeLabel : inactiveLabel}
      </Text>
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
});