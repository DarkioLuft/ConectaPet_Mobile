import { parsePostGISLocation } from '@/utils/geoUtils';
import { useMemo } from 'react';

export interface GenericAddressData {
  street?: string;
  number?: string;
  district?: string;
  location?: any;
  cities?: {
    name?: string;
    states?: {
      abbreviation?: string;
    };
  };
}

interface UseLocationCardProps {
  title?: string;
  addressData?: GenericAddressData | GenericAddressData[];
  fallbackCoordinates?: { latitude: number; longitude: number };
  defaultTitle?: string;
}

export function useLocationCard({
  title,
  addressData,
  fallbackCoordinates,
  defaultTitle = 'Local'
}: UseLocationCardProps) {

  return useMemo(() => {
    // Se o banco trouxer um array (ex: hasMany), pegamos o primeiro item
    const address = Array.isArray(addressData) ? addressData[0] : addressData;
    const displayTitle = title || defaultTitle;

    // Formatação de endereço robusta e segura
    const stateAbbrev = address?.cities?.states?.abbreviation
      || (Array.isArray(address?.cities?.states) ? address.cities.states[0]?.abbreviation : '');

    // const formattedAddress = address;

    const formattedAddress = address
      ? `${address.street || ''}, ${address.number || 'S/N'}${address.district ? ` - ${address.district}` : ''}, ${address.cities?.name || ''}${stateAbbrev ? `/${stateAbbrev.trim()}` : ''}`
      : 'Endereço não informado';

    // Determina as coordenadas: Tenta do PostGIS (banco), se não achar usa o Fallback.
    let latitude = fallbackCoordinates?.latitude || 0;
    let longitude = fallbackCoordinates?.longitude || 0;

    if (address?.location) {
      const parsed = parsePostGISLocation(address.location);
      if (parsed) {
        latitude = parsed.latitude;
        longitude = parsed.longitude;
      }
    }

    return {
      displayTitle,
      formattedAddress,
      latitude,
      longitude
    };
  }, [title, addressData, fallbackCoordinates, defaultTitle]);
}