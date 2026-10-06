// Componente de botões em grade para seleção única (espécie, sexo, porte, etc.).

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface SelectOption<T = string> {
  label: string;
  value: T;
}

interface SelectButtonGroupProps<T = string> {
  label?: string;
  options: SelectOption<T>[];
  selectedValue: T | null;
  onSelect: (value: T) => void;
  columns?: number;
}

export function SelectButtonGroup<T = string>({
  label,
  options,
  selectedValue,
  onSelect,
  columns = 3,
}: SelectButtonGroupProps<T>) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.row}>
        {options.map((option) => {
          const isSelected = selectedValue === option.value;
          const flexBasis = columns === 2 ? '48.5%' : columns === 3 ? '31.5%' : '100%';

          return (
            <TouchableOpacity
              key={String(option.value)}
              onPress={() => onSelect(option.value)}
              activeOpacity={0.7}
              style={[
                styles.button,
                { width: flexBasis as any },
                isSelected ? styles.buttonSelected : styles.buttonUnselected,
              ]}
            >
              <Text
                style={[
                  styles.buttonText,
                  isSelected ? styles.textSelected : styles.textUnselected,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 8,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonUnselected: {
    backgroundColor: '#ffffff',
    borderColor: '#d1d5db',
  },
  buttonSelected: {
    backgroundColor: '#16a34a',
    borderColor: '#16a34a',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  textUnselected: {
    color: '#374151',
  },
  textSelected: {
    color: '#ffffff',
    fontWeight: '700',
  },
});