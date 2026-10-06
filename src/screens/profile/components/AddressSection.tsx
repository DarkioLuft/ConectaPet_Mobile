import { CustomPrimaryActionButton } from '@/components/buttons/CustomPrimaryActionButton';
import { CustomTextInputField } from '@/components/forms/CustomTextInputField';
import { StyleSheet, View } from 'react-native';
import { AddressFormData } from '../types/profile.types';

interface AddressSectionProps {
  data: AddressFormData | null;
  onChange: (field: keyof AddressFormData, value: string) => void;
  onChangeCep: (cep: string) => void;
  onSave: () => void;
  saving: boolean;
}

export function AddressSection({ data, onChange, onChangeCep, onSave, saving }: AddressSectionProps) {
  return (
    <View style={styles.container}>
      <CustomTextInputField
        value={data?.postalCode ? data.postalCode : ''}
        onChangeText={(val) => onChangeCep(val)}
        placeholder="00000-000"
        label="CEP"
        editable={!saving}
        keyboardType="numeric"
        maxLength={9}
      />

      <CustomTextInputField
        value={data?.street ? data.street : ''}
        onChangeText={(val) => onChange('street', val)}
        placeholder=""
        label="Logradouro (Rua / Avenida)"
        editable={!saving}
      />

      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <CustomTextInputField
            value={data?.number ? data.number : ''}
            onChangeText={(val) => onChange('number', val)}
            placeholder=""
            label="Número"
            editable={!saving}
            keyboardType="numeric"
          />
        </View>

        <View style={{ flex: 1.5 }}>
          <CustomTextInputField
            value={data?.complement ? data.complement : ''}
            onChangeText={(val) => onChange('complement', val)}
            placeholder=""
            label="Complemento (Opcional)"
            editable={!saving}
          />
        </View>
      </View>

      <CustomTextInputField
        value={data?.district ? data.district : ''}
        onChangeText={(val) => onChange('district', val)}
        placeholder=""
        label="Bairro"
        editable={!saving}
      />

      <View style={styles.row}>
        <View style={{ flex: 2 }}>
          <CustomTextInputField
            value={data?.cityName ? data.cityName : ''}
            placeholder=""
            label="Cidade"
            editable={false}
            disabled={data?.cityName ? true : false}
          />
        </View>

        <View style={{ flex: 1 }}>
          <CustomTextInputField
            value={data?.stateAbbreviation ? data.stateAbbreviation : ''}
            placeholder=""
            label="UF"
            editable={false}
            disabled={data?.stateAbbreviation ? true : false}
          />
        </View>
      </View>

      <CustomPrimaryActionButton
        text={'Salvar Endereço'}
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
  }
});