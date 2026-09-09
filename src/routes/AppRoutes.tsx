import { colors } from '@/constants/colors';
import DummyScreen from '@/screens/DummyScreen';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabRoutes() {
        return (
                <>
                        <Tab.Navigator
                                screenOptions={{
                                        headerShown: false,
                                        tabBarShowLabel: false,
                                        tabBarActiveTintColor: colors.primary,
                                        tabBarInactiveTintColor: colors.textLight,
                                        tabBarStyle: {
                                                backgroundColor: colors.surface,
                                                borderTopWidth: 0,
                                                height: 70,
                                                position: 'absolute',
                                                bottom: 0,
                                                left: 0,
                                                right: 0,
                                                elevation: 20,
                                                shadowColor: '#000',
                                                shadowOpacity: 0.1,
                                                shadowRadius: 10,
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                        },
                                        tabBarItemStyle: {
                                                height: 70,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                        }
                                }}
                        >
                                <Tab.Screen
                                        name="Home"
                                        component={DummyScreen}
                                        options={{
                                                tabBarIcon: ({ color }) => <Ionicons name="home" color={color} size={28} />
                                        }}
                                />
                                {/* <Tab.Screen
                                        name="Extrato"
                                        component={DummyScreen}
                                        options={{
                                                tabBarIcon: ({ color }) => <Ionicons name="list" color={color} size={28} />
                                        }}
                                />

                                <Tab.Screen
                                        name="BotaoAdicionar"
                                        component={DummyScreen}
                                        options={{
                                                tabBarIcon: ({ color }) => <Ionicons name="list" color={color} size={28} />
                                        }}
                                />

                                <Tab.Screen
                                        name="Dashboard"
                                        component={DummyScreen}
                                        options={{
                                                tabBarIcon: ({ color }) => <Entypo name="bar-graph" color={color} size={26} />
                                        }}
                                />
                                <Tab.Screen
                                        name="Perfil"
                                        component={DummyScreen}
                                        options={{
                                                tabBarIcon: ({ color }) => <Ionicons name="person" color={color} size={28} />
                                        }}
                                /> */}
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