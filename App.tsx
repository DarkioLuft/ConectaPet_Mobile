import { AppProvider } from '@/providers/AppProvider';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
        return (
                <NavigationContainer>
                        <StatusBar style="auto" />
                        <AppProvider />
                </NavigationContainer>
        );
}