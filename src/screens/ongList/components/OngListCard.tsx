import { colors } from '@/constants/colors';
import { OngListItem } from '@/types/ongList.types';
import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface OngListCardProps {
  ong: OngListItem;
  onPress: () => void;
}

export function OngListCard({ ong, onPress }: OngListCardProps) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={onPress}>
      <Image source={{ uri: ong.logoUrl }} style={styles.logo} />

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.name} numberOfLines={1}>
            {ong.name}
          </Text>
          {ong.isVerified && (
            <Ionicons name="checkmark-circle" size={16} color={colors.semantic.info} />
          )}
        </View>

        <View style={styles.metaRow}>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={13} color={colors.neutral[400]} />
            <Text style={styles.cityText} numberOfLines={1}>
              {ong.city}, {ong.state}
            </Text>
          </View>

          {ong.distanceKm !== null && (
            <View style={styles.distanceBadge}>
              <Ionicons name="navigate-outline" size={11} color={colors.primary[500]} />
              <Text style={styles.distanceText}>a {ong.distanceKm} km</Text>
            </View>
          )}
        </View>

        {ong.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {ong.description}
          </Text>
        ) : null}
      </View>

      <Ionicons name="chevron-forward" size={18} color={colors.neutral[400]} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    marginHorizontal: 18,
    marginBottom: 12,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    gap: 12,
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.neutral[100],
  },
  content: {
    flex: 1,
    gap: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  name: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.neutral[900],
    flexShrink: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  cityText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.neutral[600],
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.primary[100],
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  distanceText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary[500],
  },
  description: {
    fontSize: 12,
    color: colors.neutral[400],
    lineHeight: 17,
    marginTop: 2,
  },
});