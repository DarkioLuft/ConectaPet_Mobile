// Hook com as regras de negócio da interface, validações de etapas, fotos e envio ao Supabase.
import { photoUploadService } from '@/services/photoUploadService';
import { PhotoInterface } from '@/utils/photoUtils';
import { AppToast } from '@/utils/toast';
import { useState } from 'react';
import { animalService } from '../../../services/animalService';
import { CreateAnimalFormData } from '../types/createAnimal.types';

const INITIAL_FORM: CreateAnimalFormData = {
  name: '',
  species: null,
  sex: null,
  size: null,
  age_group: null,
  age_years: '',
  weight_kg: '',
  color: '',
  description: '',
  is_vaccinated: null,
  is_neutered: null,
  is_dewormed: null,
  has_microchip: null,
  energy: null,
  good_with_kids: null,
  good_with_dogs: null,
  good_with_cats: null,
  apartment_friendly: null,
  special_needs: null,
  special_needs_desc: '',
  photoUri: null,
};

export function useCreateAnimal(onSuccess?: () => void) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<CreateAnimalFormData>(INITIAL_FORM);
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const resetForm = () => {
    setFormData(INITIAL_FORM);
    setPhotoBase64(null);
    setCurrentStep(1);
  };

  const updateField = <K extends keyof CreateAnimalFormData>(
    field: K,
    value: CreateAnimalFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep === 1) {
      if (!formData.name.trim()) {
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
        const weight = Number(formData.weight_kg.replace(',', '.'));
        if (isNaN(weight) || weight <= 0 || weight > 300) {
          AppToast.error('Peso Inválido', 'O peso deve ser maior que 0 e menor que 300 kg.');
          return;
        }
      }

      if (formData.age_years) {
        const age = Number(formData.age_years);
        if (isNaN(age) || age < 0 || age > 35) {
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
      if (formData.special_needs && !formData.special_needs_desc.trim()) {
        AppToast.info('Campo Obrigatório', 'Descreva as necessidades especiais.');
        return;
      }
    }

    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const setPhoto = (photoData: PhotoInterface) => {
    updateField('photoUri', photoData.photoUri);
    setPhotoBase64(photoData.photoBase64);
  }

  const removePhoto = () => {
    updateField('photoUri', null);
    setPhotoBase64(null);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      let photoUrl = null;

      // Realiza o upload utilizando os bytes da imagem em base64
      if (photoBase64) {
        photoUrl = await photoUploadService.uploadAnimalPhoto(photoBase64, formData.name);
      }

      const parsedWeight = formData.weight_kg
        ? Number(Number(formData.weight_kg.replace(',', '.')).toFixed(2))
        : undefined;

      await animalService.createAnimal({
        name: formData.name.trim(),
        species: formData.species!,
        sex: formData.sex!,
        size: formData.size!,
        age_group: formData.age_group!,
        weight_kg: parsedWeight,
        color: formData.color.trim() || undefined,
        description: formData.description.trim() || undefined,
        is_vaccinated: formData.is_vaccinated ?? false,
        is_neutered: formData.is_neutered ?? false,
        is_dewormed: formData.is_dewormed ?? false,
        has_microchip: formData.has_microchip ?? false,
        cover_photo_url: photoUrl,
        energy: formData.energy!,
        good_with_kids: formData.good_with_kids ?? false,
        good_with_dogs: formData.good_with_dogs ?? false,
        good_with_cats: formData.good_with_cats ?? false,
        apartment_friendly: formData.apartment_friendly ?? false,
        special_needs: formData.special_needs ?? false,
        special_needs_desc: formData.special_needs ? formData.special_needs_desc.trim() : undefined,
      } as any);

      AppToast.success('Sucesso', 'Animal cadastrado com sucesso!');
      resetForm();
      onSuccess?.();
    } catch (err: any) {
      AppToast.error('Erro ao Salvar', err?.message || 'Falha ao guardar os dados do animal.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    currentStep,
    formData,
    isSubmitting,
    updateField,
    nextStep,
    prevStep,
    removePhoto,
    resetForm,
    handleSubmit,
    setPhoto
  };
}