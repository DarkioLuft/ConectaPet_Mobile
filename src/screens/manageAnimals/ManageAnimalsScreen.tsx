import { Ionicons } from '@expo/vector-icons';
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PetCard } from '../home/components/PetCard';
import { ManageAnimalsHeader } from './components/ManageAnimalsHeader';
import { useManageAnimals } from './hooks/useManageAnimals';
import { ManageCategoryFilter } from './types/manageAnimals.types';

const CATEGORIES: { label: string; value: ManageCategoryFilter }[] = [
  { label: 'Todos', value: 'all' },
  { label: 'Cães', value: 'dog' },
  { label: 'Gatos', value: 'cat' },
  { label: 'Outros', value: 'other' },
];

export function ManageAnimalsScreen() {
  const {
    pets,
    loading,
    refreshing,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    onRefresh,
    handleEditAnimal,
    handleDeleteAnimal,
    handleGoBack,
  } = useManageAnimals();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ManageAnimalsHeader onBack={handleGoBack} />

      <FlatList
        data={pets}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#16a34a']} />
        }
        ListHeaderComponent={
          <>
            <View style={styles.searchRow}>
              <View style={styles.searchBox}>
                <Ionicons name="search-outline" size={18} color="#9ca3af" />
                <TextInput
                  placeholder="Buscar pet para editar ou excluir..."
                  placeholderTextColor="#9ca3af"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  style={styles.searchInput}
                />
              </View>
            </View>

            <View style={styles.categoriesRow}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.value}
                  onPress={() => setSelectedCategory(cat.value)}
                  style={[
                    styles.categoryChip,
                    selectedCategory === cat.value && styles.categoryChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      selectedCategory === cat.value && styles.categoryChipTextActive,
                    ]}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Selecione um pet para editar</Text>
              <Text style={styles.countText}>{pets.length} cadastrados</Text>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <PetCard
            pet={item}
            showFavoriteButton={false}
            onPressCard={() => handleEditAnimal(item.id)}
            onDeletePress={() => handleDeleteAnimal(item)}
          />
        )}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhum animal encontrado.</Text>
            </View>
          ) : (
            <ActivityIndicator color="#16a34a" style={{ marginTop: 28 }} />
          )
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  listContent: {
    paddingBottom: 40,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 18,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginTop: 18,
    marginBottom: 14,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1f2937',
  },
  categoriesRow: {
    flexDirection: 'row',
    paddingHorizontal: 18,
    gap: 10,
    marginBottom: 16,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  categoryChipActive: {
    backgroundColor: '#16a34a',
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#4b5563',
  },
  categoryChipTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  countText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    color: '#9ca3af',
    fontSize: 14,
  },
});