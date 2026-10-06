// Campo de texto com múltiplas linhas e contador de caracteres para descrições longas.

import { Text, TextInput, TextInputProps, View } from 'react-native';

interface CustomTextAreaFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  maxLength?: number;
}

export function CustomTextAreaField({
  label,
  error,
  maxLength = 500,
  value,
  ...rest
}: CustomTextAreaFieldProps) {
  return (
    <View className="mb-4 w-full">
      {label && (
        <Text className="text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </Text>
      )}
      <TextInput
        multiline
        numberOfLines={4}
        maxLength={maxLength}
        textAlignVertical="top"
        value={value}
        className={`w-full bg-gray-50 border rounded-2xl p-3.5 text-base text-gray-800 min-h-[110px] ${
          error ? 'border-red-500' : 'border-gray-300 focus:border-emerald-600'
        }`}
        placeholderTextColor="#9ca3af"
        {...rest}
      />
      <View className="flex-row justify-between items-center mt-1">
        {error ? (
          <Text className="text-xs text-red-500">{error}</Text>
        ) : (
          <View />
        )}
        <Text className="text-xs text-gray-400">
          {value?.length || 0}/{maxLength}
        </Text>
      </View>
    </View>
  );
}