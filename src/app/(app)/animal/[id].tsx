import { useLocalSearchParams } from 'expo-router';
import { Stub } from '@/components/shared/Stub';

export default function AnimalDetalhe() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <Stub title="Detalhe do animal" hint={`id: ${id}`} />;
}
