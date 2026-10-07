import { useNavigation, useRoute } from '@react-navigation/native';
import { AnimalFormUI } from './AnimalFormUI';
import { useUpdateAnimal } from './hooks/useUpdateAnimal';

export function UpdateAnimalScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  // Pega o ID passado na navegação
  const { animalId } = route.params;

  const handleSuccess = () => {
    navigation.goBack();
  };

  // Chama o hook de atualização, passando o ID que veio da rota
  const updateProps = useUpdateAnimal(animalId, handleSuccess);

  return (
    <AnimalFormUI 
      {...updateProps} 
      mode="update" 
    />
  );
}