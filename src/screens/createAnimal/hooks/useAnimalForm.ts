import { AnyAnimalForm } from '@/types/animal.types';
import { parseAge, parseWeight } from '@/utils/formUtils';
import { PhotoInterface } from '@/utils/photoUtils';
import { AppToast } from '@/utils/toast';
import { useEffect, useState } from 'react';

export const INITIAL_FORM: AnyAnimalForm = {
    name: '', species: null, sex: null, size: null, age_group: null,
    age_years: '', weight_kg: '', color: '', description: '',
    is_vaccinated: null, is_neutered: null, is_dewormed: null,
    has_microchip: null, energy: null, good_with_kids: null,
    good_with_dogs: null, good_with_cats: null, apartment_friendly: null,
    special_needs: null, special_needs_desc: '', photoUri: null,
};

export function useAnimalForm(initialData: AnyAnimalForm) {
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [formData, setFormData] = useState<AnyAnimalForm>(initialData);
    const [photoBase64, setPhotoBase64] = useState<string | null>(null);

    // Quando os dados chegarem do banco, atualiza o form
    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const updateField = <K extends keyof AnyAnimalForm>(
        field: K,
        value: AnyAnimalForm[K]
    ) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const nextStep = () => {
        if (currentStep === 1) {
            if (!formData.name?.trim()) {
                AppToast.info('Campo Obrigatório', 'Informe o nome do pet.')
                return;
            }
            if (!formData.species) {
                AppToast.info('Campo Obrigatório', 'Selecione a espécie do pet.');
                return;
            }
            if (!formData.sex) {
                AppToast.info('Campo Obrigatório', 'Selecione o sexo do pet.');
                return;
            }
            if (!formData.size) {
                AppToast.info('Campo Obrigatório', 'Selecione o porte do animal.');
                return;
            }
            if (!formData.age_group) {
                AppToast.info('Campo Obrigatório', 'Selecione a faixa etária.');
                return;
            }

            if (formData.weight_kg) {
                // const weight = Number(formData.weight_kg.replace(',', '.'));
                const weight = parseWeight(formData.weight_kg);
                if (!weight || isNaN(weight) || weight <= 0 || weight > 300) {
                    AppToast.error('Peso Inválido', 'O peso deve ser maior que 0 e menor que 300 kg.');
                    return;
                }
            }

            if (formData.age_years) {
                // const age = Number(formData.age_years);
                const age = parseAge(formData.age_years);
                if (!age ||isNaN(age) || age < 0 || age > 35) {
                    AppToast.error('Idade Inválida', 'A idade deve estar entre 0 e 35 anos.');
                    return;
                }
            }
        } else if (currentStep === 2) {
            if (
                formData.is_vaccinated === null ||
                formData.is_neutered === null ||
                formData.is_dewormed === null ||
                formData.has_microchip === null
            ) {
                AppToast.info('Campos Obrigatórios', 'Responda a todas as opções de controle sanitário.');
                return;
            }
        } else if (currentStep === 3) {
            if (!formData.energy) {
                AppToast.info('Campo Obrigatório', 'Selecione o nível de energia.');
                return;
            }
            if (
                formData.good_with_kids === null ||
                formData.good_with_dogs === null ||
                formData.good_with_cats === null ||
                formData.apartment_friendly === null ||
                formData.special_needs === null
            ) {
                AppToast.info(
                    'Campos Obrigatórios',
                    'Responda a todas as opções de convivência e cuidados especiais.'
                );
                return;
            }
            if (formData.special_needs && !formData.special_needs_desc?.trim()) {
                AppToast.info('Campo Obrigatório', 'Descreva as necessidades especiais.');
                return;
            }
        }

        if (currentStep < 4) {
            setCurrentStep((prev) => prev + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep((prev) => prev - 1);
    };

    const setPhoto = (photoData: PhotoInterface) => {
        updateField('photoUri', photoData.photoUri);
        setPhotoBase64(photoData.photoBase64);
    };

    const removePhoto = () => {
        updateField('photoUri', null);
        setPhotoBase64(null);
    };

    const resetForm = () => {
        setFormData(INITIAL_FORM);
        setPhotoBase64(null);
        setCurrentStep(1);
    };

    return {
        currentStep,
        formData,
        photoBase64,
        updateField,
        nextStep,
        prevStep,
        setPhoto,
        removePhoto,
        resetForm,
    };
}