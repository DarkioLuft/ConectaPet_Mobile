import { adopterPreferencesService } from '@/services/adopterPreferencesService';
import { handleError } from '@/utils/errorHandler';
import { AppToast } from '@/utils/toast';
import { useEffect, useState } from 'react';
import { AdopterPreferencesFormData } from '../types/profile.types';

interface UseAdopterPreferencesSectionParams {
    initialData: AdopterPreferencesFormData | null;
    userId: string | null;
    onSuccess: () => void;
}

export function usePreferencesSection({ initialData, userId, onSuccess }: UseAdopterPreferencesSectionParams) {
    const [preferencesData, setPreferencesData] = useState<AdopterPreferencesFormData>({
        housingTypeId: null, hasChildren: null, hasOtherDogs: null, hasOtherCats: null,
        hoursAlonePerDay: null, firstTimeOwner: null, acceptsSpecialNeeds: null,
        preferredSpecies: null, preferredSizes: [],
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (initialData) setPreferencesData(initialData);
    }, [initialData]);

    const savePreferences = async () => {
        if (!userId) return;
        try {
            setSaving(true);
            await adopterPreferencesService.updatePreferences(userId, preferencesData)
            
            onSuccess();

            AppToast.success('Sucesso', 'Preferências salvas com sucesso!');
        } catch (err: any) {
            handleError(err.message, 'Falha ao salvar preferências.');
        } finally {
            setSaving(false);
        }
    };

    // Atualização manual de outros campos do form
    const updateField = (field: keyof AdopterPreferencesFormData, value: any) => {
        console.log(`Updating field ${field} with value:`, value);
        setPreferencesData((prev) => ({ ...prev, [field]: value }));
    };

    return { preferencesData, setPreferencesData, saving, savePreferences, updateField };
}