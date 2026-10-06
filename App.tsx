import { AppProvider } from '@/providers/AppProvider';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { LogBox } from 'react-native';

export default function App() {
        
        // Oculta os banners de alerta do Expo Go durante o desenvolvimento
        LogBox.ignoreAllLogs();
        
        return (
                <NavigationContainer>
                        <StatusBar style="auto" />
                        <AppProvider />
                </NavigationContainer>
        );
}