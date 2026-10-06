// Etapa 2: Descrição livre e controle sanitário (vacinas, castração e microchip).

import { StyleSheet, Text, TextInput, View } from 'react-native';
import { BooleanChoiceGroup } from '../../../components/forms/BooleanChoiceGroup';
import { CreateAnimalFormData } from '../types/createAnimal.types';

interface Step2Props {
  data: CreateAnimalFormData;
  onUpdate: <K extends keyof CreateAnimalFormData>(k: K, v: CreateAnimalFormData[K]) => void;
}

export function Step2HealthInfo({ data, onUpdate }: Step2Props) {
  return (
    <View>
      <Text style={styles.sectionTitle}>Histórico e Saúde</Text>

      <Text style={styles.inputLabel}>Descrição do Animal (opcional)</Text>
      <TextInput
        style={styles.textArea}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
        value={data.description}
        onChangeText={(val) => onUpdate('description', val)}
      />

      <Text style={styles.groupTitle}>Controle Sanitário *</Text>

      <BooleanChoiceGroup
        label="Vacinado"
        value={data.is_vaccinated}
        onValueChange={(val) => onUpdate('is_vaccinated', val)}
      />
      <BooleanChoiceGroup
        label="Castrado"
        value={data.is_neutered}
        onValueChange={(val) => onUpdate('is_neutered', val)}
      />
      <BooleanChoiceGroup
        label="Desparasitado"
        value={data.is_dewormed}
        onValueChange={(val) => onUpdate('is_dewormed', val)}
      />
      <BooleanChoiceGroup
        label="Possui microchip"
        value={data.has_microchip}
        onValueChange={(val) => onUpdate('has_microchip', val)}
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
  textArea: {
    height: 100,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: '#1f2937',
    marginBottom: 20,
  },
  groupTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
    marginTop: 4,
  },
});