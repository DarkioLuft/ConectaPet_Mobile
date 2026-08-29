import { Stack } from 'expo-router';

// TODO(Sprint 1): guard de sessao — redirecionar para /login quando nao houver usuario.
export default function AppLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
