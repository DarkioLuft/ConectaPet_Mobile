// Valida o formato básico de e-mail
export const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
};

// Algoritmo real de validação de CPF
export const validateCpf = (cpf: string): boolean => {
        const cleanCpf = cpf.replace(/\D/g, '');

        if (cleanCpf.length !== 11 || /^(\d)\1+$/.test(cleanCpf)) return false;

        let sum = 0;
        let remainder;

        for (let i = 1; i <= 9; i++) sum += parseInt(cleanCpf.substring(i - 1, i)) * (11 - i);
        remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cleanCpf.substring(9, 10))) return false;

        sum = 0;
        for (let i = 1; i <= 10; i++) sum += parseInt(cleanCpf.substring(i - 1, i)) * (12 - i);
        remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cleanCpf.substring(10, 11))) return false;

        return true;
};

// Aplica máscara de CPF (000.000.000-00)
export const maskCpf = (value: string): string => {
        return value
                .replace(/\D/g, '')
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
                .substring(0, 14);
};

// Aplica máscara de Telefone ((00) 00000-0000)
export const maskTelefone = (value: string): string => {
        return value
                .replace(/\D/g, '')
                .replace(/(\d{2})(\d)/, '($1) $2')
                .replace(/(\d{5})(\d)/, '$1-$2')
                .substring(0, 15);
};

// Remove qualquer caractere que não seja número (útil antes de enviar para a API)
export const clearSpecialCharacters = (value: string): string => {
        return value.replace(/\D/g, '');
};