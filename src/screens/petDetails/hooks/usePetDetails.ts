import { animalService } from '@/services/animalService';
import { AppToast } from '@/utils/toast';
import { useRoute } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import { PetDetailsRouteParams } from '../types/petDetails.types';

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
      
      console.log('🐾 [DEBUG] Dados completos do pet vindos do Supabase:', JSON.stringify(data, null, 2));

      // Coordenadas padrão de fallback (APAAM - Arroio do Meio / Lajeado)
      let latitude = -29.396414;
      let longitude = -51.942209;

      const address = data?.ongs?.addresses;
      console.log('📍 [DEBUG] Endereço da ONG encontrado:', address);

      // Se o banco retornar location, podemos tentar inspecionar ou usar
      if (address?.location) {
        console.log('🗺️ [DEBUG] Campo location encontrado no banco:', address.location);
      }

      setPet({
        ...data,
        coordinates: { latitude, longitude },
      });
    } catch (error: any) {
      console.error('❌ [DEBUG] Erro ao buscar detalhes:', error);
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