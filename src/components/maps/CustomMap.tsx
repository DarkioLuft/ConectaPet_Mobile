import { colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';

export interface MapMarkerItem {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  description?: string;
}

export interface CustomMapProps {
  latitude: number;
  longitude: number;
  markerTitle?: string;
  markerDescription?: string;
  markers?: MapMarkerItem[];
  onMarkerCalloutPress?: (id: string) => void;
  delta?: number;
  height?: number | string;
}

export function CustomMap({
  latitude,
  longitude,
  markerTitle = 'Local',
  markerDescription = '',
  markers,
  onMarkerCalloutPress,
  delta = 0.008,
  height = 180,
}: CustomMapProps) {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const hasMultipleMarkers = Array.isArray(markers) && markers.length > 0;

  const renderMarkers = () => {
    if (hasMultipleMarkers) {
      return markers.map((item) => (
        <Marker
          key={item.id}
          coordinate={{ latitude: item.latitude, longitude: item.longitude }}
          title={item.title}
          description={item.description}
          onCalloutPress={() => {
            if (onMarkerCalloutPress) {
              setIsFullScreen(false);
              onMarkerCalloutPress(item.id);
            }
          }}
        />
      ));
    }

    return (
      <Marker
        coordinate={{ latitude, longitude }}
        title={markerTitle}
        description={markerDescription}
      />
    );
  };

  return (
    <>
      <View style={[styles.mapContainer, { height: height as any }]}>
        <MapView
          style={styles.map}
          provider="google"
          region={{
            latitude,
            longitude,
            latitudeDelta: delta,
            longitudeDelta: delta,
          }}
          onPress={() => setIsFullScreen(true)}
          pitchEnabled={false}
          scrollEnabled={false}
        >
          {renderMarkers()}
        </MapView>

        <TouchableOpacity
          style={styles.expandButton}
          activeOpacity={0.85}
          onPress={() => setIsFullScreen(true)}
        >
          <Ionicons name="expand" size={18} color={colors.neutral[800]} />
          <Text style={styles.expandButtonText}>Expandir</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={isFullScreen}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setIsFullScreen(false)}
      >
        <SafeAreaView style={styles.modalSafeArea} edges={['top', 'bottom']}>
          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderInfo}>
              <Text style={styles.modalTitle}>{markerTitle}</Text>
              {markerDescription ? (
                <Text style={styles.modalSubtitle} numberOfLines={1}>
                  {markerDescription}
                </Text>
              ) : null}
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsFullScreen(false)}
              activeOpacity={0.8}
            >
              <Ionicons name="close" size={24} color={colors.neutral[800]} />
            </TouchableOpacity>
          </View>

          <View style={styles.fullScreenMapContainer}>
            <MapView
              style={styles.fullScreenMap}
              provider="google"
              initialRegion={{
                latitude,
                longitude,
                latitudeDelta: delta,
                longitudeDelta: delta,
              }}
              showsUserLocation
              showsMyLocationButton
              zoomControlEnabled
            >
              {renderMarkers()}
            </MapView>
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.neutral[200],
    backgroundColor: colors.neutral[100],
    position: 'relative',
  },
  map: { width: '100%', height: '100%' },
  expandButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
  },
  expandButtonText: { fontSize: 12, fontWeight: '700', color: colors.neutral[800] },
  modalSafeArea: { flex: 1, backgroundColor: colors.white },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
    backgroundColor: colors.white,
  },
  modalHeaderInfo: { flex: 1, marginRight: 12 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: colors.neutral[900] },
  modalSubtitle: { fontSize: 13, color: colors.neutral[600], marginTop: 2 },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreenMapContainer: { flex: 1 },
  fullScreenMap: { width: '100%', height: '100%' },
});