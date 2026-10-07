// Linha com botões "Sim" e "Não" para seleção de campos booleanos.

import { colors } from '@/constants/colors';
import { StyleSheet, Text, View } from 'react-native';
import { CustomChip } from './CustomChip';

interface BooleanChoiceGroupProps {
  label: string;
  value: boolean | null;
  onValueChange: (val: boolean) => void;
}

export function BooleanChoiceGroup({
  label,
  value,
  onValueChange,
}: BooleanChoiceGroupProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.buttonGroup}>
        <CustomChip
          label={'Sim'}
          selected={value == true ? true : false}
          onPress={() => onValueChange(true)}
          style={{ flex: 1 }}
        />

        <CustomChip
          label={'Não'}
          selected={value == false ? true : false}
          onPress={() => onValueChange(false)}
          style={{ flex: 1 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.neutral[400],
    marginBottom: 6,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
});