import { useNavigation } from '@react-navigation/native';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomTabType, ModernBottomBar } from '../../components/navigation/ModernBottomBar';
import { MaintenanceActionCard } from './components/MaintenanceActionCard';
import { MaintenanceHeader } from './components/MaintenanceHeader';
import { MaintenanceAction } from './types/maintenance.types';

export function MaintenanceScreen() {
  const navigation = useNavigation<any>();

  const handleSelectTab = (tab: BottomTabType) => {
    if (tab === 'home') {
      navigation.navigate('Home');
    }
  };

  const actions: MaintenanceAction[] = [
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
        Alert.alert('Em desenvolvimento', 'O cadastro de avisos e campanhas estará disponível em breve.');
      },
    },
    {
      id: 'reports',
      title: 'Relatórios',
      description: 'Visualize métricas de adoções, cadastros e atendimentos.',
      iconName: 'bar-chart-outline',
      accentColor: '#8b5cf6',
      onPress: () => {
        Alert.alert('Em desenvolvimento', 'O módulo de relatórios e métricas estará disponível em breve.');
      },
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <MaintenanceHeader />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.actionsList}>
          {actions.map((action) => (
            <MaintenanceActionCard key={action.id} action={action} />
          ))}
        </View>
      </ScrollView>

      {/* Barra inferior visível nesta tela com a aba de manutenção ativa */}
      <ModernBottomBar
        currentTab="donations_or_manage"
        onSelectTab={handleSelectTab}
        isVolunteerOrAbove={true}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 95, // Evita sobreposição com a ModernBottomBar
  },
  actionsList: {
    marginTop: 4,
  },
});