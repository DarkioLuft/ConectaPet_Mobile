import { colors } from '@/constants/colors';
import { StyleProp, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';

interface CustomChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

export function CustomChip({ label, selected, onPress, style }: CustomChipProps) {
  return (
    <TouchableOpacity
      style={[styles.chip, selected && styles.chipActive, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.chipText, selected && styles.chipTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  chipActive: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.neutral[400],
  },
  chipTextActive: {
    color: colors.white,
    fontWeight: '700',
  },
});