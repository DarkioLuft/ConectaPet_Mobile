import { colors } from "@/constants/colors";
import { styles } from "@/constants/styles";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from "react-native";

interface CustomPrimaryActionButtonProps {
        text: string,
        onPress: () => void,
        disabled?: boolean,
        loading?: boolean,
}

export function CustomPrimaryActionButton({ text, onPress, disabled, loading }: CustomPrimaryActionButtonProps) {
        return (
                <TouchableOpacity style={[stylesLocal.submitButton, styles.shadow,
                disabled && stylesLocal.submitButtonDisabled]} onPress={onPress} disabled={disabled}>
                        {loading ? (
                                <ActivityIndicator color={colors.white} />
                        ) : (
                                <Text style={stylesLocal.submitButtonText}>{text}</Text>
                        )}
                </TouchableOpacity>
        )
}

const stylesLocal = StyleSheet.create({
        submitButton: {
                backgroundColor: colors.primary[500], borderRadius: 20,
                paddingVertical: 12, alignItems: 'center', justifyContent: 'center', marginTop: 22
        },
        submitButtonDisabled: {
                backgroundColor: colors.primaryDisabled,
                borderColor: colors.primaryDisabled,
                opacity: 0.6,
        },
        submitButtonText: { color: colors.white, fontSize: 18, fontWeight: 'bold' },
});
