import { colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, View } from 'react-native';

interface OngProfileHeaderProps {
  data: any;
}

export function OngProfileHeader({ data }: OngProfileHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.coverImage} />

      <View style={styles.infoContainer}>
        <View style={styles.avatarWrapper}>
          <Image source={{ uri: data?.logoUrl }} style={styles.avatar} />
        </View>

        <View style={styles.titleRow}>
          <Text style={styles.name}>{data?.name}</Text>
          {data?.is_verified && <Ionicons name="checkmark-circle" size={18} color={colors.semantic.info} />}
        </View>

        <View style={styles.badgesRow}>
          <View style={styles.badgeNeutral}>
            <Ionicons name="location-outline" size={12} color={colors.neutral[600]} />
            <Text style={styles.badgeNeutralText}>{data?.address?.city?.name}, {data?.address?.city?.state?.abbreviation}</Text>
          </View>

          {data?.location?.distance && (
            <View style={styles.badgeGreen}>
              <Ionicons name="navigate-outline" size={12} color={colors.semantic.success} />
              <Text style={styles.badgeGreenText}>a {data?.location?.distance} km</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.white, marginBottom: 20 },
  coverImage: { width: '100%', height: 100, backgroundColor: colors.primary[500] },
  infoContainer: { paddingHorizontal: 20, alignItems: 'center' },
  avatarWrapper: {
    marginTop: -40,
    width: 80, height: 80, borderRadius: 40,
    borderWidth: 4, borderColor: colors.white, backgroundColor: colors.white,
    elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: { width: 0, height: 4 },
  },
  avatar: { width: '100%', height: '100%', borderRadius: 40 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  name: { fontSize: 20, fontWeight: '800', color: colors.neutral[800] },
  badgesRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  badgeNeutral: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.neutral[100], paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeNeutralText: { fontSize: 12, fontWeight: '600', color: colors.neutral[600] },
  badgeGreen: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#dcfce7', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeGreenText: { fontSize: 12, fontWeight: '700', color: colors.semantic.success },
});