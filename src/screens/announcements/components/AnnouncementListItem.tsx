import { colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ManagedAnnouncement } from '../hooks/useManageAnnouncements';

interface AnnouncementListItemProps {
  item: ManagedAnnouncement;
  onPress: () => void;
  onDelete: () => void;
}

export function AnnouncementListItem({ item, onPress, onDelete }: AnnouncementListItemProps) {
  const createdAtLabel = new Date(item.created_at).toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  });

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={styles.card}>
      <View style={styles.orderBadge}>
        <Text style={styles.orderText}>{item.displayOrder}</Text>
      </View>

      <Image source={{ uri: item.image_url }} style={styles.image} resizeMode="cover" />

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={2}>
          {item.subtitle}
        </Text>
        <Text style={styles.date}>Cadastrado em {createdAtLabel}</Text>
      </View>

      <TouchableOpacity
        onPress={onDelete}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        style={styles.deleteButton}
      >
        <Ionicons name="trash-outline" size={20} color={colors.semantic.error} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    gap: 12,
  },
  orderBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primary[700],
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: colors.neutral[100],
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.neutral[800],
  },
  subtitle: {
    marginTop: 2,
    fontSize: 13,
    color: colors.neutral[600],
  },
  date: {
    marginTop: 6,
    fontSize: 11,
    color: colors.neutral[400],
  },
  deleteButton: {
    padding: 4,
  },
});
