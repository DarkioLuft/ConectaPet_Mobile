import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useState } from "react";

import { AuthStackParamList } from "../../../routes/AuthRoutes";
import { authService } from "../../../services/authService";
import { handleError } from "../../../utils/errorHandler";

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

export function useLogin() {
        const navigation = useNavigation<LoginScreenNavigationProp>();

        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [loading, setLoading] = useState(false);

        const handleLogin = async () => {
                if (!email || !password) {
                        throw Error("Preencha todos os campos.");
                }

                setLoading(true);
                try {
                        await authService.login(email, password);
                } catch (error: any) {
                        handleError(error.message, 'Erro ao entrar');
                } finally {
                        setLoading(false);
                }
        };

        return {
                navigation,
                email,
                setEmail,
                password,
                setPassword,
                loading,
                handleLogin
        }
}