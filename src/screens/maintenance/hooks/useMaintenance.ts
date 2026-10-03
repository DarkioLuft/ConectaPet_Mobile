import { useNavigation } from '@react-navigation/native';
import { useMemo } from 'react';
import { Alert } from 'react-native';
import { BottomTabType } from '../../../components/navigation/ModernBottomBar';
import { MaintenanceAction } from '../types/maintenance.types';

export function useMaintenance() {
  const navigation = useNavigation<any>();

  const actions = useMemo<MaintenanceAction[]>(
    () => [
      {
        id: 'create_pet',
        title: 'Cadastrar pet',
        description: 'Adicione um novo animal disponível para adoção.',
        iconName: 'paw',
        accentColor: '#16a34a',
        onPress: () => navigation.navigate('CreateAnimal'),
      },
      {
        id: 'edit_pet',
        title: 'Editar pet',
        description: 'Gerencie informações, fotos ou exclua pets cadastrados.',
        iconName: 'create-outline',
        accentColor: '#0284c7',
        onPress: () => {
          Alert.alert('Em desenvolvimento', 'A listagem e edição de pets estará disponível em breve.');
        },
      },
      {
        id: 'create_notice',
        title: 'Cadastrar avisos',
        description: 'Publique avisos e notícias para o carrossel da tela inicial.',
        iconName: 'megaphone-outline',
        accentColor: '#eab308',
        onPress: () => {
          Alert.alert('Em desenvolvimento', 'O cadastro de avisos estará disponível em breve.');
        },
      },
      {
        id: 'reports',
        title: 'Relatórios',
        description: 'Visualize métricas de adoções, cadastros e atendimentos.',
        iconName: 'bar-chart-outline',
        accentColor: '#8b5cf6',
        onPress: () => {
          Alert.alert('Em desenvolvimento', 'O módulo de relatórios estará disponível em breve.');
        },
      },
    ],
    [navigation]
  );

  const handleTabSelect = (tab: BottomTabType) => {
  if (tab === 'home') {
    navigation.navigate('Home');
  } else if (tab === 'profile') {
    navigation.navigate('Profile'); // <-- Permite abrir o perfil a partir da manutenção
  }
};

  return {
    actions,
    handleTabSelect,
  };
}