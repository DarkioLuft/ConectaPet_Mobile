import { useLocalSearchParams } from 'expo-router';
import { Stub } from '@/components/shared/Stub';

export default function Doacao() {
  const { ongId } = useLocalSearchParams<{ ongId: string }>();
  return <Stub title="Doar via Pix" hint={`ONG: ${ongId}`} />;
}
