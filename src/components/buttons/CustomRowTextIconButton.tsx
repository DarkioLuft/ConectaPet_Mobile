import { borderRadius } from "@/constants/borderRadius";
import { colors } from "@/constants/colors";
import { spacing } from "@/constants/spacing";
import { Ionicons } from "@expo/vector-icons";
import { StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native";

interface CustomRowTextIconButtonProps {
        informationalIcon?: string; // Icone que fica no início
        placeholder: string;
        title?: string;
        value?: string;
        onPress: () => void;
        icon?: string; // Icone do botão de ação
        disabled?: boolean;    // Campo bloqueado para edição
        style?: StyleProp<ViewStyle>; // Estilos extras
}

export function CustomRowTextIconButton({
        informationalIcon,
        placeholder,
        title,
        value,
        onPress,
        icon = "chevron-forward",
        disabled = false,
        style
}: CustomRowTextIconButtonProps) {
        return (
                <TouchableOpacity
                        style={[stylesLocal.container, stylesLocal.input, disabled && stylesLocal.containerDisabled, style]}
                        onPress={onPress}
                        disabled={disabled}
                        activeOpacity={0.7}
                >
                        {informationalIcon && (
                                <View style={stylesLocal.icon}>
                                        <Ionicons name={informationalIcon as any} size={20} color={colors.primary} />
                                </View>
                        )}

                        <View style={{ flex: 1, paddingHorizontal: 10 }}>
                                {title && (
                                        <Text style={stylesLocal.title}>{title}</Text>
                                )}
                                <Text style={[stylesLocal.text, value ? stylesLocal.textActive : stylesLocal.textPlaceholder, disabled && stylesLocal.textDisabled]}>
                                        {value ? value : placeholder}
                                </Text>
                        </View>

                        <Ionicons name={icon as any} size={18} color={disabled ? colors.placeholder : colors.primary}
                        />
                </TouchableOpacity>
        );
}

const stylesLocal = StyleSheet.create({
        container: {
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: colors.surface,
                paddingVertical: 14,
        },
        containerDisabled: {
                opacity: 0.6,
        },
        input: {
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: borderRadius.md,
                paddingHorizontal: spacing.md,
                paddingVertical: 14,
                fontSize: 16
        },
        title: { fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 4 },
        icon: { width: 38, height: 38, borderRadius: 12, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' },
        text: {
                fontSize: 13,
        },
        textActive: {
                color: colors.textLight,
        },
        textPlaceholder: {
                color: colors.placeholder,
        },
        textDisabled: {
                color: colors.textLight,
        }
});