import { authService } from '@/services/authService';
import { Button, StyleSheet, View } from 'react-native';

const DummyScreen = () => {
  return (
    <View style={styles.container}>
      <Button 
        title="Fazer Logout" 
        onPress={authService.signOut} 
        color="#ff4444"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DummyScreen;