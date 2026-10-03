import { CreateAnimalScreen } from '@/screens/createAnimal/CreateAnimalScreen';
import { HomeScreen } from '@/screens/home/HomeScreen';
import { MaintenanceScreen } from '@/screens/maintenance/MaintenanceScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabRoutes() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' }, // Mantém oculta a barra padrão cinza
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Maintenance" component={MaintenanceScreen} />
    </Tab.Navigator>
  );
}

export function AppRoutes() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Abas com a barra inferior */}
      <Stack.Screen name="Tabs" component={TabRoutes} />

      {/* Telas que NÃO devem exibir a barra inferior */}
      <Stack.Screen name="CreateAnimal" component={CreateAnimalScreen} />
    </Stack.Navigator>
  );
}