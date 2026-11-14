// Hook de orquestração do feed inicial: busca, filtros, ordenação por match, refresh e nível de acesso.
import { addressService } from '@/services/addressService';
import {
  AdopterMatchContext,
  calculatePetMatchScore,
  isUserMatchProfileComplete,
} from '@/utils/matchUtils';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { animalService } from '../../../services/animalService';
import { announcementService } from '../../../services/announcementService';
import { supabase } from '../../../services/supabase';
import { BannerItem, CategoryFilter, HomePetCardData } from '../types/home.types';

export function useHome() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [pets, setPets] = useState<HomePetCardData[]>([]);
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isVolunteer, setIsVolunteer] = useState(false);

  const checkVolunteerStatus = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsVolunteer(false);
        return;
      }

      const isMember = await animalService.checkUserIsVolunteer(user.id);
      setIsVolunteer(isMember);
    } catch (err) {
      console.error('Falha ao checar permissão de voluntário:', err);
      setIsVolunteer(false);
    }
  }, []);

  // Busca os dados do usuário para saber se o perfil de Match está 100% completo
  const fetchUserMatchContext = useCallback(async (): Promise<AdopterMatchContext | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const [profileRes, addressRes, prefsRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
        addressService.fetchAddressByUserId(user.id),
        supabase
          .from('adopter_preferences')
          .select('*, housing_types ( name )')
          .eq('profiles_id', user.id)
          .maybeSingle(),
      ]);

      const profile = profileRes.data;
      const address = addressRes;
      const prefs = prefsRes.data;

      if (!isUserMatchProfileComplete(profile, address, prefs)) {
        return null;
      }

      return {
        isComplete: true,
        housingTypeId: prefs.housing_types_id,
        housingTypeName: prefs.housing_types?.name,
        hasChildren: Boolean(prefs.has_children),
        hasOtherDogs: Boolean(prefs.has_other_dogs),
        hasOtherCats: Boolean(prefs.has_other_cats),
        hoursAlonePerDay: prefs.hours_alone_per_day ?? 4,
        firstTimeOwner: Boolean(prefs.first_time_owner),
        acceptsSpecialNeeds: Boolean(prefs.accepts_special_needs),
        preferredSpecies: prefs.preferred_species || 'all',
        preferredSizes: prefs.preferred_sizes || [],
        matchVector: prefs.match_vector || '',
      };
    } catch {
      return null;
    }
  }, []);

  const loadPets = useCallback(async () => {
    try {
      setLoading(true);

      const [data, matchContext] = await Promise.all([
        animalService.getAvailablePets(
          selectedCategory === 'all' ? undefined : selectedCategory
        ),
        fetchUserMatchContext(),
      ]);

      const formatted: HomePetCardData[] = data.map((item) => {
        const matchScore = matchContext
          ? calculatePetMatchScore(item, matchContext)
          : null;

        return {
          id: String(item.id),
          name: item.name,
          species: item.species,
          sex: item.sex,
          size: item.size,
          age_group: item.age_group,
          isVaccinated: Boolean(item.is_vaccinated),
          coverPhotoUrl: item.cover_photo_url,
          ongName: item.ongs?.name || 'APAAM',
          matchScore,
        };
      });

      // Se o usuário tiver o cadastro de match completo, ordena do maior score para o menor!
      if (matchContext) {
        formatted.sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0));
      }

      setPets(formatted);
    } catch (err) {
      console.error('Falha ao carregar animais:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedCategory, fetchUserMatchContext]);

  const loadAnnouncements = useCallback(async () => {
    try {
      const data = await announcementService.listByRegistrationOrder();
      setBanners(
        data.map((item) => ({
          id: item.id,
          title: item.title,
          subtitle: item.subtitle,
          imageUrl: item.image_url,
        }))
      );
    } catch (err) {
      console.error('Falha ao carregar anúncios:', err);
    }
  }, []);

  useEffect(() => {
    loadPets();
    loadAnnouncements();
    checkVolunteerStatus();
  }, [loadPets, loadAnnouncements, checkVolunteerStatus]);

  useFocusEffect(
    useCallback(() => {
      loadPets();
      loadAnnouncements();
      checkVolunteerStatus();
    }, [loadPets, loadAnnouncements, checkVolunteerStatus])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadPets();
    loadAnnouncements();
    checkVolunteerStatus();
  }, [loadPets, loadAnnouncements, checkVolunteerStatus]);

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
    banners,
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