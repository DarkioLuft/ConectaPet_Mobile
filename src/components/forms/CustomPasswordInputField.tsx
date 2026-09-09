import { colors } from "@/constants/colors";
import { spacing } from "@/constants/spacing";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, TextInputProps, TouchableOpacity, View } from "react-native";
import { CustomTextInputField } from "./CustomTextInputField";

interface CustomPasswordInputFieldProps extends Omit<TextInputProps, 'secureTextEntry'> {
        value: string;
        onChangeText: (text: string) => void;
        placeholder: string;
        disabled?: boolean;
}

export function CustomPasswordInputField({
        value,
        onChangeText,
        placeholder,
        disabled = false,
        style,
        ...rest
}: CustomPasswordInputFieldProps) {
        // Controlar se a senha está oculta ou visível
        const [isSecure, setIsSecure] = useState(true);

        const toggleSecureEntry = () => {
                setIsSecure((prevState) => !prevState);
        };

        return (
                <View style={styles.container}>
                        <CustomTextInputField
                                value={value}
                                onChangeText={onChangeText}
                                placeholder={placeholder}
                                disabled={disabled}
                                secureTextEntry={isSecure} // Controla a visibilidade do texto
                                autoCapitalize="none"
                                autoCorrect={false}
                                autoComplete="current-password"
                                textContentType='password'
                                style={[
                                        { paddingRight: 48 }, // Abre espaço para o ícone não sobrepor o texto
                                        style
                                ]}
                                {...rest}
                        />

                        <TouchableOpacity
                                style={styles.iconContainer}
                                onPress={toggleSecureEntry}
                                disabled={disabled}
                                activeOpacity={0.7}
                        >
                                <Ionicons
                                        name={isSecure ? "eye-off-outline" : "eye-outline"}
                                        size={22}
                                        color={disabled ? colors.textLight : colors.primary}
                                />
                        </TouchableOpacity>
                </View>
        );
}

const styles = StyleSheet.create({
        container: {
                width: "100%",
                position: "relative",
                justifyContent: "center",
        },
        iconContainer: {
                position: "absolute",
                right: spacing.md,
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
        },
});