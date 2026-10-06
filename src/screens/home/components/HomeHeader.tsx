// Cabeçalho verde superior com marca ConectaPet, atalho para notificações e botão de sair.
import { Ionicons } from '@expo/vector-icons';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../../services/supabase';

interface HomeHeaderProps {
  onPressNotifications?: () => void;
}

export function HomeHeader({ onPressNotifications }: HomeHeaderProps) {
  const handleSignOut = () => {
    Alert.alert(
      'Sair da Conta',
      'Tem certeza de que deseja encerrar sua sessão?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase.auth.signOut();
              if (error) throw error;
            } catch (error: any) {
              Alert.alert('Erro', error?.message || 'Não foi possível desconectar no momento.');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.header}>
      {/* Logotipo e Nome */}
      <View style={styles.brandRow}>
        <Ionicons name="paw" size={24} color="#ffffff" style={styles.brandIcon} />
        <Text style={styles.brandName}>ConectaPet</Text>
      </View>

      {/* Ações da Direita: Sininho e Logout */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onPressNotifications}
          style={styles.iconButton}
        >
          <Ionicons name="notifications-outline" size={22} color="#ffffff" />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleSignOut}
          style={styles.iconButton}
          accessibilityLabel="Sair da conta"
        >
          <Ionicons name="log-out-outline" size={22} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#15803d',
    paddingHorizontal: 20,
    paddingVertical: 14, // Padding simétrico para centralizar perfeitamente os botões
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // Bordas inferiores retas:
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandIcon: {
    marginRight: 8,
  },
  brandName: {
    fontSize: 21,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});