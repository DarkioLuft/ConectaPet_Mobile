// Tela inicial integrando header, banner carrossel, filtros, lista de pets e barra de navegação.
import { SearchBar } from '@/components/forms/SearchBar';
import { colors } from '@/constants/colors';
import { useNavigation } from '@react-navigation/native';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HomeHeader } from './components/HomeHeader';
import { NewsBannerCarousel } from './components/NewsBannerCarousel';
import { PetCard } from './components/PetCard';
import { useHome } from './hooks/useHome';
import { CategoryFilter } from './types/home.types';

export function HomeScreen() {
  const navigation = useNavigation<any>();

  const {
    pets,
    banners,
    loading,
    refreshing,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    onRefresh,
  } = useHome();

  const categories: { label: string; value: CategoryFilter }[] = [
    { label: 'Todos', value: 'all' },
    { label: 'Cães', value: 'dog' },
    { label: 'Gatos', value: 'cat' },
    { label: 'Outros', value: 'other' },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <HomeHeader />

      <FlatList
        data={pets}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary[500]]} />
        }
        ListHeaderComponent={
          <>
            <View style={{ marginTop: (banners?.length ?? 0) > 0 ? 32 : 16 }}>
              <NewsBannerCarousel banners={banners ?? []} />
            </View>

            <View style={{ marginBottom: 16, paddingHorizontal: 18 }}>
              <SearchBar
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder='Buscar por nome ou ONG...'
              />
            </View>

            <View style={styles.categoriesRow}>
              {categories.map((cat) => (
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
              <Text style={styles.sectionTitle}>Pets disponíveis</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>Ver todos</Text>
              </TouchableOpacity>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <PetCard
            pet={item}
            onPressCard={() => navigation.navigate('PetDetails', { animalId: item.id })}
          />
        )}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhum animal encontrado.</Text>
            </View>
          ) : (
            <ActivityIndicator color={colors.primary[500]} style={{ marginTop: 28 }} />
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
    paddingBottom: 95,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 18,
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
    backgroundColor: colors.neutral[100],
  },
  categoryChipActive: {
    backgroundColor: colors.primary[500],
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.neutral[600],
  },
  categoryChipTextActive: {
    color: colors.white,
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
    fontSize: 17,
    fontWeight: '800',
    color: colors.neutral[800],
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary[500],
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