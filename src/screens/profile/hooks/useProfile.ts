import { addressService } from '@/services/addressService';
import { handleError } from '@/utils/errorHandler';
import { AppToast } from '@/utils/toast';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { supabase } from '../../../services/supabase';
import {
  AddressFormData,
  AdopterPreferencesFormData,
  HousingTypeOption,
  PersonalFormData,
  ProfileTabType
} from '../types/profile.types';

export function useProfile() {
  const navigation = useNavigation<any>();

  // Estados globais da tela
  const [userId, setUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ProfileTabType>('personal');
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isVolunteer, setIsVolunteer] = useState(false);
  const [housingTypes, setHousingTypes] = useState<HousingTypeOption[]>([]);

  // Estados dos dados "brutos" que serão repassados aos sub-hooks
  const [rawPersonal, setRawPersonal] = useState<PersonalFormData | null>(null);
  const [rawAddress, setRawAddress] = useState<AddressFormData | null>(null);
  const [rawPreferences, setRawPreferences] = useState<AdopterPreferencesFormData | null>(null);

  // Calcula o progresso com base nos dados salvos (perfil, endereço e preferências)
  const computeSavedProgress = (profile: PersonalFormData | null, address: AddressFormData | null, prefs: AdopterPreferencesFormData | null): number => {
    let score = 0;
    const totalFields = 9;

    if (profile?.fullName?.trim()) score++;
    if (profile?.cpf?.trim()) score++;
    if (profile?.phone?.trim()) score++;
    if (profile?.birthDate?.trim()) score++;
    if (address?.postalCode?.trim() && address?.street?.trim()) score++;
    if (prefs?.housingTypeId != null) score++;
    if (prefs?.hoursAlonePerDay != null) score++;
    if (prefs?.hasChildren != null) score++;
    if (prefs?.preferredSpecies != null) score++;

    return Math.round((score / totalFields) * 100);
  };

  const loadProfileData = useCallback(async () => {
    try {
      setLoading(true);

      // Pega o usuário logado (dependência inicial)
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setUserId(user.id);

      // Executa as consultas independentes todas ao mesmo tempo
      const [housingRes, profileRes, memberRes, addressRes, prefsRes] = await Promise.all([
        supabase.from('housing_types').select('id, name').order('id', { ascending: true }),
        supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
        supabase.from('ong_members').select('id').eq('profiles_id', user.id).limit(1),
        addressService.fetchAddressByUserId(user.id),
        supabase.from('adopter_preferences').select('*').eq('profiles_id', user.id).maybeSingle()
      ]);

      setHousingTypes(housingRes.data || []);
      console.log('Housing types fetched:', housingRes.data);
      setIsVolunteer(Boolean(memberRes.data && memberRes.data.length > 0));
      console.log('Is volunteer:', Boolean(memberRes.data && memberRes.data.length > 0));

      if (profileRes.data) {
        setRawPersonalData(profileRes.data);
      }

      console.log('Preferences data fetched:', prefsRes.data);
      if (prefsRes.data) {
        console.log('Preferences data fetched:', prefsRes.data);
        setRawPreferencesData(prefsRes.data);
      }

      if (addressRes) {
        setRawAddressData(addressRes as AddressFormData);
      }

      // Calcula o progresso final e atualiza a barra
      setProgress(computeSavedProgress(rawPersonal, rawAddress, rawPreferences));

    } catch (err: any) {
      handleError(err.message, 'Erro ao carregar dados do perfil');
      console.error('Erro ao carregar dados do perfil:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const setRawPersonalData = (profile: any) => {
    setRawPersonal({
      fullName: profile?.full_name || '',
      email: profile?.email || '',
      cpf: profile?.cpf || '',
      phone: profile?.phone || '',
      birthDate: profile?.birth_date || '',
      avatarUrl: profile?.avatar_url || null,
    });
  }

  const setRawAddressData = (address: any) => {
    setRawAddress({
      addressId: address.id || null,
      postalCode: address.postal_code || '',
      street: address.street || '',
      number: address.number ? String(address.number) : '',
      complement: address.complement || '',
      district: address.district || '',
      location: address.location_text || '',
      cityId: address.city_id || null,
      cityName: address.city_name || '',
      stateId: address.state_id || null,
      stateName: address.state_name || '',
      stateAbbreviation: address.state_abbreviation || '',
      countryId: address.country_id || null,
      countryName: address.country_name || '',
      countryAbbreviation: address.country_abbreviation || '',
    });
  }
  const setRawPreferencesData = (prefs: any) => {
    setRawPreferences({
      housingTypeId: prefs.housing_types_id ?? null,
      hasChildren: prefs.has_children ?? null,
      childrenAgeMin: prefs.children_age_min,
      hasOtherDogs: prefs.has_other_dogs ?? null,
      hasOtherCats: prefs.has_other_cats ?? null,
      hoursAlonePerDay: prefs.hours_alone_per_day ?? null,
      firstTimeOwner: prefs.first_time_owner ?? null,
      acceptsSpecialNeeds: prefs.accepts_special_needs ?? null,
      preferredSpecies: prefs.preferred_species ?? null,
      preferredSizes: prefs.preferred_sizes ?? [],
    });
  }

  useFocusEffect(
    useCallback(() => {
      loadProfileData();
    }, [loadProfileData])
  );

  const handleTabSelect = (tab: string) => {
    if (tab === 'home') {
      navigation.navigate('Home');
    } else if (tab === 'donations_or_manage') {
      if (isVolunteer) {
        navigation.navigate('Maintenance');
      } else {
        AppToast.info('Doações em breve!');
        console.log('Doações em breve!');
      }
    }
  };

  return {
    userId,
    activeTab,
    setActiveTab,
    loading,
    progress,
    isVolunteer,
    housingTypes,
    rawPersonal,
    rawAddress,
    rawPreferences,
    loadProfileData,
    handleTabSelect,
  };
}