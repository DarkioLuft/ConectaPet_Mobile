import { borderRadius } from "@/constants/borderRadius";
import { colors } from "@/constants/colors";
import { spacing } from "@/constants/spacing";
import { StyleSheet, TextInput, TextInputProps } from "react-native";

interface CustomTextInputFieldProps extends TextInputProps {
        value: string;
        onChangeText: (text: string) => void;
        placeholder: string;
        disabled?: boolean;
}

export function CustomTextInputField({
        value,
        onChangeText,
        placeholder,
        disabled = false,
        keyboardType = 'default',
        style,
        ...rest // Pega qualquer outra prop passada
}: CustomTextInputFieldProps) {
        const getTextColor = () => {
                if (disabled) return colors.textLight;
                return colors.text;
        };

        return (
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
        );
}

const styles = StyleSheet.create({
        input: {
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: borderRadius.md,
                paddingHorizontal: spacing.md,
                paddingVertical: 14,
                fontSize: 16,
        },
        inputDisabled: {
                backgroundColor: colors.background,
                borderColor: colors.border,
        }
});