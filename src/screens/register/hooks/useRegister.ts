import { AuthStackParamList } from "@/routes/AuthRoutes";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useState } from "react";

import { RegisterUserDto } from "@/dtos/user.dto";
import { authService } from "@/services/authService";
import { handleError } from "@/utils/errorHandler";
import { AppToast } from "@/utils/toast";
import { clearSpecialCharacters, maskCpf, maskTelefone, validateCpf, validateEmail } from "@/utils/userFormUtils";

type RegisterScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Register'>;

export function useRegister() {
        const navigation = useNavigation<RegisterScreenNavigationProp>();

        const [nome, setNome] = useState('');
        const [cpf, setCpf] = useState('');
        const [telefone, setTelefone] = useState('');
        const [email, setEmail] = useState('');
        const [date, setDate] = useState('');
        const [password, setPassword] = useState('');
        const [confirmPassword, setConfirmPassword] = useState('');
        const [loading, setLoading] = useState(false);

        // Handlers usando as funções centralizadas do formUtils
        const handleCpfChange = (text: string) => setCpf(maskCpf(text));
        const handleTelefoneChange = (text: string) => setTelefone(maskTelefone(text));

        const handleRegister = async () => {
                if (!nome.trim() || !cpf.trim() || !telefone.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
                        handleError('Todos os campos são obrigatórios.', 'Erro no formulário');
                        return;
                }

                if (!validateCpf(cpf)) {
                        handleError('O CPF digitado não é válido.', 'CPF inválido');
                        return;
                }

                if (!validateEmail(email.trim())) {
                        handleError('Por favor, insira um e-mail válido.', 'E-mail inválido');
                        return;
                }

                const cleanPhone = clearSpecialCharacters(telefone);
                if (cleanPhone.length < 10) {
                        handleError('O telefone deve conter DDD e o número completo.', 'Telefone inválido');
                        return;
                }

                if (date == '' || date == null) {
                        handleError('Por favor, selecione uma data de nascimento.', 'Data de nascimento inválida');
                        return;
                }

                if (password.length < 6) {
                        handleError('A senha deve ter pelo menos 6 caracteres.', 'Senha fraca');
                        return;
                }

                if (password !== confirmPassword) {
                        handleError('As senhas não coincidem.', 'Erro no formulário');
                        return;
                }

                setLoading(true);
                try {
                        await authService.register({
                                full_name: nome.trim(),
                                cpf: clearSpecialCharacters(cpf),
                                email: email.trim(),
                                phone: cleanPhone,
                                birth_date: date,
                                password
                        } as RegisterUserDto);

                        AppToast.success('Sua conta foi criada com sucesso!', 'Agora você já pode fazer o seu login.');
                        navigation.navigate('Login');
                } catch (error: any) {
                        handleError(error.message, 'Erro ao criar conta');
                } finally {
                        setLoading(false);
                }
        };

        const handleGoBack = () => {
                navigation.goBack();
        };

        return {
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
        };
}