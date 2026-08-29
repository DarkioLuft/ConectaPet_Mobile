import { Text, View } from 'react-native';

type Props = {
  title: string;
  hint?: string;
};

/**
 * Placeholder temporario das telas ainda nao implementadas.
 * Substitua conforme cada tela entrar nas Sprints.
 */
export function Stub({ title, hint }: Props) {
  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Text className="text-xl font-semibold text-primary">{title}</Text>
      <Text className="mt-2 text-center text-muted">
        {hint ?? 'Tela ainda nao implementada.'}
      </Text>
    </View>
  );
}
