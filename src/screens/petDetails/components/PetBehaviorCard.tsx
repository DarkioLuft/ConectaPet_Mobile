import { colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

const ENERGY_LABELS: Record<string, string> = {
  high: 'Alto',
  medium: 'Moderado',
  moderate: 'Moderado',
  low: 'Baixo / Calmo',
};

interface PetBehaviorCardProps {
  prefs: any;
}

export function PetBehaviorCard({ prefs }: PetBehaviorCardProps) {
  if (!prefs) return null;

  const rawEnergy = prefs.energy ? String(prefs.energy).toLowerCase() : '';
  const energyLabel = ENERGY_LABELS[rawEnergy] || prefs.energy || 'Não informado';

  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Comportamento e Convivência</Text>

      <BehaviorItem icon="flash-outline" label="Nível de Energia:" value={energyLabel} />
      <BehaviorItem icon="happy-outline" label="Bom com crianças:" value={prefs.good_with_kids ? 'Sim' : 'Não'} />
      <BehaviorItem icon="paw-outline" label="Bom com cães:" value={prefs.good_with_dogs ? 'Sim' : 'Não'} />
      <BehaviorItem icon="logo-octocat" label="Bom com gatos:" value={prefs.good_with_cats ? 'Sim' : 'Não'} />
      <BehaviorItem icon="home-outline" label="Adequado para apê:" value={prefs.apartment_friendly ? 'Sim' : 'Não'} />

      {prefs.special_needs && (
        <View style={styles.specialNeedsBox}>
          <Text style={styles.specialNeedsTitle}>⚠️ Necessidades Especiais</Text>
          <Text style={styles.descriptionText}>
            {prefs.special_needs_desc || 'O pet requer cuidados especiais detalhados pela ONG.'}
          </Text>
        </View>
      )}
    </View>
  );
}

function BehaviorItem({ icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <View style={styles.behaviorRow}>
      <Ionicons name={icon} size={18} color={colors.primary[500]} />
      <Text style={styles.behaviorLabel}>{label}</Text>
      <Text style={styles.behaviorValue}>{value}</Text>
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
    fontSize: 16,
    fontWeight: '700',
    color: colors.neutral[900],
    marginBottom: 10,
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
  descriptionText: {
    fontSize: 14,
    color: colors.neutral[600],
    lineHeight: 20,
  },
});