import { CustomPrimaryActionButton } from '@/components/buttons/CustomPrimaryActionButton';
import { colors } from '@/constants/colors';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
        <TouchableOpacity
          style={[styles.choiceBtn, value === true && styles.choiceBtnActive]}
          onPress={() => onSelect(true)}
        >
          <Text style={[styles.choiceBtnText, value === true && styles.choiceBtnTextActive]}>
            Sim
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.choiceBtn, value === false && styles.choiceBtnActive]}
          onPress={() => onSelect(false)}
        >
          <Text style={[styles.choiceBtnText, value === false && styles.choiceBtnTextActive]}>
            Não
          </Text>
        </TouchableOpacity>
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
            <TouchableOpacity
              key={ht.id}
              style={[styles.chip, isSelected && styles.chipActive]}
              onPress={() => onChange('housingTypeId', ht.id)}
            >
              <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                {ht.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 2. Horas fora de casa */}
      <Text style={styles.sectionHeaderTitle}>2. Horas que o pet ficará sozinho por dia</Text>
      <View style={styles.btnRow}>
        {[2, 4, 6, 8, 10].map((h) => {
          const isSelected = data.hoursAlonePerDay === h;
          return (
            <TouchableOpacity
              key={h}
              style={[styles.chip, isSelected && styles.chipActive, { flex: 1, alignItems: 'center' }]}
              onPress={() => onChange('hoursAlonePerDay', h)}
            >
              <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                {h}h
              </Text>
            </TouchableOpacity>
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

      {/* 4. Espécies e Portes Aceites */}
      <Text style={styles.sectionHeaderTitle}>4. Espécies e Portes Aceites</Text>
      <View style={styles.btnRow}>
        {[
          { key: 'all', label: 'Todos' },
          { key: 'dog', label: 'Cães' },
          { key: 'cat', label: 'Gatos' },
        ].map((s) => {
          const isSelected = data.preferredSpecies === s.key;
          return (
            <TouchableOpacity
              key={s.key}
              style={[styles.chip, isSelected && styles.chipActive, { flex: 1, alignItems: 'center' }]}
              onPress={() => onChange('preferredSpecies', s.key as any)}
            >
              <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                {s.label}
              </Text>
            </TouchableOpacity>
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
            <TouchableOpacity
              key={size.key}
              style={[styles.chip, isSelected && styles.chipActive, { flex: 1, alignItems: 'center' }]}
              onPress={() => toggleSize(size.key)}
            >
              <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                {size.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <CustomPrimaryActionButton
        text={'Salvar Perfil de Match'}
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
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: colors.neutral[100],
    alignItems: 'center',
    borderColor: colors.neutral[200],
  },
  chipActive: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.neutral[400],
  },
  chipTextActive: {
    color: colors.white,
    fontWeight: '700',
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
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  choiceBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: colors.neutral[100],
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  choiceBtnActive: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },
  choiceBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  choiceBtnTextActive: {
    color: colors.white,
    fontWeight: '700',
  }
});