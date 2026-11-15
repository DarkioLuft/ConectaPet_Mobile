export interface OngListItem {
  id: string;
  name: string;
  description: string | null;
  logoUrl: string;
  isVerified: boolean;
  city: string;
  state: string;
  formattedAddress: string;
  latitude: number;
  longitude: number;
  distanceKm: number | null;
}