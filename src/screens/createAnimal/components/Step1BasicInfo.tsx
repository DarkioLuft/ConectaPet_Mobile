// Etapa 1: Identificação básica do animal (nome, espécie, sexo, porte, idade e peso).

import { CustomTextInputField } from '@/components/forms/CustomTextInputField';
import { colors } from '@/constants/colors';
import { StyleSheet, Text, View } from 'react-native';
import { SelectButtonGroup } from '../../../components/forms/SelectButtonGroup';
import {
  AGE_GROUP_LABELS,
  SEX_LABELS,
  SIZE_LABELS,
  SPECIES_LABELS,
} from '../../../constants/enums';
import {
  AgeGroupEnum,
  CreateAnimalFormData,
  SexEnum,
  SizeEnum,
  SpeciesEnum,
} from '../types/createAnimal.types';

interface Step1Props {
  data: CreateAnimalFormData;
  onUpdate: <K extends keyof CreateAnimalFormData>(k: K, v: CreateAnimalFormData[K]) => void;
}

export function Step1BasicInfo({ data, onUpdate }: Step1Props) {
  return (
    <View>
      <Text style={styles.sectionTitle}>Identificação Básica</Text>

      <CustomTextInputField
        value={data.name}
        label='Nome do Pet *'
        onChangeText={(val) => onUpdate('name', val)}
      />

      <SelectButtonGroup<SpeciesEnum>
        label="Espécie *"
        selectedValue={data.species}
        onSelect={(val) => onUpdate('species', val)}
        options={(Object.keys(SPECIES_LABELS) as SpeciesEnum[]).map((key) => ({
          label: SPECIES_LABELS[key],
          value: key,
        }))}
      />

      <SelectButtonGroup<SexEnum>
        label="Sexo *"
        selectedValue={data.sex}
        onSelect={(val) => onUpdate('sex', val)}
        options={(Object.keys(SEX_LABELS) as SexEnum[]).map((key) => ({
          label: SEX_LABELS[key],
          value: key,
        }))}
      />

      <SelectButtonGroup<SizeEnum>
        label="Porte do Animal *"
        selectedValue={data.size}
        onSelect={(val) => onUpdate('size', val)}
        options={(Object.keys(SIZE_LABELS) as SizeEnum[]).map((key) => ({
          label: SIZE_LABELS[key],
          value: key,
        }))}
      />

      <SelectButtonGroup<AgeGroupEnum>
        label="Faixa Etária *"
        selectedValue={data.age_group}
        onSelect={(val) => onUpdate('age_group', val)}
        options={(Object.keys(AGE_GROUP_LABELS) as AgeGroupEnum[]).map((key) => ({
          label: AGE_GROUP_LABELS[key],
          value: key,
        }))}
      />

      <View style={styles.row}>
        <View style={styles.col}>
          <CustomTextInputField
            value={data.age_years}
            label='Idade em anos (opcional)'
            placeholder="Ex: 2"
            maxLength={2} // Limita a 2 dígitos (ex: até 99 anos)
            onChangeText={(val) => onUpdate('age_years', val.replace(/[^0-9]/g, ''))}
            keyboardType="number-pad"
          />
        </View>

        <View style={styles.col}>
          <CustomTextInputField
            value={data.weight_kg}
            label='Peso em kg (opcional)'
            placeholder="Ex: 10.5"
            maxLength={5} // Limita a 5 caracteres (ex: 12.50 ou 100.5)
            onChangeText={(val) => onUpdate('weight_kg', val)}
            keyboardType="decimal-pad"
          />
        </View>
      </View>

      <CustomTextInputField
        value={data.color}
        label='Cor / Pelagem (opcional)'
        onChangeText={(val) => onUpdate('color', val)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.neutral[800],
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  col: {
    flex: 1,
  },
});