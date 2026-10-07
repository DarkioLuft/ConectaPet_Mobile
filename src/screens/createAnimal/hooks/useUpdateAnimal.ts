import { AnimalAndPreferencesDTO } from '@/dtos/animal.dto';
import { animalService } from '@/services/animalService';
import { photoUploadService } from '@/services/photoUploadService';
import { parseAge, parseWeight } from '@/utils/formUtils';
import { AppToast } from '@/utils/toast';
import { useCallback, useEffect, useState } from 'react';
import { INITIAL_FORM, useAnimalForm } from './useAnimalForm';

export function useUpdateAnimal(animalId: string, onSuccess?: () => void) {
    const [initialData, setInitialData] = useState(INITIAL_FORM);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Instancia o form base passando os dados que vêm do banco
    const form = useAnimalForm(initialData);

    const fetchAnimal = useCallback(async () => {
        try {
            setIsLoadingData(true);
            const data: AnimalAndPreferencesDTO = await animalService.getAnimalDataAndPreferencesByAnimalId(animalId);

            // Converte os dados do banco para o formato do form
            setInitialData({
                ...INITIAL_FORM,
                ...data,
                weight_kg: data.weight_kg ? String(data.weight_kg) : '',
                age_years: data.age_years ? String(data.age_years) : '',
                photoUri: data.cover_photo_url || null,
            });
        } catch (err: any) {
            AppToast.error('Erro', 'Não foi possível carregar os dados do animal.');
        } finally {
            setIsLoadingData(false);
        }
    }, [animalId]);

    useEffect(() => {
        if (animalId) fetchAnimal();
    }, [fetchAnimal]);

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);
            let photoUrl = form.formData.photoUri; // Mantém a foto antiga por padrão

            // Se tiver uma foto em base64, significa que o usuário alterou a foto
            if (form.photoBase64) {
                photoUrl = await photoUploadService.uploadAnimalPhoto(form.photoBase64, form.formData.name!);
            }

            const parsedWeight = parseWeight(form.formData.weight_kg || '');
            const parsedAge = parseAge(form.formData.age_years || '');

            console.log('INICIO')

            await animalService.updateAnimal(animalId, {
                ...form.formData,
                name: form.formData.name!.trim(),
                weight_kg: parsedWeight,
                age_years: parsedAge,
                cover_photo_url: photoUrl,
            } as AnimalAndPreferencesDTO);
            console.log('FIM')

            AppToast.success('Sucesso', 'Animal atualizado com sucesso!');
            onSuccess?.();
        } catch (err: any) {
            AppToast.error('Erro ao Salvar', err?.message || 'Falha ao atualizar o animal.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        ...form,
        isLoadingData,
        isSubmitting,
        handleSubmit,
    };
}

// const formatFormFieldsForUpdate = (form: ) => {

// }