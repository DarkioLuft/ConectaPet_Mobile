import { CustomPrimaryActionButton } from '@/components/buttons/CustomPrimaryActionButton';
import { TitleHeader } from '@/components/navigation/TitleHeader';
import { colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AnnouncementListItem } from './components/AnnouncementListItem';
import { useManageAnnouncements } from './hooks/useManageAnnouncements';

export function ManageAnnouncementsScreen() {
  const {
    announcements,
    totalCount,
    loading,
    refreshing,
    searchQuery,
    setSearchQuery,
    onRefresh,
    handleCreate,
    handleEdit,
    handleDelete,
    handleGoBack,
  } = useManageAnnouncements();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <TitleHeader title="Gerenciar anúncios" onPressBackButton={handleGoBack} />

      <FlatList
        data={announcements}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary[500]]} />
        }
        ListHeaderComponent={
          <View>
            <Text style={styles.helper}>
              A numeração segue a ordem de cadastro. O primeiro cadastrado aparece primeiro no carrossel.
            </Text>

            <CustomPrimaryActionButton
              text="Novo anúncio"
              onPress={handleCreate}
              style={styles.createButton}
            />

            <View style={styles.searchBox}>
              <Ionicons name="search-outline" size={18} color={colors.neutral[400]} />
              <TextInput
                placeholder="Buscar por título ou texto..."
                placeholderTextColor={colors.neutral[400]}
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={styles.searchInput}
              />
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Cadastrados</Text>
              <Text style={styles.countText}>{totalCount} no total</Text>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <AnnouncementListItem
            item={item}
            onPress={() => handleEdit(item.id)}
            onDelete={() => handleDelete(item)}
          />
        )}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator color={colors.primary[500]} style={styles.loader} />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
              {searchQuery.trim() ? 'Nenhum anúncio encontrado.' : 'Nenhum anúncio cadastrado.'}
            </Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  listContent: {
    paddingHorizontal: 18,
    paddingBottom: 40,
  },
  helper: {
    marginTop: 18,
    fontSize: 13,
    lineHeight: 18,
    color: colors.neutral[600],
  },
  createButton: {
    marginTop: 16,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral[100],
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    gap: 8,
    marginTop: 16,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.neutral[800],
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.neutral[900],
  },
  countText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.neutral[600],
  },
  loader: {
    marginTop: 28,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    color: colors.neutral[400],
    fontSize: 14,
  },
});
