import { useNavigation } from '@react-navigation/native';
import { AnimalFormUI } from './AnimalFormUI';
import { useCreateAnimal } from './hooks/useCreateAnimal';

export function CreateAnimalScreen() {
  const navigation = useNavigation<any>();

  // Ação disparada quando o backend responde com sucesso
  const handleSuccess = () => {
    navigation.goBack();
  };

  // Chama o hook de criação
  const createProps = useCreateAnimal(handleSuccess);

  return (
    <AnimalFormUI
      {...createProps}
      mode="create"
    />
  );
}