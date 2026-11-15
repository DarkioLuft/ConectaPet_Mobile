import { TitleHeader } from '@/components/navigation/TitleHeader';
import { colors } from '@/constants/colors';
import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OngListCard } from './components/OngListCard';
import { OngsMapHeader } from './components/OngsMapHeader';
import { useOngsList } from './hooks/useOngsList';

export function OngsListScreen() {
  const navigation = useNavigation<any>();

  const {
    ongs,
    mapMarkers,
    mapCenter,
    loading,
    refreshing,
    searchQuery,
    setSearchQuery,
    onRefresh,
    handleOpenOngProfile,
  } = useOngsList();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <TitleHeader
        title="ONGs e Protetores"
        onPressBackButton={() => navigation.goBack()}
      />

      <FlatList
        data={ongs}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary[500]]} />
        }
        ListHeaderComponent={
          <OngsMapHeader
            center={mapCenter}
            markers={mapMarkers}
            searchQuery={searchQuery}
            onChangeSearch={setSearchQuery}
            totalCount={ongs.length}
            onSelectMarker={handleOpenOngProfile}
          />
        }
        renderItem={({ item }) => (
          <OngListCard
            ong={item}
            onPress={() => handleOpenOngProfile(item.id)}
          />
        )}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator color={colors.primary[500]} style={styles.loader} />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhuma ONG encontrada.</Text>
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
    paddingBottom: 40,
  },
  loader: {
    marginTop: 32,
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