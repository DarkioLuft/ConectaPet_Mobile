import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { PersonalFormData } from '../types/profile.types';

interface PersonalDataSectionProps {
  data: PersonalFormData;
  onChange: (field: keyof PersonalFormData, value: string) => void;
  onSave: () => void;
  saving: boolean;
}

export function PersonalDataSection({ data, onChange, onSave, saving }: PersonalDataSectionProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.fieldLabel}>Nome Completo</Text>
      <TextInput
        style={styles.input}
        value={data.fullName}
        onChangeText={(val) => onChange('fullName', val)}
        placeholder="Seu nome completo"
      />

      <Text style={styles.fieldLabel}>E-mail</Text>
      <TextInput
        style={[styles.input, styles.disabledInput]}
        value={data.email}
        editable={false}
      />

      <View style={styles.row}>
        <View style={styles.flex1}>
          <Text style={styles.fieldLabel}>CPF</Text>
          <TextInput
            style={styles.input}
            value={data.cpf}
            onChangeText={(val) => onChange('cpf', val)}
            placeholder="000.000.000-00"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.flex1}>
          <Text style={styles.fieldLabel}>Telefone</Text>
          <TextInput
            style={styles.input}
            value={data.phone}
            onChangeText={(val) => onChange('phone', val)}
            placeholder="(00) 00000-0000"
            keyboardType="phone-pad"
          />
        </View>
      </View>

      <Text style={styles.fieldLabel}>Data de Nascimento (AAAA-MM-DD)</Text>
      <TextInput
        style={styles.input}
        value={data.birthDate}
        onChangeText={(val) => onChange('birthDate', val)}
        placeholder="Ex: 2000-05-15"
      />

      <TouchableOpacity
        style={styles.saveButton}
        activeOpacity={0.8}
        onPress={onSave}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.saveButtonText}>Salvar Dados Pessoais</Text>
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
    color: '#374151',
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 46,
    fontSize: 14,
    color: '#111827',
  },
  disabledInput: {
    backgroundColor: '#f3f4f6',
    color: '#6b7280',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  flex1: {
    flex: 1,
  },
  saveButton: {
    backgroundColor: '#16a34a',
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 22,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
});