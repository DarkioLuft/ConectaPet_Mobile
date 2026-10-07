import { colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ProfileHeaderProps {
  fullName: string;
  email: string;
  avatarUrl: string | null;
  isVolunteer: boolean;
  progress: number;
  onPressChangeAvatar: () => void;
}

export function ProfileHeader({
  fullName,
  email,
  avatarUrl,
  isVolunteer,
  progress,
  onPressChangeAvatar,
}: ProfileHeaderProps) {
  console.log(avatarUrl)

  return (
    <View style={styles.container}>
      <View style={styles.userRow}>
        <View style={styles.avatarContainer}>
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={38} color={colors.neutral[400]} />
            </View>
          )}
          <TouchableOpacity
            style={styles.cameraBadge}
            activeOpacity={0.8}
            onPress={onPressChangeAvatar}
          >
            <Ionicons name="camera" size={13} color={colors.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.infoCol}>
          <Text style={styles.userName} numberOfLines={2}>
            {fullName || 'Nome não informado'}
          </Text>
          {Boolean(email) && (
            <Text style={styles.userEmail} numberOfLines={1}>
              {email}
            </Text>
          )}
          <View style={[styles.roleBadge, isVolunteer && styles.volunteerBadge]}>
            <Text style={[styles.roleText, isVolunteer && styles.volunteerText]}>
              {isVolunteer ? 'Membro / Voluntário' : 'Adotante'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Conclusão do Cadastro para Match</Text>
          <Text style={styles.progressPercent}>{progress}%</Text>
        </View>
        <View style={styles.progressBarTrack}>
          <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressHint}>
          {progress < 100
            ? 'Complete o endereço e preferências para libertar o cálculo de afinidade!'
            : 'Perfil completo! Os seus matches com pets estão otimizados.'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary[600],
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 18,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2.5,
    borderColor: colors.white,
  },
  avatarPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: colors.white,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    backgroundColor: colors.primary[500],
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  infoCol: {
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    fontSize: 21,
    fontWeight: '800',
    color: colors.white,
    lineHeight: 26,
    letterSpacing: -0.3,
  },
  userEmail: {
    fontSize: 13,
    color: colors.neutral[200],
    marginTop: 2,
    fontWeight: '500',
  },
  roleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 6,
  },
  volunteerBadge: {
    backgroundColor: '#fef08a',
  },
  roleText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '700',
  },
  volunteerText: {
    color: '#854d0e',
  },
  progressCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 12,
    marginTop: 16,
    elevation: 2,
    shadowColor: colors.black,
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.neutral[800],
  },
  progressPercent: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary[500],
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: colors.neutral[200],
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary[500],
    borderRadius: 3,
  },
  progressHint: {
    fontSize: 11,
    color: colors.neutral[400],
    marginTop: 6,
  },
});