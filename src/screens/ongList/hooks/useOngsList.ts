import { MapMarkerItem } from '@/components/maps/CustomMap';
import { useUserLocation } from '@/hooks/useUserLocation';
import { ongService } from '@/services/ongService';
import { OngListItem } from '@/types/ongList.types';
import { handleError } from '@/utils/errorHandler';
import { calculateDistanceKm, parsePostGISLocation } from '@/utils/geoUtils';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback, useMemo, useState } from 'react';

export function useOngsList() {
  const navigation = useNavigation<any>();
  const { userCoords, locationReady } = useUserLocation();

  const [rawOngs, setRawOngs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchOngs = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const data = await ongService.getActiveOngs();
      
      setRawOngs(data);
    } catch (err: any) {
      handleError(err.message, 'Erro ao carregar ONGs');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchOngs();
    }, [fetchOngs])
  );

  // Formata, calcula distância e ordena da menor para a maior distância
  const sortedOngs = useMemo<OngListItem[]>(() => {
    const mapped = rawOngs.map((item) => {
      const address = Array.isArray(item.addresses) ? item.addresses[0] : item.addresses;
      const city = address?.cities?.name || '';
      const state =
        address?.cities?.states?.abbreviation?.trim() ||
        address?.cities?.states?.[0]?.abbreviation?.trim() ||
        'RS';

      const formattedAddress = address
        ? `${address.street || ''}, ${address.number || 'S/N'}${address.district ? ` - ${address.district}` : ''}`
        : `${city}, ${state}`;

      const parsedCoords = address?.location
        ? parsePostGISLocation(address.location)
        : null;

      const latitude = parsedCoords?.latitude ?? userCoords.latitude;
      const longitude = parsedCoords?.longitude ?? userCoords.longitude;

      const distanceKm =
        parsedCoords && locationReady
          ? calculateDistanceKm(
              userCoords.latitude,
              userCoords.longitude,
              parsedCoords.latitude,
              parsedCoords.longitude
            )
          : null;

      return {
        id: item.id,
        name: item.name,
        description: item.description,
        logoUrl:
          item.logo_url ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=16a34a&color=fff`,
        isVerified: Boolean(item.is_verified),
        city,
        state,
        formattedAddress,
        latitude,
        longitude,
        distanceKm,
      };
    });

    // Ordenação: distância mais curta primeiro (itens sem coordenada vão para o fim)
    return mapped.sort((a, b) => {
      if (a.distanceKm === null && b.distanceKm === null) return a.name.localeCompare(b.name);
      if (a.distanceKm === null) return 1;
      if (b.distanceKm === null) return -1;
      return a.distanceKm - b.distanceKm;
    });
  }, [rawOngs, userCoords, locationReady]);

  // Filtro por texto (nome ou cidade)
  const filteredOngs = useMemo(() => {
    if (!searchQuery.trim()) return sortedOngs;
    const term = searchQuery.toLowerCase().trim();
    return sortedOngs.filter(
      (ong) =>
        ong.name.toLowerCase().includes(term) ||
        ong.city.toLowerCase().includes(term)
    );
  }, [sortedOngs, searchQuery]);

  // Marcadores para o CustomMap no topo
  const mapMarkers = useMemo<MapMarkerItem[]>(() => {
    return filteredOngs.map((ong) => ({
      id: ong.id,
      latitude: ong.latitude,
      longitude: ong.longitude,
      title: ong.name,
      description:
        ong.distanceKm !== null
          ? `a ${ong.distanceKm} km • ${ong.city}/${ong.state}`
          : `${ong.city}/${ong.state}`,
    }));
  }, [filteredOngs]);

  // Centro inicial do mapa (ONG mais próxima ou localização do usuário)
  const mapCenter = useMemo(() => {
    if (filteredOngs.length > 0) {
      return {
        latitude: filteredOngs[0].latitude,
        longitude: filteredOngs[0].longitude,
      };
    }
    return userCoords;
  }, [filteredOngs, userCoords]);

  const handleOpenOngProfile = useCallback(
    (ongId: string) => {
      navigation.navigate('OngProfile', { ongId });
    },
    [navigation]
  );

  const onRefresh = useCallback(() => {
    fetchOngs(true);
  }, [fetchOngs]);

  return {
    ongs: filteredOngs,
    mapMarkers,
    mapCenter,
    loading,
    refreshing,
    searchQuery,
    setSearchQuery,
    onRefresh,
    handleOpenOngProfile,
  };
}