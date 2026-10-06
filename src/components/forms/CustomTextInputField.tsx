import { borderRadius } from "@/constants/borderRadius";
import { colors } from "@/constants/colors";
import { spacing } from "@/constants/spacing";
import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";

interface CustomTextInputFieldProps extends TextInputProps {
        value: string;
        onChangeText?: (text: string) => void;
        placeholder?: string;
        label?: string;
        disabled?: boolean;
}

export function CustomTextInputField({
        value,
        onChangeText,
        placeholder,
        label,
        disabled = false,
        keyboardType = 'default',
        style,
        ...rest // Pega qualquer outra prop passada
}: CustomTextInputFieldProps) {
        const getTextColor = () => {
                if (disabled) return colors.neutral[400];
                return colors.neutral[800];
        };

        return (
                <View>
                        {label ? (<Text style={styles.label}>{label}</Text>) : null}
                        <TextInput
                                style={[
                                        styles.input,
                                        disabled && styles.inputDisabled,
                                        { color: getTextColor() },
                                        style
                                ]}
                                placeholder={placeholder}
                                placeholderTextColor={colors.placeholder}
                                value={value}
                                onChangeText={onChangeText}
                                editable={!disabled}
                                keyboardType={keyboardType}
                                {...rest} // Aplica o resto das propriedades nativas
                        />
                </View>

        );
}

const styles = StyleSheet.create({
        label: {
                fontSize: 13,
                fontWeight: '700',
                color: colors.neutral[400],
                marginBottom: 6,
                marginTop: 10,
        },
        input: {
                backgroundColor: colors.white,
                borderWidth: 1,
                borderColor: colors.neutral[200],
                borderRadius: borderRadius.md,
                paddingHorizontal: spacing.md,
                paddingVertical: 14,
                fontSize: 14,
                height: 46,
                color: colors.neutral[800]
        },
        inputDisabled: {
                backgroundColor: colors.neutral[100],
                color: colors.neutral[400],
        }
});