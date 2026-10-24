import { animalService } from '@/services/animalService';
import { AppToast } from '@/utils/toast';
import { useRoute } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import { PetDetailsRouteParams } from '../types/petDetails.types';

// Função auxiliar para extrair coordenadas da coluna geography(Point, 4326) do PostGIS
function parsePostGISLocation(location: any): { latitude: number; longitude: number } | null {
  if (!location) return null;

  // 1. Caso venha como objeto GeoJSON: { type: 'Point', coordinates: [lng, lat] }
  if (typeof location === 'object' && Array.isArray(location.coordinates)) {
    const [longitude, latitude] = location.coordinates;
    if (typeof latitude === 'number' && typeof longitude === 'number') {
      return { latitude, longitude };
    }
  }

  // 2. Caso venha como texto WKT: "POINT(-51.942209 -29.396414)"
  if (typeof location === 'string' && location.toUpperCase().startsWith('POINT')) {
    const match = location.match(/POINT\s*\(\s*([-\d.]+)\s+([-\d.]+)\s*\)/i);
    if (match) {
      return {
        longitude: parseFloat(match[1]),
        latitude: parseFloat(match[2]),
      };
    }
  }

  // 3. Caso venha como Hex EWKB padrão do PostGIS (ex: 0101000020E6100000...)
  if (typeof location === 'string' && /^[0-9A-Fa-f]+$/.test(location) && location.length >= 50) {
    try {
      const hexToDoubleLE = (hexStr: string) => {
        const bytes = new Uint8Array(8);
        for (let i = 0; i < 8; i++) {
          bytes[i] = parseInt(hexStr.substr(i * 2, 2), 16);
        }
        return new DataView(bytes.buffer).getFloat64(0, true);
      };
      // Nos pontos EWKB com SRID (4326), os 16 bytes finais (32 chars hex) são X (lng) e Y (lat)
      const coordsHex = location.slice(-32);
      const longitude = hexToDoubleLE(coordsHex.slice(0, 16));
      const latitude = hexToDoubleLE(coordsHex.slice(16, 32));
      if (!isNaN(latitude) && !isNaN(longitude)) {
        return { latitude, longitude };
      }
    } catch {
      return null;
    }
  }

  return null;
}

export function usePetDetails() {
  const route = useRoute();
  const { animalId } = (route.params as PetDetailsRouteParams) || {};

  const [pet, setPet] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchPetDetails = useCallback(async () => {
    if (!animalId) return;
    try {
      setLoading(true);
      const data = await animalService.getAnimalDetailsWithOngAddress(animalId);

      // Coordenadas de fallback (APAAM - Arroio do Meio / RS)
      let coordinates = {
        latitude: -29.396414,
        longitude: -51.942209,
      };

      const rawAddress = data?.ongs?.addresses;
      const address = Array.isArray(rawAddress) ? rawAddress[0] : rawAddress;

      if (address?.location) {
        const parsed = parsePostGISLocation(address.location);
        if (parsed) {
          coordinates = parsed;
        }
      }

      setPet({
        ...data,
        coordinates,
      });
    } catch (error: any) {
      AppToast.error('Erro', error.message || 'Não foi possível carregar os detalhes do pet.');
    } finally {
      setLoading(false);
    }
  }, [animalId]);

  useEffect(() => {
    fetchPetDetails();
  }, [fetchPetDetails]);

  return {
    pet,
    loading,
  };
}