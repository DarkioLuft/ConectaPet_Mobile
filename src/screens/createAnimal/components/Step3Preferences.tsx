// Etapa 3: Nível de energia, sociabilidade com outros pets/crianças e cuidados especiais.

import { CustomTextInputField } from '@/components/forms/CustomTextInputField';
import { colors } from '@/constants/colors';
import { AnyAnimalForm, EnergyEnum } from '@/types/animal.types';
import { StyleSheet, Text, View } from 'react-native';
import { BooleanChoiceGroup } from '../../../components/forms/BooleanChoiceGroup';
import { SelectButtonGroup } from '../../../components/forms/SelectButtonGroup';
import { ENERGY_LABELS } from '../../../constants/enums';

interface Step3Props {
  data: AnyAnimalForm;
  onUpdate: <K extends keyof AnyAnimalForm>(k: K, v: AnyAnimalForm[K]) => void;
}

export function Step3Preferences({ data, onUpdate }: Step3Props) {
  return (
    <View>
      <Text style={styles.sectionTitle}>Preferências de Convivência</Text>

      <SelectButtonGroup<EnergyEnum>
        label="Nível de Energia *"
        selectedValue={data.energy as EnergyEnum}
        onSelect={(val) => onUpdate('energy', val)}
        options={(Object.keys(ENERGY_LABELS) as EnergyEnum[]).map((key) => ({
          label: ENERGY_LABELS[key],
          value: key,
        }))}
      />

      <Text style={styles.sectionHeaderTitle}>1. Sociabilidade e Espaço *</Text>

      <BooleanChoiceGroup
        label="Bom com crianças"
        value={data.good_with_kids!}
        onValueChange={(val) => onUpdate('good_with_kids', val)}
      />
      <BooleanChoiceGroup
        label="Bom com outros cachorros"
        value={data.good_with_dogs!}
        onValueChange={(val) => onUpdate('good_with_dogs', val)}
      />
      <BooleanChoiceGroup
        label="Bom com gatos"
        value={data.good_with_cats!}
        onValueChange={(val) => onUpdate('good_with_cats', val)}
      />
      <BooleanChoiceGroup
        label="Adequado para apartamento"
        value={data.apartment_friendly!}
        onValueChange={(val) => onUpdate('apartment_friendly', val)}
      />

      <Text style={styles.sectionHeaderTitle}>2. Cuidados Especiais *</Text>
      <BooleanChoiceGroup
        label="Possui necessidades especiais"
        value={data.special_needs!}
        onValueChange={(val) => onUpdate('special_needs', val)}
      />

      {data.special_needs && (
        <CustomTextInputField
          value={data.special_needs_desc || ''}
          label='Descrição das Necessidades Especiais *'
          onChangeText={(val) => onUpdate('special_needs_desc', val)}
          numberOfLines={3}
          multiline
          textAlignVertical="top"
          style={{ height: 80 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.neutral[800],
  },
  sectionHeaderTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primary[500],
    marginTop: 25,
    marginBottom: 8,
  }
});