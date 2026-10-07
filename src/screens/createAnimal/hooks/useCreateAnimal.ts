import { AnimalAndPreferencesDTO } from '@/dtos/animal.dto';
import { animalService } from '@/services/animalService';
import { photoUploadService } from '@/services/photoUploadService';
import { parseAge, parseWeight } from '@/utils/formUtils';
import { AppToast } from '@/utils/toast';
import { useState } from 'react';
import { INITIAL_FORM, useAnimalForm } from './useAnimalForm';

export function useCreateAnimal(onSuccess?: () => void) {
  // Instancia o form base com os dados vazios
  const form = useAnimalForm(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      let photoUrl = null;

      if (form.photoBase64) {
        photoUrl = await photoUploadService.uploadAnimalPhoto(form.photoBase64, form.formData.name!);
      }

      const parsedWeight = parseWeight(form.formData.weight_kg || '');
      const parsedAge = parseAge(form.formData.age_years || '');

      const formData = form.formData;

      await animalService.createAnimal({
        name: formData.name?.trim(),
        species: formData.species!,
        sex: formData.sex!,
        size: formData.size!,
        age_group: formData.age_group!,
        age_years: parsedAge,
        weight_kg: parsedWeight,
        color: formData.color?.trim() || undefined,
        description: formData.description?.trim() || undefined,
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
        special_needs_desc: formData.special_needs ? formData.special_needs_desc?.trim() : undefined,
      } as AnimalAndPreferencesDTO);

      AppToast.success('Sucesso', 'Animal cadastrado com sucesso!');
      form.resetForm();
      onSuccess?.();
    } catch (err: any) {
      AppToast.error('Erro ao Salvar', err?.message || 'Falha ao guardar os dados do animal.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    ...form,
    isSubmitting,
    handleSubmit,
  };
}