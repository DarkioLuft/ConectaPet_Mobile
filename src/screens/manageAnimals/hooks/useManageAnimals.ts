import { AppConfirm } from '@/components/modals/CustomConfirmModal';
import { animalService } from '@/services/animalService';
import { AppToast } from '@/utils/toast';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback, useMemo, useState } from 'react';
import { ManageCategoryFilter, ManagePetCardData } from '../types/manageAnimals.types';

export function useManageAnimals() {
  const navigation = useNavigation<any>();
  const [pets, setPets] = useState<ManagePetCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ManageCategoryFilter>('all');

  const fetchPets = useCallback(async () => {
    try {
      setLoading(true);
      const data = await animalService.getAvailablePets(
        selectedCategory === 'all' ? undefined : selectedCategory
      );

      const mappedPets: ManagePetCardData[] = data.map((item: any) => ({
        id: item.id,
        name: item.name,
        species: item.species,
        sex: item.sex,
        size: item.size,
        age_group: item.age_group,
        isVaccinated: Boolean(item.is_vaccinated),
        coverPhotoUrl: item.cover_photo_url || null,
        ongName: item.ongs?.name || 'APAAM',
      }));

      setPets(mappedPets);
    } catch (error: any) {
      AppToast.error('Erro', error.message || 'Não foi possível carregar os animais.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedCategory]);

  useFocusEffect(
    useCallback(() => {
      fetchPets();
    }, [fetchPets])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPets();
  }, [fetchPets]);

  const filteredPets = useMemo(() => {
    if (!searchQuery.trim()) return pets;
    const query = searchQuery.toLowerCase().trim();
    return pets.filter(
      (pet) =>
        pet.name.toLowerCase().includes(query) ||
        pet.ongName.toLowerCase().includes(query)
    );
  }, [pets, searchQuery]);

  const handleEditAnimal = useCallback(
    (animalId: string) => {
      navigation.navigate('UpdateAnimal', { animalId });
    },
    [navigation]
  );

  const handleDeleteAnimal = useCallback((pet: ManagePetCardData) => {
    AppConfirm.show({
      title: 'Remover Pet',
      message: `Tem certeza que deseja remover "${pet.name}" permanentemente do banco de dados?`,
      confirmText: 'Remover',
      cancelText: 'Cancelar',
      isDestructive: true,
      onConfirm: async () => {
        try {
          await animalService.deleteAnimal(pet.id);
          setPets((prev) => prev.filter((item) => item.id !== pet.id));
          AppToast.success('Sucesso', 'Animal removido com sucesso!');
        } catch (error: any) {
          AppToast.error('Erro ao remover', error.message || 'Não foi possível excluir o animal.');
        }
      },
    });
  }, []);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return {
    pets: filteredPets,
    loading,
    refreshing,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    onRefresh,
    handleEditAnimal,
    handleDeleteAnimal,
    handleGoBack,
  };
}