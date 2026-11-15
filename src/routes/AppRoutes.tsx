import { ModernBottomBar } from '@/components/navigation/ModernBottomBar';
import { useAuth } from '@/contexts/AuthContext';
import { AnnouncementFormScreen } from '@/screens/announcements/AnnouncementFormScreen';
import { ManageAnnouncementsScreen } from '@/screens/announcements/ManageAnnouncementsScreen';
import { CreateAnimalScreen } from '@/screens/createAnimal/CreateAnimalScreen';
import { UpdateAnimalScreen } from '@/screens/createAnimal/UpdateAnimalScreen';
import { HomeScreen } from '@/screens/home/HomeScreen';
import { MaintenanceScreen } from '@/screens/maintenance/MaintenanceScreen';
import { ManageAnimalsScreen } from '@/screens/manageAnimals/ManageAnimalsScreen';
import { OngProfileScreen } from '@/screens/ongProfile/OngProfileScreen';
import { PetDetailsScreen } from '@/screens/petDetails/PetDetailsScreen';
import { ProfileScreen } from '@/screens/profile/ProfileScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabRoutes() {
  const { user } = useAuth();
  const isVolunteerOrAbove = user?.role === 'volunteer' || user?.role === 'admin';
  // const isVolunteerOrAbove = true;

  return (
    <Tab.Navigator
    // 👇 Centraliza a TabBar para todas as rotas abaixo
      tabBar={(props) => <ModernBottomBar {...props} isVolunteerOrAbove={isVolunteerOrAbove} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      
      <Tab.Screen name="Pets" component={ManageAnimalsScreen} />

      {/* A 3ª aba alterna dinamicamente a tela renderizada conforme a permissão */}
      <Tab.Screen
        name="DonationsOrManage"
        component={isVolunteerOrAbove ? MaintenanceScreen : HomeScreen /* Substitua por DonationsScreen */}
      />

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
      <Stack.Screen name="ManageAnimals" component={ManageAnimalsScreen} />
      <Stack.Screen name="ManageAnnouncements" component={ManageAnnouncementsScreen} />
      <Stack.Screen name="AnnouncementForm" component={AnnouncementFormScreen} />
      <Stack.Screen name="PetDetails" component={PetDetailsScreen} />
      <Stack.Screen name="OngProfile" component={OngProfileScreen} />
    </Stack.Navigator>
  );
}