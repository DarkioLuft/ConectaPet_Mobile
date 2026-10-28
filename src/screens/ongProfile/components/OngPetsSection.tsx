import { colors } from '@/constants/colors';
import { PetCard } from '@/screens/home/components/PetCard';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

interface OngPetsSectionProps {
  pets: any[];
  loading: boolean;
}

export function OngPetsSection({ pets, loading }: OngPetsSectionProps) {
  const navigation = useNavigation<any>();

  // Estado de Carregamento
  if (loading) {
    return (
      <View style={styles.emptyContainer}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
        <Text style={styles.emptyText}>Buscando peludos... </Text>
      </View>
    );
  }

  // Estado Vazio (Nenhum pet cadastrado)
  if (!pets || pets.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="paw-outline" size={48} color={colors.neutral[400]} />
        <Text style={styles.emptyText}>Nenhum pet disponível para adoção no momento.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {pets.map((pet) => (
          <PetCard
            pet={pet}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.neutral[600],
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12, // Espaçamento entre as colunas/linhas
  },
});