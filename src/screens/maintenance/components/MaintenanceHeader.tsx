import { colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

export function MaintenanceHeader() {
  return (
    <View style={styles.header}>
      <View style={styles.titleRow}>
        <Ionicons name="construct" size={24} color={colors.white} style={styles.icon} />
        <Text style={styles.title}>Manutenção</Text>
      </View>
      <Text style={styles.subtitle}>Painel Administrativo da ONG</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.primary[600],
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
  title: {
    fontSize: 21,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 12,
    color: colors.primary[100],
    marginTop: 2,
    fontWeight: '500',
  },
});