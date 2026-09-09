import { colors } from "@/constants/colors";
import { styles } from "@/constants/styles";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface CustomPrimaryActionButtonProps {
        text: string,
        onPress: () => void,
        disabled?: boolean
}

export function CustomPrimaryActionButton({ text, onPress, disabled }: CustomPrimaryActionButtonProps) {
        return (
                <TouchableOpacity style={[stylesLocal.submitButton, styles.shadow,
                disabled && stylesLocal.submitButtonDisabled]} onPress={onPress} disabled={disabled}>
                        <Text style={stylesLocal.submitButtonText}>{text}</Text>
                </TouchableOpacity>
        )
}

const stylesLocal = StyleSheet.create({
        submitButton: {
                backgroundColor: colors.primary, borderRadius: 20,
                paddingVertical: 18, alignItems: 'center', justifyContent: 'center', marginTop: 8
        },
        submitButtonDisabled: {
                backgroundColor: colors.primaryDisabled,
                borderColor: colors.primaryDisabled,
                opacity: 0.6,
        },
        submitButtonText: { color: colors.white, fontSize: 18, fontWeight: 'bold' },
});
