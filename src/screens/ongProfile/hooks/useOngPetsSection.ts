import { animalService } from '@/services/animalService';
import { handleError } from '@/utils/errorHandler';
import { useEffect, useState } from 'react';

interface UseOngPetsSectionProps {
  ongId: String
}

export function useOngPetsSection({ ongId }: UseOngPetsSectionProps) {
  const [pets, setPets] = useState<any[]>([]);
  const [loadingPets, setLoadingPets] = useState(false);

  useEffect(() => {
    async function loadPets() {
      try {
        setLoadingPets(true);
        const data = await animalService.getPetsByOngId(ongId);

        if (!data){
          throw new Error("Erro ao carregar os dados dos animais.")
        }

        setPets(data);
      } catch (err: any) {
        handleError(err.message, 'Erro ao carregar dados.');
      } finally {
        setLoadingPets(false);
      }
    }

    if (ongId) loadPets();
  }, [ongId]);

  return { pets, loadingPets };
}