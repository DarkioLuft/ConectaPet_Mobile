// Etapa 2: Descrição livre e controle sanitário (vacinas, castração e microchip).
import { CustomTextInputField } from '@/components/forms/CustomTextInputField';
import { colors } from '@/constants/colors';
import { AnyAnimalForm } from '@/types/animal.types';
import { StyleSheet, Text, View } from 'react-native';
import { BooleanChoiceGroup } from '../../../components/forms/BooleanChoiceGroup';

interface Step2Props {
  data: AnyAnimalForm;
  onUpdate: <K extends keyof AnyAnimalForm>(k: K, v: AnyAnimalForm[K]) => void;
}

export function Step2HealthInfo({ data, onUpdate }: Step2Props) {
  return (
    <View>
      <Text style={styles.sectionTitle}>Histórico e Saúde</Text>

      <CustomTextInputField
        value={data.description || ''}
        label='Descrição do Animal (opcional)'
        onChangeText={(val) => onUpdate('description', val)}
        numberOfLines={4}
        multiline
        textAlignVertical="top"
        style={{ height: 100 }}
      />

      <Text style={styles.sectionHeaderTitle}>1. Controle Sanitário *</Text>

      <BooleanChoiceGroup
        label="Vacinado"
        value={data.is_vaccinated!}
        onValueChange={(val) => onUpdate('is_vaccinated', val)}
        key={data.id + `{data.is_vaccinated}`}

      />
      <BooleanChoiceGroup
        label="Castrado"
        value={data.is_neutered!}
        onValueChange={(val) => onUpdate('is_neutered', val)}
        key={data.id + `{data.is_neutered}`}

      />
      <BooleanChoiceGroup
        label="Desparasitado"
        value={data.is_dewormed!}
        onValueChange={(val) => onUpdate('is_dewormed', val)}
        key={data.id + `{data.is_dewormed}`}
      />
      <BooleanChoiceGroup
        label="Possui microchip"
        value={data.has_microchip!}
        onValueChange={(val) => onUpdate('has_microchip', val)}
        key={data.id + `{data.has_microchip}`}
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
  sectionHeaderTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primary[500],
    marginTop: 25,
    marginBottom: 8,
  },
});