// Barra inferior de navegação com alternância de ações por nível de permissão.
import { colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export type BottomTabType = 'home' | 'pets' | 'donations_or_manage' | 'profile';

interface ModernBottomBarProps {
  currentTab: BottomTabType;
  onSelectTab: (tab: BottomTabType) => void;
  isVolunteerOrAbove?: boolean;
}

export function ModernBottomBar({
  currentTab,
  onSelectTab,
  isVolunteerOrAbove = false,
}: ModernBottomBarProps) {
  const thirdTabLabel = isVolunteerOrAbove ? 'Manutenção' : 'Doações';
  const thirdTabIcon = isVolunteerOrAbove ? 'construct' : 'heart';
  const thirdTabIconOutline = isVolunteerOrAbove ? 'construct-outline' : 'heart-outline';

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onSelectTab('home')}
        style={styles.tabItem}
      >
        <Ionicons
          name={currentTab === 'home' ? 'home' : 'home-outline'}
          size={23}
          color={currentTab === 'home' ? colors.primary[500] : colors.neutral[400]}
        />
        <Text style={[styles.tabLabel, currentTab === 'home' && styles.tabLabelActive]}>
          Início
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onSelectTab('pets')}
        style={styles.tabItem}
      >
        <Ionicons
          name={currentTab === 'pets' ? 'paw' : 'paw-outline'}
          size={23}
          color={currentTab === 'pets' ? colors.primary[500] : colors.neutral[400]}
        />
        <Text style={[styles.tabLabel, currentTab === 'pets' && styles.tabLabelActive]}>
          Pets
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onSelectTab('donations_or_manage')}
        style={styles.tabItem}
      >
        <Ionicons
          name={currentTab === 'donations_or_manage' ? thirdTabIcon : thirdTabIconOutline}
          size={23}
          color={currentTab === 'donations_or_manage' ? colors.primary[500] : colors.neutral[400]}
        />
        <Text
          style={[
            styles.tabLabel,
            currentTab === 'donations_or_manage' && styles.tabLabelActive,
          ]}
        >
          {thirdTabLabel}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onSelectTab('profile')}
        style={styles.tabItem}
      >
        <Ionicons
          name={currentTab === 'profile' ? 'person' : 'person-outline'}
          size={23}
          color={currentTab === 'profile' ? colors.primary[500] : colors.neutral[400]}
        />
        <Text style={[styles.tabLabel, currentTab === 'profile' && styles.tabLabelActive]}>
          Perfil
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: Platform.OS === 'ios' ? 82 : 68,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: Platform.OS === 'ios' ? 18 : 6,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.neutral[400],
    marginTop: 3,
  },
  tabLabelActive: {
    color: colors.primary[500],
    fontWeight: '700',
  },
});