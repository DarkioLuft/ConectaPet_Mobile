// Hook de orquestração do feed inicial: busca, filtros, refresh e nível de acesso.
import { useCallback, useEffect, useMemo, useState } from 'react';
import { animalService } from '../../../services/animalService';
import { CategoryFilter, HomePetCardData } from '../types/home.types';

export function useHome() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [pets, setPets] = useState<HomePetCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Flag de voluntário/gestor da ONG
  const [isVolunteer, setIsVolunteer] = useState(true);

  const loadPets = useCallback(async () => {
    try {
      setLoading(true);
      const data = await animalService.getAvailablePets(
        selectedCategory === 'all' ? undefined : selectedCategory
      );

      const formatted: HomePetCardData[] = data.map((item) => ({
        id: String(item.id),
        name: item.name,
        species: item.species,
        sex: item.sex,
        size: item.size,
        age_group: item.age_group,
        isVaccinated: Boolean(item.is_vaccinated),
        coverPhotoUrl: item.cover_photo_url,
        ongName: item.ongs?.name || 'APAAM',
      }));

      setPets(formatted);
    } catch (err) {
      console.error('Falha ao carregar animais:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    loadPets();
  }, [loadPets]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadPets();
  }, [loadPets]);

  const filteredPets = useMemo(() => {
    if (!searchQuery.trim()) return pets;
    const query = searchQuery.toLowerCase();
    return pets.filter(
      (pet) =>
        pet.name.toLowerCase().includes(query) ||
        pet.ongName.toLowerCase().includes(query)
    );
  }, [pets, searchQuery]);

  return {
    pets: filteredPets,
    loading,
    refreshing,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    isVolunteer,
    onRefresh,
  };
}