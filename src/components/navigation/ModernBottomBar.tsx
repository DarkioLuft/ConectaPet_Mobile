// Barra inferior de navegação com alternância de ações por nível de permissão.
import { colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ModernBottomBarProps extends BottomTabBarProps {
  isVolunteerOrAbove?: boolean;
}

export function ModernBottomBar({ state, descriptors, navigation, isVolunteerOrAbove }: ModernBottomBarProps) {
  // Mapeamento de ícones e labels por nome da rota
  const getTabConfig = (routeName: string, isFocused: boolean) => {
    switch (routeName) {
      case 'Home':
        return {
          label: 'Início',
          icon: isFocused ? 'home' : 'home-outline',
        };
      case 'Pets':
        return {
          label: 'Pets',
          icon: isFocused ? 'paw' : 'paw-outline',
        };
      case 'DonationsOrManage':
        return {
          label: isVolunteerOrAbove ? 'Manutenção' : 'ONGs',
          icon: isVolunteerOrAbove
            ? isFocused ? 'construct' : 'construct-outline'
            : isFocused ? 'heart' : 'heart-outline',
        };
      case 'Profile':
        return {
          label: 'Perfil',
          icon: isFocused ? 'person' : 'person-outline',
        };
      default:
        return { label: routeName, icon: 'ellipse-outline' };
    }
  };

  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const { label, icon } = getTabConfig(route.name, isFocused);

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            activeOpacity={0.7}
            onPress={onPress}
            style={styles.tabItem}
          >
            <Ionicons
              name={icon as keyof typeof Ionicons.glyphMap}
              size={23}
              color={isFocused ? colors.primary[500] : colors.neutral[400]}
            />
            <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
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
    shadowColor: colors.black,
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