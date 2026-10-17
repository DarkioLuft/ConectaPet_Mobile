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
      setPet(data);
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