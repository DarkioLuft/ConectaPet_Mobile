import { useLocalSearchParams } from 'expo-router';
import { Stub } from '@/components/shared/Stub';

export default function OngAnimalEditar() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <Stub title="Editar animal" hint={`id: ${id}`} />;
}
