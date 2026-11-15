// src/screens/ongProfile/components/OngProfileHeader.tsx

import { colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface OngProfileHeaderProps {
  data: any;
  onWhatsApp?: () => void;
  onOpenRoute?: () => void;
  onShare?: () => void;
}

export function OngProfileHeader({
  data,
  onWhatsApp,
  onOpenRoute,
  onShare,
}: OngProfileHeaderProps) {
  const hasPhone = Boolean(data?.whatsapp || data?.phone);
  const hasCoords = Boolean(data?.location?.coordinates);

  return (
    <View style={styles.container}>
      {/* Capa com detalhe decorativo em duas camadas */}
      <View style={styles.coverBanner}>
        <View style={styles.coverCircleLarge} />
        <View style={styles.coverCircleSmall} />
      </View>

      <View style={styles.infoContainer}>
        {/* Avatar com borda elevada e selo verificado */}
        <View style={styles.avatarWrapper}>
          <Image source={{ uri: data?.logoUrl }} style={styles.avatar} />
          {data?.is_verified && (
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark" size={12} color={colors.white} />
            </View>
          )}
        </View>

        {/* Nome da ONG */}
        <View style={styles.titleRow}>
          <Text style={styles.name}>{data?.name}</Text>
        </View>

        {data?.is_verified && (
          <Text style={styles.verifiedSubtitle}>Instituição Verificada</Text>
        )}

        {/* Cidade + Pílula Verde de Distância */}
        <View style={styles.badgesRow}>
          <View style={styles.badgeNeutral}>
            <Ionicons name="location-outline" size={13} color={colors.neutral[600]} />
            <Text style={styles.badgeNeutralText}>
              {data?.address?.city?.name}, {data?.address?.city?.state?.abbreviation}
            </Text>
          </View>

          {data?.location?.distance != null && (
            <View style={styles.badgeGreen}>
              <Ionicons name="navigate" size={12} color="#16a34a" />
              <Text style={styles.badgeGreenText}>a {data.location.distance} km</Text>
            </View>
          )}
        </View>

        {/* Barra de Ações Rápidas */}
        <View style={styles.actionsRow}>
          {hasPhone && onWhatsApp && (
            <TouchableOpacity
              style={styles.btnPrimary}
              activeOpacity={0.85}
              onPress={onWhatsApp}
            >
              <Ionicons name="logo-whatsapp" size={18} color={colors.white} />
              <Text style={styles.btnPrimaryText}>WhatsApp</Text>
            </TouchableOpacity>
          )}

          {hasCoords && onOpenRoute && (
            <TouchableOpacity
              style={styles.btnSecondary}
              activeOpacity={0.8}
              onPress={onOpenRoute}
            >
              <Ionicons name="map-outline" size={18} color={colors.neutral[800]} />
              <Text style={styles.btnSecondaryText}>Rota</Text>
            </TouchableOpacity>
          )}

          {onShare && (
            <TouchableOpacity
              style={[styles.btnSecondary, !hasPhone && !hasCoords && { flex: 1 }]}
              activeOpacity={0.8}
              onPress={onShare}
            >
              <Ionicons name="share-social-outline" size={18} color={colors.neutral[800]} />
              {!hasPhone && !hasCoords && (
                <Text style={styles.btnSecondaryText}>Compartilhar</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    paddingBottom: 14,
  },
  coverBanner: {
    width: '100%',
    height: 96,
    backgroundColor: '#16a34a',
    overflow: 'hidden',
    position: 'relative',
  },
  coverCircleLarge: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255, 255, 255, 0.10)',
    top: -60,
    right: -30,
  },
  coverCircleSmall: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    bottom: -45,
    left: 20,
  },
  infoContainer: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  avatarWrapper: {
    marginTop: -42,
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 4,
    borderColor: colors.white,
    backgroundColor: colors.white,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    position: 'relative',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 42,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.semantic.info,
    borderWidth: 2,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  name: {
    fontSize: 21,
    fontWeight: '800',
    color: colors.neutral[900],
    textAlign: 'center',
  },
  verifiedSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.semantic.info,
    marginTop: 2,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginTop: 10,
  },
  badgeNeutral: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.neutral[100],
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  badgeNeutralText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.neutral[800],
  },
  badgeGreen: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#dcfce7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  badgeGreenText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#16a34a',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    marginTop: 16,
  },
  btnPrimary: {
    flex: 1,
    backgroundColor: '#16a34a',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 44,
    borderRadius: 12,
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  btnPrimaryText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
  btnSecondary: {
    paddingHorizontal: 14,
    backgroundColor: colors.neutral[50],
    borderWidth: 1,
    borderColor: colors.neutral[200],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 44,
    borderRadius: 12,
  },
  btnSecondaryText: {
    color: colors.neutral[800],
    fontWeight: '700',
    fontSize: 14,
  },
});