// Tela inicial integrando header, banner carrossel, filtros, lista de pets e barra de navegação.
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
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
import { BottomTabType, ModernBottomBar } from '../../components/navigation/ModernBottomBar';
import { HomeHeader } from './components/HomeHeader';
import { NewsBannerCarousel } from './components/NewsBannerCarousel';
import { PetCard } from './components/PetCard';
import { useHome } from './hooks/useHome';
import { CategoryFilter } from './types/home.types';

export function HomeScreen() {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState<BottomTabType>('home');

  const {
    pets,
    loading,
    refreshing,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    isVolunteer,
    onRefresh,
  } = useHome();

  const handleTabSelect = (tab: BottomTabType) => {
    setActiveTab(tab);
    if (tab === 'donations_or_manage') {
      if (isVolunteer) {
        navigation.navigate('CreateAnimal');
      }
    }
  };

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
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#16a34a']} />
        }
        ListHeaderComponent={
          <>
            <NewsBannerCarousel />

            <View style={styles.searchRow}>
              <View style={styles.searchBox}>
                <Ionicons name="search-outline" size={18} color="#9ca3af" />
                <TextInput
                  placeholder="Buscar por nome ou ONG..."
                  placeholderTextColor="#9ca3af"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  style={styles.searchInput}
                />
              </View>
              <TouchableOpacity style={styles.filterButton}>
                <Ionicons name="options-outline" size={20} color="#374151" />
              </TouchableOpacity>
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
            onPressCard={() => console.log('Detalhes:', item.id)}
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

      <ModernBottomBar
        currentTab={activeTab}
        onSelectTab={handleTabSelect}
        isVolunteerOrAbove={isVolunteer}
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
    paddingBottom: 95,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 18,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginBottom: 14,
    gap: 10,
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
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
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
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#16a34a',
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