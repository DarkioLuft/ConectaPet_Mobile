import * as Location from 'expo-location';
import { useCallback, useEffect, useState } from 'react';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

// Fallback regional (Vale do Taquari / RS)
const DEFAULT_COORDINATES: Coordinates = {
  latitude: -29.4486,
  longitude: -51.8058,
};

export function useUserLocation() {
  const [userCoords, setUserCoords] = useState<Coordinates>(DEFAULT_COORDINATES);
  const [locationReady, setLocationReady] = useState(false);

  const fetchUserLocation = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationReady(true);
        return;
      }

      const current = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setUserCoords({
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
      });
    } catch {
      // Mantém coordenadas padrão silenciosamente
    } finally {
      setLocationReady(true);
    }
  }, []);

  useEffect(() => {
    fetchUserLocation();
  }, [fetchUserLocation]);

  return {
    userCoords,
    locationReady,
    refreshLocation: fetchUserLocation,
  };
}