import { animalService } from '@/services/animalService';
import { parsePostGISLocation } from '@/utils/geoUtils';
import { AppToast } from '@/utils/toast';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import { PetDetailsRouteParams } from '../types/petDetails.types';

export function usePetDetails() {
  const route = useRoute();
  const navigation = useNavigation<any>();
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

  const onCardClick = (id: String) => {
    console.log(id)
    navigation.navigate('OngProfile', { ongId: id })
  }

  return {
    pet,
    onCardClick,
    loading,
  };
}