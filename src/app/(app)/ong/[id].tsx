import { useLocalSearchParams } from 'expo-router';
import { Stub } from '@/components/shared/Stub';

export default function OngDetalhe() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <Stub title="Perfil da ONG" hint={`id: ${id}`} />;
}
