// Cabeçalho verde superior com marca ConectaPet e atalho para notificações.
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface HomeHeaderProps {
  onPressNotifications?: () => void;
}

export function HomeHeader({ onPressNotifications }: HomeHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.brandRow}>
        <Ionicons name="paw" size={26} color="#ffffff" style={styles.brandIcon} />
        <Text style={styles.brandName}>ConectaPet</Text>
      </View>

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPressNotifications}
        style={styles.bellButton}
      >
        <Ionicons name="notifications-outline" size={22} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#15803d',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 22,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandIcon: {
    marginRight: 8,
  },
  brandName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  bellButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
});