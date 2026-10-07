import { colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';

interface SubtleActionButtonProps {
  text: string;
  onPress: () => void;
  iconName?: keyof typeof Ionicons.glyphMap;
  variant?: 'neutral' | 'danger';
  style?: ViewStyle;
}

export function SubtleActionButton({
  text,
  onPress,
  iconName,
  variant = 'neutral',
  style,
}: SubtleActionButtonProps) {
  const isDanger = variant === 'danger';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.button,
        isDanger ? styles.buttonDanger : styles.buttonNeutral,
        style,
      ]}
    >
      {iconName && (
        <Ionicons
          name={iconName}
          size={18}
          color={isDanger ? (colors.semantic?.error) : colors.neutral[600]}
          style={styles.icon}
        />
      )}
      <Text
        style={[
          styles.text,
          isDanger ? styles.textDanger : styles.textNeutral,
        ]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  buttonNeutral: {
    backgroundColor: colors.neutral[100],
    borderColor: colors.neutral[200],
  },
  buttonDanger: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
  },
  icon: {
    marginRight: 8,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
  },
  textNeutral: {
    color: colors.neutral[800],
  },
  textDanger: {
    color: colors.semantic?.error,
  },
});