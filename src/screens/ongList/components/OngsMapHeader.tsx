import { SearchBar } from '@/components/forms/SearchBar';
import { CustomMap, MapMarkerItem } from '@/components/maps/CustomMap';
import { colors } from '@/constants/colors';
import { StyleSheet, Text, View } from 'react-native';

interface OngsMapHeaderProps {
  center: { latitude: number; longitude: number };
  markers: MapMarkerItem[];
  searchQuery: string;
  onChangeSearch: (text: string) => void;
  totalCount: number;
  onSelectMarker: (ongId: string) => void;
}

export function OngsMapHeader({
  center,
  markers,
  searchQuery,
  onChangeSearch,
  totalCount,
  onSelectMarker,
}: OngsMapHeaderProps) {
  return (
    <View style={styles.container}>
      {/* Mapa no topo com todas as ONGs marcadas */}
      <View style={styles.mapWrapper}>
        <CustomMap
          latitude={center.latitude}
          longitude={center.longitude}
          markerTitle="ONGs Parceiras"
          markerDescription="Toque em um pino para ver detalhes"
          markers={markers}
          onMarkerCalloutPress={onSelectMarker}
          delta={0.12}
          height={210}
        />
      </View>

      {/* Busca genérica */}
      <View style={styles.searchWrapper}>
        <SearchBar
          value={searchQuery}
          onChangeText={onChangeSearch}
          placeholder="Buscar ONG por nome ou cidade..."
        />
      </View>

      {/* Título da lista */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>ONGs próximas a você</Text>
        <Text style={styles.countText}>
          {totalCount} {totalCount === 1 ? 'encontrada' : 'encontradas'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 12,
    paddingHorizontal: 18,
  },
  mapWrapper: {
    marginBottom: 14,
  },
  searchWrapper: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.neutral[900],
  },
  countText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary[500],
  },
});