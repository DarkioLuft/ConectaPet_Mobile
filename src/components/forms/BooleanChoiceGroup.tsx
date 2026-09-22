// Linha com botões "Sim" e "Não" para seleção de campos booleanos.

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
        <TouchableOpacity
          onPress={() => onValueChange(true)}
          activeOpacity={0.7}
          style={[
            styles.button,
            value === true ? styles.buttonActive : styles.buttonInactive,
          ]}
        >
          <Text style={[styles.buttonText, value === true ? styles.textActive : styles.textInactive]}>
            Sim
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onValueChange(false)}
          activeOpacity={0.7}
          style={[
            styles.button,
            value === false ? styles.buttonActive : styles.buttonInactive,
          ]}
        >
          <Text style={[styles.buttonText, value === false ? styles.textActive : styles.textInactive]}>
            Não
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  label: {
    fontSize: 15,
    color: '#1f2937',
    flex: 1,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    width: 62,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonActive: {
    backgroundColor: '#16a34a',
    borderColor: '#16a34a',
  },
  buttonInactive: {
    backgroundColor: '#ffffff',
    borderColor: '#d1d5db',
  },
  buttonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  textActive: {
    color: '#ffffff',
  },
  textInactive: {
    color: '#4b5563',
  },
});