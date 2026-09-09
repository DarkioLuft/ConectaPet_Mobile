import { borderRadius } from '@/constants/borderRadius';
import { colors } from '@/constants/colors';
import { CreateAnimalScreen } from '@/screens/createAnimal/CreateAnimalScreen';
import DummyScreen from '@/screens/DummyScreen';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabRoutes() {
        const insets = useSafeAreaInsets();
        return (
                <>
                        <Tab.Navigator
                                screenOptions={{
                                        headerShown: false,
                                        tabBarShowLabel: false,
                                        tabBarActiveTintColor: colors.primary,
                                        tabBarInactiveTintColor: colors.textLight,
                                        tabBarStyle: [
                                                stylesLocal.tabBar,
                                                {
                                                        bottom: insets.bottom > 0 ? insets.bottom + 8 : 16
                                                }, // Eleva a barra acima da barra de gestos
                                        ],
                                        tabBarItemStyle: stylesLocal.tabBarItem,
                                        tabBarIconStyle: stylesLocal.tabBarIcon,
                                }}
                        >
                                <Tab.Screen
                                        name="Home"
                                        component={DummyScreen}
                                        options={{
                                                tabBarIcon: ({ color, focused }) => (
                                                        <View style={[stylesLocal.iconWrapper, focused && stylesLocal.activeIconWrapper]}>
                                                                <Ionicons
                                                                        name={focused ? 'home' : 'home-outline'}
                                                                        color={focused ? colors.primary : color}
                                                                        size={22}
                                                                />
                                                        </View>
                                                ),
                                        }}
                                />

                                <Tab.Screen
                                        name="CreateAnimal"
                                        component={CreateAnimalScreen}
                                        options={{
                                                tabBarIcon: ({ color, focused }) => (
                                                        <View style={[stylesLocal.iconWrapper, focused && stylesLocal.activeIconWrapper]}>
                                                                <Ionicons
                                                                        name={focused ? 'add' : 'add-outline'}
                                                                        color={focused ? colors.primary : color}
                                                                        size={22}
                                                                />
                                                        </View>
                                                        // <View style={stylesLocal.addButton}>
                                                        //         <Ionicons name="add" color="#FFF" size={26} />
                                                        // </View>
                                                ),
                                        }}
                                />
                        </Tab.Navigator>
                </>
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