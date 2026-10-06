import { supabase } from '@/services/supabase';
import { handleError } from '@/utils/errorHandler';
import { AppToast } from '@/utils/toast';
import { useEffect, useState } from 'react';
import { PersonalFormData } from '../types/profile.types';

interface UsePersonalDataProps {
    initialData: PersonalFormData | null;
    userId: string | null;
    onSuccess: () => void;
}

export function usePersonalSection({ initialData, userId, onSuccess }: UsePersonalDataProps) {
    const [personalData, setPersonalData] = useState<PersonalFormData>({
        fullName: '', email: '', cpf: '', phone: '', birthDate: '', avatarUrl: null,
    });
    const [saving, setSaving] = useState(false);

    // Atualiza o estado local sempre que o hook principal trouxer dados novos do banco
    useEffect(() => {
        if (initialData) setPersonalData(initialData);
    }, [initialData]);

    const savePersonalData = async () => {
        if (!userId) return;
        try {
            setSaving(true);
            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: personalData.fullName.trim(),
                    cpf: personalData.cpf.trim(),
                    phone: personalData.phone.trim(),
                    birth_date: personalData.birthDate || null,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', userId);

            if (error) throw error;

            onSuccess(); // Recarrega os dados globais para atualizar a barra de progresso
            AppToast.success('Sucesso', 'Dados pessoais atualizados com sucesso!');
        } catch (err: any) {
            handleError(err.message, 'Falha ao salvar dados pessoais.');
        } finally {
            setSaving(false);
        }
    };

    const clearInputs = () => {
        setPersonalData({
            fullName: '', 
            email: '', 
            cpf: '', 
            phone: '', 
            birthDate: '', 
            avatarUrl: null,
        });
    }

    const handlePickAvatar = async () => {
        // Mesma lógica de Image Picker que você já tem, chamando onSuccess() após o upload
    };

    // Atualização manual de outros campos do form
    const updateField = (field: keyof PersonalFormData, value: string) => {
        setPersonalData((prev) => ({ ...prev, [field]: value }));
    };

    return { personalData, setPersonalData, saving, savePersonalData, handlePickAvatar, updateField };
}