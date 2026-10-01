import { borderRadius } from '@/constants/borderRadius';
import { colors } from '@/constants/colors';
import { CreateAnimalScreen } from '@/screens/createAnimal/CreateAnimalScreen';
import { HomeScreen } from '@/screens/home/HomeScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet } from 'react-native';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabRoutes() {
        return (
                <Tab.Navigator
                        screenOptions={{
                                headerShown: false,
                                tabBarStyle: { display: 'none' },
                        }}
                >
                        <Tab.Screen
                                name="Home"
                                component={HomeScreen}
                        />
                        <Tab.Screen
                                name="CreateAnimal"
                                component={CreateAnimalScreen}
                        />
                </Tab.Navigator>
        );
}

export function AppRoutes() {
        return (
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                        <Stack.Screen name="Tabs" component={TabRoutes} />
                </Stack.Navigator>
        );
}

const stylesLocal = StyleSheet.create({
        tabBar: {
                position: 'absolute',
                left: 20,
                right: 20,
                backgroundColor: colors.surface,
                borderRadius: borderRadius.xxl ?? 24,
                height: 64,
                borderTopWidth: 0,
                paddingBottom: 0,
                elevation: 8,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.1,
                shadowRadius: 12,
        },
        tabBarItem: {
                height: 64,
                justifyContent: 'center',
                alignItems: 'center',
                padding: 0,
                margin: 0,
        },
        tabBarIcon: {
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                margin: 0,
                padding: 0,
        },
        iconWrapper: {
                width: 44,
                height: 44,
                borderRadius: 22,
                justifyContent: 'center',
                alignItems: 'center',
        },
        activeIconWrapper: {
                backgroundColor: 'rgba(32, 138, 239, 0.12)',
        },
        addButton: {
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: colors.primary,
                justifyContent: 'center',
                alignItems: 'center',
                elevation: 4,
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 6,
        },
});