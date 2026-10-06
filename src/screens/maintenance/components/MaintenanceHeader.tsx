import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

export function MaintenanceHeader() {
  return (
    <View style={styles.header}>
      <View style={styles.titleRow}>
        <Ionicons name="construct" size={24} color="#ffffff" style={styles.icon} />
        <Text style={styles.title}>Manutenção</Text>
      </View>
      <Text style={styles.subtitle}>Painel Administrativo da ONG</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#15803d',
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
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 12,
    color: '#dcfce7',
    marginTop: 2,
    fontWeight: '500',
  },
});