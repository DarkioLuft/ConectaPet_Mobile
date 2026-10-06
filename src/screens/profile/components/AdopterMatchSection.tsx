import { CustomPrimaryActionButton } from '@/components/buttons/CustomPrimaryActionButton';
import { CustomChip } from '@/components/forms/CustomChip';
import { colors } from '@/constants/colors';
import { StyleSheet, Text, View } from 'react-native';
import { AdopterPreferencesFormData, HousingTypeOption } from '../types/profile.types';

interface AdopterMatchSectionProps {
  data: AdopterPreferencesFormData;
  housingTypes: HousingTypeOption[];
  onChange: <K extends keyof AdopterPreferencesFormData>(
    field: K,
    value: AdopterPreferencesFormData[K]
  ) => void;
  onSave: () => void;
  saving: boolean;
}

export function AdopterMatchSection({
  data,
  housingTypes,
  onChange,
  onSave,
  saving,
}: AdopterMatchSectionProps) {
  const toggleSize = (size: string) => {
    const exists = data.preferredSizes.includes(size);
    if (exists) {
      onChange(
        'preferredSizes',
        data.preferredSizes.filter((s) => s !== size)
      );
    } else {
      onChange('preferredSizes', [...data.preferredSizes, size]);
    }
  };

  const renderYesNo = (
    label: string,
    value: boolean | null,
    onSelect: (val: boolean) => void
  ) => (
    <View style={styles.choiceGroup}>
      <Text style={styles.choiceLabel}>{label}</Text>
      <View style={styles.btnRow}>
        <CustomChip
          label={'Sim'}
          selected={value == true ? true : false}
          onPress={() => onSelect(true)}
          style={{ flex: 1 }}
        />

        <CustomChip
          label={'Não'}
          selected={value == false ? true : false}
          onPress={() => onSelect(false)}
          style={{ flex: 1 }}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* 1. Tipo de Moradia */}
      <Text style={styles.sectionHeaderTitle}>1. Tipo de Moradia</Text>
      <View style={styles.chipsContainer}>
        {housingTypes.map((ht) => {
          const isSelected = data.housingTypeId === ht.id;
          return (
            <CustomChip
              label={ht.name}
              selected={isSelected}
              onPress={() => onChange('housingTypeId', ht.id)}
            />
          );
        })}
      </View>

      {/* 2. Horas fora de casa */}
      <Text style={styles.sectionHeaderTitle}>2. Horas que o pet ficará sozinho por dia</Text>
      <View style={styles.btnRow}>
        {[2, 4, 6, 8, 10].map((h) => {
          const isSelected = data.hoursAlonePerDay === h;
          return (
            <CustomChip
              label={h + 'h'}
              selected={isSelected}
              onPress={() => onChange('hoursAlonePerDay', h)}
              style={{ flex: 1 }}
            />
          );
        })}
      </View>

      {/* 3. Convivência e Família */}
      <Text style={styles.sectionHeaderTitle}>3. Convivência e Família</Text>
      {renderYesNo('Tem crianças na casa?', data.hasChildren, (v) => onChange('hasChildren', v))}
      {renderYesNo('Possui outros cães?', data.hasOtherDogs, (v) => onChange('hasOtherDogs', v))}
      {renderYesNo('Possui outros gatos?', data.hasOtherCats, (v) => onChange('hasOtherCats', v))}
      {renderYesNo('Será o primeiro pet?', data.firstTimeOwner, (v) => onChange('firstTimeOwner', v))}
      {renderYesNo('Acolhe pet com necessidades especiais?', data.acceptsSpecialNeeds, (v) => onChange('acceptsSpecialNeeds', v))}

      {/* 4. Espécies e Portes Aceitas */}
      <Text style={styles.sectionHeaderTitle}>4. Espécies e Portes Aceitas</Text>
      <View style={styles.btnRow}>
        {[
          { key: 'all', label: 'Todos' },
          { key: 'dog', label: 'Cães' },
          { key: 'cat', label: 'Gatos' },
        ].map((s) => {
          const isSelected = data.preferredSpecies === s.key;
          return (
            <CustomChip
              label={s.label}
              selected={isSelected}
              onPress={() => onChange('preferredSpecies', s.key as any)}
              style={{ flex: 1 }}
            />
          );
        })}
      </View>

      <Text style={[styles.choiceLabel, { marginTop: 10 }]}>Portes compatíveis:</Text>
      <View style={styles.btnRow}>
        {[
          { key: 'small', label: 'Pequeno' },
          { key: 'medium', label: 'Médio' },
          { key: 'large', label: 'Grande' },
        ].map((size) => {
          const isSelected = data.preferredSizes.includes(size.key);
          return (
            <CustomChip
              label={size.label}
              selected={isSelected}
              onPress={() => toggleSize(size.key)}
              style={{ flex: 1 }}
            />
          );
        })}
      </View>

      <CustomPrimaryActionButton
        text={'Salvar Perfil de Match'}
        onPress={onSave}
        disabled={saving}
        loading={saving}
      />
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 18,
    paddingTop: 8,
  },
  sectionHeaderTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primary[500],
    marginTop: 14,
    marginBottom: 8,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'flex-start',
  },
  btnRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  choiceGroup: {
    marginBottom: 10,
  },
  choiceLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.neutral[400],
    marginBottom: 6,
  },
});