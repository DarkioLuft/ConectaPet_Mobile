import { colors } from '@/constants/colors';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ModernBottomBar } from '../../components/navigation/ModernBottomBar';
import { MaintenanceActionCard } from './components/MaintenanceActionCard';
import { MaintenanceHeader } from './components/MaintenanceHeader';
import { useMaintenance } from './hooks/useMaintenance';
import { MaintenanceAction } from './types/maintenance.types';

export function MaintenanceScreen() {
  const { actions, handleTabSelect } = useMaintenance();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <MaintenanceHeader />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.actionsList}>
          {actions.map((action: MaintenanceAction) => (
            <MaintenanceActionCard key={action.id} action={action} />
          ))}
        </View>
      </ScrollView>

      <ModernBottomBar
        currentTab="donations_or_manage"
        onSelectTab={handleTabSelect}
        isVolunteerOrAbove={true}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 95,
  },
  actionsList: {
    marginTop: 4,
  },
});