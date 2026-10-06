import { AppProvider } from '@/providers/AppProvider';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { LogBox, StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  // Oculta os banners de alerta do Expo Go durante o desenvolvimento
  LogBox.ignoreAllLogs();

  return (
    <SafeAreaProvider>
      <View style={styles.root}>
        {/* Área principal da aplicação */}
        <View style={styles.appArea}>
          <NavigationContainer>
            <StatusBar style="auto" />
            <AppProvider />
          </NavigationContainer>
        </View>

        {/* Faixa preta dedicada aos botões de navegação do sistema Android */}
        <SafeAreaView edges={['bottom']} style={styles.androidSystemBar} />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000000',
  },
  appArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  androidSystemBar: {
    backgroundColor: '#000000',
  },
});