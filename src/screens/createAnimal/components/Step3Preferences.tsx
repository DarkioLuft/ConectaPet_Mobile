// Etapa 3: Nível de energia, sociabilidade com outros pets/crianças e cuidados especiais.

import { StyleSheet, Text, TextInput, View } from 'react-native';
import { BooleanChoiceGroup } from '../../../components/forms/BooleanChoiceGroup';
import { SelectButtonGroup } from '../../../components/forms/SelectButtonGroup';
import { ENERGY_LABELS } from '../../../constants/enums';
import { CreateAnimalFormData, EnergyEnum } from '../types/createAnimal.types';

interface Step3Props {
  data: CreateAnimalFormData;
  onUpdate: <K extends keyof CreateAnimalFormData>(k: K, v: CreateAnimalFormData[K]) => void;
}

export function Step3Preferences({ data, onUpdate }: Step3Props) {
  return (
    <View>
      <SelectButtonGroup<EnergyEnum>
        label="Nível de Energia *"
        selectedValue={data.energy}
        onSelect={(val) => onUpdate('energy', val)}
        columns={3}
        options={(Object.keys(ENERGY_LABELS) as EnergyEnum[]).map((key) => ({
          label: ENERGY_LABELS[key],
          value: key,
        }))}
      />

      <Text style={styles.groupTitle}>Sociabilidade e Espaço *</Text>

      <BooleanChoiceGroup
        label="Bom com crianças"
        value={data.good_with_kids}
        onValueChange={(val) => onUpdate('good_with_kids', val)}
      />
      <BooleanChoiceGroup
        label="Bom com outros cachorros"
        value={data.good_with_dogs}
        onValueChange={(val) => onUpdate('good_with_dogs', val)}
      />
      <BooleanChoiceGroup
        label="Bom com gatos"
        value={data.good_with_cats}
        onValueChange={(val) => onUpdate('good_with_cats', val)}
      />
      <BooleanChoiceGroup
        label="Adequado para apartamento"
        value={data.apartment_friendly}
        onValueChange={(val) => onUpdate('apartment_friendly', val)}
      />

      <Text style={styles.groupTitle}>Cuidados Especiais *</Text>
      <BooleanChoiceGroup
        label="Possui necessidades especiais"
        value={data.special_needs}
        onValueChange={(val) => onUpdate('special_needs', val)}
      />

      {data.special_needs && (
        <View style={styles.specialNeedsContainer}>
          <Text style={styles.inputLabel}>Descrição das Necessidades Especiais *</Text>
          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            value={data.special_needs_desc}
            onChangeText={(val) => onUpdate('special_needs_desc', val)}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  groupTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginTop: 12,
    marginBottom: 6,
  },
  specialNeedsContainer: {
    marginTop: 10,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  textArea: {
    height: 80,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 10,
    fontSize: 15,
    color: '#1f2937',
  },
});