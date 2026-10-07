import { CreateAnimalScreen } from '@/screens/createAnimal/CreateAnimalScreen';
import { UpdateAnimalScreen } from '@/screens/createAnimal/UpdateAnimalScreen';
import { HomeScreen } from '@/screens/home/HomeScreen';
import { MaintenanceScreen } from '@/screens/maintenance/MaintenanceScreen';
import { ProfileScreen } from '@/screens/profile/ProfileScreen'; // <-- Importe aqui
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

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
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Maintenance" component={MaintenanceScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export function AppRoutes() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={TabRoutes} />
      <Stack.Screen name="CreateAnimal" component={CreateAnimalScreen} />
      <Stack.Screen name="UpdateAnimal" component={UpdateAnimalScreen} />
    </Stack.Navigator>
  );
}