import { colors } from '@/constants/colors';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AddressFormData } from '../types/profile.types';

interface AddressSectionProps {
  data: AddressFormData;
  onChange: (field: keyof AddressFormData, value: string) => void;
  onChangeCep: (cep: string) => void;
  onSave: () => void;
  saving: boolean;
}

export function AddressSection({ data, onChange, onChangeCep, onSave, saving }: AddressSectionProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.fieldLabel}>CEP</Text>
      <TextInput
        style={styles.input}
        value={data.postalCode}
        onChangeText={onChangeCep}
        placeholder=""
        keyboardType="numeric"
        maxLength={9}
      />

      <Text style={styles.fieldLabel}>Logradouro (Rua / Avenida)</Text>
      <TextInput
        style={styles.input}
        value={data.street}
        onChangeText={(val) => onChange('street', val)}
        placeholder=""
      />

      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.fieldLabel}>Número</Text>
          <TextInput
            style={styles.input}
            value={data.number}
            onChangeText={(val) => onChange('number', val)}
            placeholder=""
            keyboardType="numeric"
          />
        </View>

        <View style={{ flex: 1.5 }}>
          <Text style={styles.fieldLabel}>Complemento</Text>
          <TextInput
            style={styles.input}
            value={data.complement}
            onChangeText={(val) => onChange('complement', val)}
            placeholder=""
          />
        </View>
      </View>

      <Text style={styles.fieldLabel}>Bairro</Text>
      <TextInput
        style={styles.input}
        value={data.district}
        onChangeText={(val) => onChange('district', val)}
        placeholder=""
      />

      <View style={styles.row}>
        <View style={{ flex: 2 }}>
          <Text style={styles.fieldLabel}>Cidade</Text>
          <TextInput
            style={styles.input}
            value={data.city}
            onChangeText={(val) => onChange('city', val)}
            placeholder=""
          />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.fieldLabel}>UF</Text>
          <TextInput
            style={styles.input}
            value={data.state}
            onChangeText={(val) => onChange('state', val)}
            placeholder=""
            maxLength={2}
            autoCapitalize="characters"
          />
        </View>
      </View>

      <TouchableOpacity
        style={styles.saveButton}
        activeOpacity={0.8}
        onPress={onSave}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <Text style={styles.saveButtonText}>Gravar Endereço</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 18,
    paddingTop: 8,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.neutral[600],
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.neutral[100],
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 46,
    fontSize: 14,
    color: colors.neutral[800],
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  saveButton: {
    backgroundColor: colors.primary[500],
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 22,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
});