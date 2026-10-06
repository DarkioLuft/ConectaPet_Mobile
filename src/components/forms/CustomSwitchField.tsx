// Linha com rótulo descritivo e interruptor liga/desliga (toggle switch).

import { colors } from '@/constants/colors';
import { Switch, Text, View } from 'react-native';

interface CustomSwitchFieldProps {
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}

export function CustomSwitchField({
  label,
  description,
  value,
  onValueChange,
  disabled = false,
}: CustomSwitchFieldProps) {
  return (
    <View className="flex-row items-center justify-between py-3 border-b border-gray-100">
      <View className="flex-1 pr-4">
        <Text className="text-base font-medium text-gray-800">{label}</Text>
        {description && (
          <Text className="text-xs text-gray-500 mt-0.5">{description}</Text>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{ false: colors.neutral[200], true: colors.primary[500] }}
        thumbColor={value ? colors.white : colors.neutral[50]}
      />
    </View>
  );
}