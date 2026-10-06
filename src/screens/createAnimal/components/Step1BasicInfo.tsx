// Etapa 1: Identificação básica do animal (nome, espécie, sexo, porte, idade e peso).

import { StyleSheet, Text, TextInput, View } from 'react-native';
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

      <Text style={styles.inputLabel}>Nome do Pet *</Text>
      <TextInput
        style={styles.textInput}
        value={data.name}
        onChangeText={(val) => onUpdate('name', val)}
      />

      <SelectButtonGroup<SpeciesEnum>
        label="Espécie *"
        selectedValue={data.species}
        onSelect={(val) => onUpdate('species', val)}
        columns={3}
        options={(Object.keys(SPECIES_LABELS) as SpeciesEnum[]).map((key) => ({
          label: SPECIES_LABELS[key],
          value: key,
        }))}
      />

      <SelectButtonGroup<SexEnum>
        label="Sexo *"
        selectedValue={data.sex}
        onSelect={(val) => onUpdate('sex', val)}
        columns={2}
        options={(Object.keys(SEX_LABELS) as SexEnum[]).map((key) => ({
          label: SEX_LABELS[key],
          value: key,
        }))}
      />

      <SelectButtonGroup<SizeEnum>
        label="Porte do Animal *"
        selectedValue={data.size}
        onSelect={(val) => onUpdate('size', val)}
        columns={3}
        options={(Object.keys(SIZE_LABELS) as SizeEnum[]).map((key) => ({
          label: SIZE_LABELS[key],
          value: key,
        }))}
      />

      <SelectButtonGroup<AgeGroupEnum>
        label="Faixa Etária *"
        selectedValue={data.age_group}
        onSelect={(val) => onUpdate('age_group', val)}
        columns={2}
        options={(Object.keys(AGE_GROUP_LABELS) as AgeGroupEnum[]).map((key) => ({
          label: AGE_GROUP_LABELS[key],
          value: key,
        }))}
      />

      <View style={styles.row}>
        <View style={styles.col}>
          <Text style={[styles.inputLabel, styles.alignedLabel]}>
            Idade em anos (opcional)
          </Text>
          <TextInput
            style={styles.textInput}
            keyboardType="number-pad"
            maxLength={2} // Limita a 2 dígitos (ex: até 99 anos)
            placeholder="Ex: 2"
            value={data.age_years}
            onChangeText={(val) => onUpdate('age_years', val.replace(/[^0-9]/g, ''))}
          />
        </View>

        <View style={styles.col}>
          <Text style={[styles.inputLabel, styles.alignedLabel]}>
            Peso em kg (opcional)
          </Text>
          <TextInput
            style={styles.textInput}
            keyboardType="decimal-pad"
            maxLength={5} // Limita a 5 caracteres (ex: 12.50 ou 100.5)
            placeholder="Ex: 10.5"
            value={data.weight_kg}
            onChangeText={(val) => onUpdate('weight_kg', val)}
          />
        </View>
      </View>

      <Text style={styles.inputLabel}>Cor / Pelagem (opcional)</Text>
      <TextInput
        style={styles.textInput}
        value={data.color}
        onChangeText={(val) => onUpdate('color', val)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  alignedLabel: {
    minHeight: 38, // Garante que ambos os rótulos ocupem a mesma altura
    justifyContent: 'flex-end',
  },
  textInput: {
    height: 48,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 15,
    color: '#1f2937',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  col: {
    flex: 1,
  },
});