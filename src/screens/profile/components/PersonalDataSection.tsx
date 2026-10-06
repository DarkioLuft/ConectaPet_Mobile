import { CustomPrimaryActionButton } from '@/components/buttons/CustomPrimaryActionButton';
import { CustomTextInputField } from '@/components/forms/CustomTextInputField';
import { StyleSheet, View } from 'react-native';
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
      <CustomTextInputField
        value={data.fullName}
        onChangeText={(val) => onChange('fullName', val)}
        placeholder="Seu nome completo"
        label="Nome Completo"
        editable={!saving}
      />

      <CustomTextInputField
        value={data.email}
        label="E-mail"
        editable={false}
        disabled={true}
      />

      <View style={styles.row}>
        <View style={styles.flex1}>
          <CustomTextInputField
            value={data.cpf}
            onChangeText={(val) => onChange('cpf', val)}
            placeholder="000.000.000-00"
            label="CPF"
            editable={!saving}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.flex1}>
          <CustomTextInputField
            value={data.phone}
            onChangeText={(val) => onChange('phone', val)}
            placeholder="(00) 00000-0000"
            label="Telefone"
            editable={!saving}
            keyboardType="phone-pad"
          />
        </View>
      </View>

      <CustomTextInputField
        value={data.birthDate}
        onChangeText={(val) => onChange('birthDate', val)}
        placeholder="Ex: 2000-05-15"
        label="Data de Nascimento (AAAA-MM-DD)"
        editable={!saving}
      />

      <CustomPrimaryActionButton
        text={'Salvar Dados Pessoais'}
        onPress={onSave}
        disabled={saving}
        loading={saving}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 18,
    paddingTop: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  flex1: {
    flex: 1,
  }
});