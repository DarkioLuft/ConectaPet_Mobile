import { useUserLocation } from '@/hooks/useUserLocation';
import { ongService } from '@/services/ongService';
import { GenericTabSection } from '@/types/tab.types';
import { handleError } from '@/utils/errorHandler';
import { calculateDistanceKm, parsePostGISLocation } from '@/utils/geoUtils';
import { AppToast } from '@/utils/toast';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useMemo, useState } from 'react';
import { Linking, Platform, Share } from 'react-native';

const ongTabs: GenericTabSection[] = [
  { key: 'about', label: 'Sobre', icon: 'information-circle-outline' },
  { key: 'pets', label: 'Pets', icon: 'paw-outline' },
  { key: 'donate', label: 'Doar', icon: 'heart-outline' },
];

export function useOngProfile(ongId: string) {
  const { userCoords, locationReady } = useUserLocation();

  const [activeTab, setActiveTab] = useState<GenericTabSection>(ongTabs[0]);
  const [loading, setLoading] = useState(true);
  const [rawOng, setRawOng] = useState<any | null>(null);

  const loadOngData = useCallback(async () => {
    if (!ongId) return;
    try {
      setLoading(true);

      const data = await ongService.getOngById(ongId);
      
      setRawOng(data);
    } catch (err: any) {
      handleError(err.message, 'Erro ao carregar perfil da ONG');
    } finally {
      setLoading(false);
    }
  }, [ongId]);

  useFocusEffect(
    useCallback(() => {
      loadOngData();
    }, [loadOngData])
  );

  // Formata os dados e recalcula a distância assim que o GPS estiver pronto
  const ongData = useMemo(() => {
    if (!rawOng) return null;

    console.log('rawOng', rawOng);

    const rawAddress = Array.isArray(rawOng.address) ? rawOng.address[0] : rawOng.address;
    const cityName = rawAddress?.city?.name || '';
    const stateAbbrev =
      rawAddress?.city?.state?.abbreviation?.trim() ||
      rawAddress?.city?.state?.[0]?.abbreviation?.trim() ||
      'RS';

    const coordinates = rawAddress?.location
      ? parsePostGISLocation(rawAddress.location)
      : null;

    const distance =
      coordinates && locationReady
        ? calculateDistanceKm(
          userCoords.latitude,
          userCoords.longitude,
          coordinates.latitude,
          coordinates.longitude
        )
        : null;

    return {
      ...rawOng,
      about: rawOng.description,
      logoUrl:
        rawOng.logo_url ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(rawOng.name)}&background=16a34a&color=fff&size=200`,
      pixKey: rawOng.cnpj || rawOng.email || rawOng.whatsapp || rawOng.phone || null,
      pixKeyType: rawOng.cnpj
        ? 'CNPJ'
        : rawOng.email
          ? 'E-mail'
          : rawOng.whatsapp || rawOng.phone
            ? 'Telefone'
            : null,
      address: {
        ...rawAddress,
        city: {
          name: cityName,
          state: { abbreviation: stateAbbrev },
        },
      },
      location: {
        coordinates,
        distance,
      },
    };
  }, [rawOng, userCoords, locationReady]);

  const handleWhatsApp = useCallback(() => {
    const phone = ongData?.whatsapp || ongData?.phone;
    if (!phone) {
      AppToast.info('Aviso', 'Esta ONG não cadastrou um número de WhatsApp.');
      return;
    }
    const cleanPhone = phone.replace(/\D/g, '');
    const withCountry = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
    const url = `whatsapp://send?phone=${withCountry}&text=${encodeURIComponent(
      `Olá, ${ongData.name}! Vim pelo aplicativo ConectaPet.`
    )}`;

    Linking.canOpenURL(url).then((supported) => {
      if (supported) Linking.openURL(url);
      else AppToast.error('Erro', 'WhatsApp não está instalado neste dispositivo.');
    });
  }, [ongData]);

  const handleOpenRoute = useCallback(() => {
    const coords = ongData?.location?.coordinates;
    if (!coords) {
      AppToast.info('Aviso', 'Coordenadas da ONG não disponíveis.');
      return;
    }
    const label = encodeURIComponent(ongData.name);
    const url = Platform.select({
      ios: `maps:0,0?q=${label}@${coords.latitude},${coords.longitude}`,
      android: `geo:0,0?q=${coords.latitude},${coords.longitude}(${label})`,
    });
    if (url) Linking.openURL(url);
  }, [ongData]);

  const handleShare = useCallback(async () => {
    if (!ongData) return;
    try {
      await Share.share({
        message: `Conheça a ${ongData.name} (${ongData.address?.city?.name}/${ongData.address?.city?.state?.abbreviation}) no ConectaPet e ajude a transformar vidas animais! 🐾`,
      });
    } catch {
      // Usuário cancelou o compartilhamento
    }
  }, [ongData]);

  return {
    tabs: ongTabs,
    activeTab,
    setActiveTab,
    loading,
    ongData,
    handleWhatsApp,
    handleOpenRoute,
    handleShare,
  };
}