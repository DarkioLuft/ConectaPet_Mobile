import { AppToast } from "./toast";


export function handleError(error: unknown, customTitle?: string) {
        console.error("Erro:", error);

        let description = "Ocorreu um erro inesperado. Tente novamente mais tarde.";

        if (error instanceof Error) {
                if (error.message.includes('network')) {
                        description = "Sem conexão com a internet.";
                } else if (error.message.includes('AuthApiError')) {
                        description = "Credenciais inválidas.";
                } else {
                        description = error.message;
                }
        }
        else if (error) {
                description = String(error)
        }

        AppToast.error(customTitle || 'Ops! Algo deu errado', description);
}