import { KeyboardAvoidingView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useLogin } from './hooks/useLogin';

import { CustomPrimaryActionButton } from '@/components/buttons/CustomPrimaryActionButton';
import { CustomPasswordInputField } from '@/components/forms/CustomPasswordInputField';
import { CustomTextInputField } from '@/components/forms/CustomTextInputField';
import { LoadingIndicator } from '@/components/ui/LoadingIndicator';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { styles } from '@/constants/styles';

export function LoginScreen() {
        const {
                navigation,
                email,
                setEmail,
                password,
                setPassword,
                loading,
                handleLogin
        } = useLogin();

        if (loading) {
                return <LoadingIndicator />;
        }

        return (
                <KeyboardAvoidingView style={styles.container}>
                        <View style={[stylesLocal.content, styles.content]}>
                                <Text style={stylesLocal.logo}>ConectaPET</Text>
                                <Text style={styles.title}>Entrar</Text>

                                <CustomTextInputField
                                        value={email}
                                        onChangeText={setEmail}
                                        placeholder={'E-mail'}
                                        keyboardType='email-address'
                                        autoCapitalize='none'
                                        textContentType='emailAddress'
                                        autoComplete="email"
                                />

                                <CustomPasswordInputField
                                        value={password}
                                        onChangeText={setPassword}
                                        placeholder={'Senha'}
                                />

                                <View style={{ marginTop: 100 }}>
                                        <CustomPrimaryActionButton
                                                text={'Acessar'}
                                                onPress={handleLogin}
                                        />

                                        <TouchableOpacity
                                                style={stylesLocal.switchButton}
                                                onPress={() => navigation.navigate('Register')}
                                        >
                                                <Text style={stylesLocal.switchText}>Não tem conta? Cadastre-se</Text>
                                        </TouchableOpacity>
                                </View>
                        </View>
                </KeyboardAvoidingView>
        );
}

const stylesLocal = StyleSheet.create({
        content: { flex: 1, justifyContent: 'center', padding: spacing.xl, gap: spacing.md },
        logo: { fontSize: 48, fontWeight: '900', color: colors.primary, marginBottom: spacing.sm },
        switchButton: { marginTop: spacing.lg, alignItems: 'center' },
        switchText: { color: colors.textLight, fontSize: 14 },
});