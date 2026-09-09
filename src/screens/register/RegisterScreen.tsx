import DateTimePicker from '@react-native-community/datetimepicker';
import { KeyboardAvoidingView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { CustomPrimaryActionButton } from '@/components/buttons/CustomPrimaryActionButton';
import { CustomRowTextIconButton } from '@/components/buttons/CustomRowTextIconButton';
import { CustomPasswordInputField } from '@/components/forms/CustomPasswordInputField';
import { CustomTextInputField } from '@/components/forms/CustomTextInputField';
import { LoadingIndicator } from '@/components/ui/LoadingIndicator';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { styles } from '@/constants/styles';
import { useDateUtils } from '@/hooks/useDateUtils';
import { useRegister } from './hooks/useRegister';

export function RegisterScreen() {
        const {
                nome,
                setNome,
                cpf,
                handleCpfChange,
                telefone,
                handleTelefoneChange,
                email,
                setEmail,
                date,
                setDate,
                password,
                setPassword,
                confirmPassword,
                setConfirmPassword,
                loading,
                handleRegister,
                handleGoBack
        } = useRegister();

        const {
                showDatePicker,
                setShowDatePicker
        } = useDateUtils();

        if (loading) {
                return <LoadingIndicator message="Carregando..." />;
        }

        return (
                <KeyboardAvoidingView style={styles.container}>
                        <ScrollView contentContainerStyle={[stylesLocal.content, styles.content]} keyboardShouldPersistTaps="handled">
                                <Text style={styles.title}>Criar Conta</Text>

                                <CustomTextInputField
                                        value={nome}
                                        onChangeText={setNome}
                                        placeholder={'Nome Completo'}
                                />
                                <CustomTextInputField
                                        value={cpf}
                                        onChangeText={handleCpfChange}
                                        placeholder={'CPF'}
                                        keyboardType='numeric'
                                />
                                <CustomTextInputField
                                        value={email}
                                        onChangeText={setEmail}
                                        placeholder={'E-mail'}
                                        keyboardType='email-address'
                                        textContentType='emailAddress'
                                        autoCapitalize='none'
                                />
                                <CustomTextInputField
                                        value={telefone}
                                        onChangeText={handleTelefoneChange}
                                        placeholder={'Telefone'}
                                        keyboardType='numeric'
                                />
                                <CustomRowTextIconButton
                                        placeholder={'Selecione uma data'}
                                        onPress={() => setShowDatePicker(true)}
                                        value={date}
                                        icon={"calendar-outline"}
                                />
                                <CustomPasswordInputField
                                        value={password}
                                        onChangeText={setPassword}
                                        placeholder={'Senha'}
                                />
                                <CustomPasswordInputField
                                        value={confirmPassword}
                                        onChangeText={setConfirmPassword}
                                        placeholder={'Confirmar Senha'}
                                />

                                {showDatePicker && (
                                        <DateTimePicker
                                                value={new Date()}
                                                mode="date"
                                                display="default"
                                                onValueChange={(event, selectedDate) => {
                                                        setShowDatePicker(false);
                                                        if (selectedDate) {
                                                                // Formata e salva no estado
                                                                setDate(selectedDate.toLocaleDateString('pt-BR'));
                                                        }
                                                }}
                                                onDismiss={() => setShowDatePicker(false)}
                                        />
                                )}

                                <View style={{ marginTop: 100 }}>
                                        <CustomPrimaryActionButton
                                                text={'Cadastrar'}
                                                onPress={handleRegister}
                                        />

                                        <TouchableOpacity style={stylesLocal.switchButton} onPress={handleGoBack}>
                                                <Text style={stylesLocal.switchText}>Já tem conta? Faça Login</Text>
                                        </TouchableOpacity>
                                </View>
                        </ScrollView>
                </KeyboardAvoidingView>
        );
}

const stylesLocal = StyleSheet.create({
        content: { justifyContent: 'center', gap: spacing.md },
        switchButton: { marginTop: spacing.lg, alignItems: 'center' },
        switchText: { color: colors.textLight, fontSize: 14 },
});