import { colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';

interface PetOngLocationCardProps {
  ong: any;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export function PetOngLocationCard({ ong, coordinates }: PetOngLocationCardProps) {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const rawAddress = ong?.addresses;
  const address = Array.isArray(rawAddress) ? rawAddress[0] : rawAddress;

  const latitude = coordinates?.latitude || -29.396414;
  const longitude = coordinates?.longitude || -51.942209;
  const ongName = ong?.name || 'APAAM';
  const formattedAddress = address
    ? `${address.street}, ${address.number} - ${address.district}, ${address.cities?.name}/${address.cities?.states?.abbreviation?.trim()}`
    : 'Localização da ONG';

  return (
    <>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Localização da ONG</Text>

        <View style={styles.ongHeaderRow}>
          <View style={styles.ongIconContainer}>
            <Ionicons name="business" size={20} color={colors.primary[600]} />
          </View>
          <View style={styles.ongTextContainer}>
            <Text style={styles.ongName}>{ongName}</Text>
            {address && <Text style={styles.addressText}>{formattedAddress}</Text>}
          </View>
        </View>

        {/* Mini-mapa com botão de expandir para tela cheia */}
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            provider="google"
            initialRegion={{
              latitude,
              longitude,
              latitudeDelta: 0.008,
              longitudeDelta: 0.008,
            }}
            onPress={() => setIsFullScreen(true)}
          >
            <Marker
              coordinate={{ latitude, longitude }}
              title={ongName}
              description={formattedAddress}
            />
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
      </View>

      {/* Modal do Mapa em Tela Inteira */}
      <Modal
        visible={isFullScreen}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setIsFullScreen(false)}
      >
        <SafeAreaView style={styles.modalSafeArea} edges={['top', 'bottom']}>
          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderInfo}>
              <Text style={styles.modalTitle}>{ongName}</Text>
              <Text style={styles.modalSubtitle} numberOfLines={1}>
                {formattedAddress}
              </Text>
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
                latitudeDelta: 0.006,
                longitudeDelta: 0.006,
              }}
              showsUserLocation
              showsMyLocationButton
              zoomControlEnabled
            >
              <Marker
                coordinate={{ latitude, longitude }}
                title={ongName}
                description={formattedAddress}
              />
            </MapView>
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 18,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.neutral[900],
    marginBottom: 10,
  },
  ongHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  ongIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  ongTextContainer: {
    flex: 1,
  },
  ongName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.neutral[900],
  },
  addressText: {
    fontSize: 13,
    color: colors.neutral[600],
    marginTop: 2,
  },
  mapContainer: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.neutral[200],
    backgroundColor: colors.neutral[100],
    position: 'relative',
  },
  map: {
    width: '100%',
    height: '100%',
  },
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
  expandButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.neutral[800],
  },
  modalSafeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
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
  modalHeaderInfo: {
    flex: 1,
    marginRight: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.neutral[900],
  },
  modalSubtitle: {
    fontSize: 13,
    color: colors.neutral[600],
    marginTop: 2,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreenMapContainer: {
    flex: 1,
  },
  fullScreenMap: {
    width: '100%',
    height: '100%',
  },
});