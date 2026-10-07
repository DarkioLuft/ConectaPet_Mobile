// Componente de botões em grade para seleção única (espécie, sexo, porte, etc.).

import { colors } from '@/constants/colors';
import { StyleSheet, Text, View } from 'react-native';
import { CustomChip } from './CustomChip';

export interface SelectOption<T = string> {
  label: string;
  value: T;
}

interface SelectButtonGroupProps<T = string> {
  label?: string;
  options: SelectOption<T>[];
  selectedValue: T | null;
  onSelect: (value: T) => void;
}

export function SelectButtonGroup<T = string>({
  label,
  options,
  selectedValue,
  onSelect,
}: SelectButtonGroupProps<T>) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.row}>
        {options.map((option) => {
          const isSelected = selectedValue === option.value;

          return (
            <CustomChip
              key={String(option.value)}
              label={option.label}
              selected={isSelected}
              onPress={() => onSelect(option.value)}
              style={{ flex: 1 }}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    width: '100%',
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.neutral[400],
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
});