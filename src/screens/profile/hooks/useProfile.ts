import { useFocusEffect, useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { BottomTabType } from '../../../components/navigation/ModernBottomBar';
import { supabase } from '../../../services/supabase';
import {
    AddressFormData,
    AdopterPreferencesFormData,
    HousingTypeOption,
    PersonalFormData,
    ProfileTabType,
} from '../types/profile.types';

export function useProfile() {
  const navigation = useNavigation<any>();

  const [activeTab, setActiveTab] = useState<ProfileTabType>('personal');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isVolunteer, setIsVolunteer] = useState(false);
  const [housingTypes, setHousingTypes] = useState<HousingTypeOption[]>([]);
  
  // Estado isolado da barra: só muda com dados confirmados no Supabase
  const [progress, setProgress] = useState<number>(0);

  const [personalData, setPersonalData] = useState<PersonalFormData>({
    fullName: '',
    email: '',
    cpf: '',
    phone: '',
    birthDate: '',
    avatarUrl: null,
  });

  const [addressData, setAddressData] = useState<AddressFormData>({
    postalCode: '',
    street: '',
    number: '',
    complement: '',
    district: '',
    city: '',
    state: '',
  });

  const [preferencesData, setPreferencesData] = useState<AdopterPreferencesFormData>({
    housingTypeId: null,
    hasChildren: null,
    hasOtherDogs: null,
    hasOtherCats: null,
    hoursAlonePerDay: null,
    firstTimeOwner: null,
    acceptsSpecialNeeds: null,
    preferredSpecies: null,
    preferredSizes: [],
  });

  // Função pura que calcula o progresso estritamente com base nos dados que vieram do banco
  const computeSavedProgress = (
    profile: any,
    address: any,
    prefs: any
  ): number => {
    let score = 0;
    const totalFields = 9;

    if (profile?.full_name?.trim()) score++;
    if (profile?.cpf?.trim()) score++;
    if (profile?.phone?.trim()) score++;
    if (profile?.birth_date?.trim()) score++;
    if (address?.postal_code?.trim() && address?.street?.trim()) score++;
    if (prefs?.housing_types_id !== null && prefs?.housing_types_id !== undefined) score++;
    if (prefs?.hours_alone_per_day !== null && prefs?.hours_alone_per_day !== undefined) score++;
    if (prefs?.has_children !== null && prefs?.has_children !== undefined) score++;
    if (prefs?.preferred_species !== null && prefs?.preferred_species !== undefined) score++;

    return Math.round((score / totalFields) * 100);
  };

  const loadProfileData = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Tipos de moradia
      const { data: housingData } = await supabase
        .from('housing_types')
        .select('id, name')
        .order('id', { ascending: true });

      if (housingData) setHousingTypes(housingData);

      // 2. Dados de perfil
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      const meta = user.user_metadata || {};

      setPersonalData({
        fullName: profile?.full_name || meta.full_name || meta.name || '',
        email: profile?.email || user.email || '',
        cpf: profile?.cpf || meta.cpf || '',
        phone: profile?.phone || meta.phone || '',
        birthDate: profile?.birth_date || meta.birth_date || '',
        avatarUrl: profile?.avatar_url || null,
      });

      // 3. Endereço
      let loadedAddress = null;
      const addressId = profile?.address_id || profile?.addresses_id;
      if (addressId) {
        const { data: addr } = await supabase
          .from('addresses')
          .select('*')
          .eq('id', addressId)
          .maybeSingle();

        if (addr) {
          loadedAddress = addr;
          setAddressData({
            postalCode: addr.postal_code || '',
            street: addr.street || '',
            number: addr.number ? String(addr.number) : '',
            complement: addr.complement || '',
            district: addr.district || '',
            city: addr.city || '',
            state: addr.state || '',
          });
        }
      }

      // 4. Voluntário
      const { data: member } = await supabase
        .from('ong_members')
        .select('id')
        .eq('profiles_id', user.id)
        .limit(1);

      setIsVolunteer(Boolean(member && member.length > 0));

      // 5. Preferências de Adoção
      const { data: prefs } = await supabase
        .from('adopter_preferences')
        .select('*')
        .eq('profiles_id', user.id)
        .maybeSingle();

      if (prefs) {
        setPreferencesData({
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

      // Calcula o progresso real salvo no banco
      setProgress(computeSavedProgress(profile, loadedAddress, prefs));
    } catch (err: any) {
      console.error('Erro ao carregar dados do perfil:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadProfileData();
    }, [loadProfileData])
  );

  const handleCepChange = (text: string) => {
    setAddressData((prev) => ({ ...prev, postalCode: text }));
  };

  const savePersonalData = async () => {
    try {
      setSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado.');

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: personalData.fullName.trim(),
          cpf: personalData.cpf.trim(),
          phone: personalData.phone.trim(),
          birth_date: personalData.birthDate || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      await loadProfileData(); // Atualiza a barra de progresso após salvar
      Alert.alert('Sucesso', 'Dados pessoais atualizados com sucesso!');
    } catch (err: any) {
      Alert.alert('Erro', err.message || 'Falha ao salvar dados.');
    } finally {
      setSaving(false);
    }
  };

  const saveAddressData = async () => {
    try {
      setSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado.');

      // 1. Cadastra o endereço
      const { data: newAddr, error: addrError } = await supabase
        .from('addresses')
        .insert({
          postal_code: addressData.postalCode.trim(),
          street: addressData.street.trim(),
          number: addressData.number ? Number(addressData.number) : null,
          complement: addressData.complement.trim() || null,
          district: addressData.district.trim() || null,
        })
        .select('id')
        .single();

      if (addrError) throw addrError;

      // 2. Vincula à chave address_id em profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ address_id: newAddr.id, updated_at: new Date().toISOString() })
        .eq('id', user.id);

      if (profileError) throw profileError;

      await loadProfileData(); // Atualiza a barra de progresso após salvar
      Alert.alert('Sucesso', 'Endereço atualizado com sucesso!');
    } catch (err: any) {
      Alert.alert('Erro', err.message || 'Falha ao salvar endereço.');
    } finally {
      setSaving(false);
    }
  };

  const savePreferencesData = async () => {
    try {
      setSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado.');

      const payload = {
        profiles_id: user.id,
        housing_types_id: preferencesData.housingTypeId,
        has_children: preferencesData.hasChildren ?? false,
        children_age_min: preferencesData.childrenAgeMin,
        has_other_dogs: preferencesData.hasOtherDogs ?? false,
        has_other_cats: preferencesData.hasOtherCats ?? false,
        hours_alone_per_day: preferencesData.hoursAlonePerDay ?? 4,
        first_time_owner: preferencesData.firstTimeOwner ?? false,
        acceptsSpecialNeeds: preferencesData.acceptsSpecialNeeds ?? false,
        preferred_species: preferencesData.preferredSpecies || 'all',
        preferred_sizes:
          preferencesData.preferredSizes.length > 0
            ? preferencesData.preferredSizes
            : ['small', 'medium', 'large'],
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('adopter_preferences')
        .upsert(payload, { onConflict: 'profiles_id' });

      if (error) throw error;

      await loadProfileData(); // Atualiza a barra de progresso após salvar
      Alert.alert('Sucesso', 'Preferências salvas com sucesso!');
    } catch (err: any) {
      Alert.alert('Erro', err.message || 'Falha ao salvar preferências.');
    } finally {
      setSaving(false);
    }
  };

  const handlePickAvatar = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      base64: true,
    });

    if (!res.canceled && res.assets[0].base64) {
      try {
        setSaving(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const binaryString = atob(res.assets[0].base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        const fileName = `${user.id}_avatar.jpg`;
        await supabase.storage.from('animal-photos').upload(`avatars/${fileName}`, bytes, {
          contentType: 'image/jpeg',
          upsert: true,
        });

        const { data } = supabase.storage
          .from('animal-photos')
          .getPublicUrl(`avatars/${fileName}`);

        await supabase
          .from('profiles')
          .update({ avatar_url: data.publicUrl })
          .eq('id', user.id);

        setPersonalData((prev) => ({ ...prev, avatarUrl: data.publicUrl }));
      } catch {
        Alert.alert('Erro', 'Não foi possível alterar a foto de perfil.');
      } finally {
        setSaving(false);
      }
    }
  };

  const handleTabSelect = (tab: BottomTabType) => {
    if (tab === 'home') {
      navigation.navigate('Home');
    } else if (tab === 'donations_or_manage') {
      if (isVolunteer) {
        navigation.navigate('Maintenance');
      } else {
        Alert.alert('Doações', 'A área de doações estará disponível em breve!');
      }
    }
  };

  return {
    activeTab,
    setActiveTab,
    loading,
    saving,
    isVolunteer,
    housingTypes,
    personalData,
    setPersonalData,
    addressData,
    setAddressData,
    preferencesData,
    setPreferencesData,
    progress,
    handleCepChange,
    savePersonalData,
    saveAddressData,
    savePreferencesData,
    handlePickAvatar,
    handleTabSelect,
  };
}