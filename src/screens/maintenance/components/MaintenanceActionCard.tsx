import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaintenanceAction } from '../types/maintenance.types';

interface MaintenanceActionCardProps {
  action: MaintenanceAction;
}

export function MaintenanceActionCard({ action }: MaintenanceActionCardProps) {
  const accentColor = action.accentColor || '#16a34a';

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={action.onPress}
      style={styles.card}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${accentColor}15` }]}>
        <Ionicons name={action.iconName} size={26} color={accentColor} />
      </View>

      <View style={styles.textContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{action.title}</Text>
          {action.badgeText && (
            <View style={[styles.badge, { backgroundColor: `${accentColor}20` }]}>
              <Text style={[styles.badgeText, { color: accentColor }]}>
                {action.badgeText}
              </Text>
            </View>
          )}
        </View>
        <Text style={styles.description}>{action.description}</Text>
      </View>

      <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  description: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 16,
  },
});