// Grupo de opções em formato de pílulas/chips para seleção única com destaque visual.

import { Text, TouchableOpacity, View } from 'react-native';

export interface ChipOption<T = string> {
  label: string;
  value: T;
}

interface CustomChipGroupProps<T = string> {
  label?: string;
  options: ChipOption<T>[];
  selectedValue: T;
  onSelect: (value: T) => void;
  error?: string;
  disabled?: boolean;
}

export function CustomChipGroup<T = string>({
  label,
  options,
  selectedValue,
  onSelect,
  error,
  disabled = false,
}: CustomChipGroupProps<T>) {
  return (
    <View className="mb-4 w-full">
      {label && (
        <Text className="text-sm font-medium text-gray-700 mb-2">
          {label}
        </Text>
      )}

      <View className="flex-row flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selectedValue === option.value;
          return (
            <TouchableOpacity
              key={String(option.value)}
              disabled={disabled}
              onPress={() => onSelect(option.value)}
              activeOpacity={0.7}
              className={`px-4 py-2.5 rounded-full border transition-all ${
                isSelected
                  ? 'bg-emerald-600 border-emerald-600'
                  : 'bg-gray-50 border-gray-300'
              } ${disabled ? 'opacity-50' : ''}`}
            >
              <Text
                className={`text-sm font-medium ${
                  isSelected ? 'text-white' : 'text-gray-700'
                }`}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {error && <Text className="text-xs text-red-500 mt-1">{error}</Text>}
    </View>
  );
}