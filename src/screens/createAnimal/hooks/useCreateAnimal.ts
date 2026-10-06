// Hook com as regras de negócio da interface, validações de etapas, fotos e envio ao Supabase.

import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Alert } from 'react-native';
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
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const resetForm = () => {
    setFormData(INITIAL_FORM);
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
        Alert.alert('Campo Obrigatório', 'Informe o nome do pet.');
        return;
      }
      if (!formData.species) {
        Alert.alert('Campo Obrigatório', 'Selecione a espécie do pet.');
        return;
      }
      if (!formData.sex) {
        Alert.alert('Campo Obrigatório', 'Selecione o sexo do pet.');
        return;
      }
      if (!formData.size) {
        Alert.alert('Campo Obrigatório', 'Selecione o porte do animal.');
        return;
      }
      if (!formData.age_group) {
        Alert.alert('Campo Obrigatório', 'Selecione a faixa etária.');
        return;
      }

      // Validação de overflow numérico
      if (formData.weight_kg) {
        const weight = Number(formData.weight_kg.replace(',', '.'));
        if (isNaN(weight) || weight <= 0 || weight > 300) {
          Alert.alert('Peso Inválido', 'O peso deve ser maior que 0 e menor que 300 kg.');
          return;
        }
      }

      if (formData.age_years) {
        const age = Number(formData.age_years);
        if (isNaN(age) || age < 0 || age > 35) {
          Alert.alert('Idade Inválida', 'A idade deve estar entre 0 e 35 anos.');
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
        Alert.alert('Campos Obrigatórios', 'Responda a todas as opções de controle sanitário.');
        return;
      }
    } else if (currentStep === 3) {
      if (!formData.energy) {
        Alert.alert('Campo Obrigatório', 'Selecione o nível de energia.');
        return;
      }
      if (
        formData.good_with_kids === null ||
        formData.good_with_dogs === null ||
        formData.good_with_cats === null ||
        formData.apartment_friendly === null ||
        formData.special_needs === null
      ) {
        Alert.alert(
          'Campos Obrigatórios',
          'Responda a todas as opções de convivência e cuidados especiais.'
        );
        return;
      }
      if (formData.special_needs && !formData.special_needs_desc.trim()) {
        Alert.alert('Campo Obrigatório', 'Descreva as necessidades especiais.');
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

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'É preciso permissão para usar a câmara.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets.length > 0) {
      updateField('photoUri', result.assets[0].uri);
    }
  };

  const pickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'É preciso permissão para aceder à galeria.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets.length > 0) {
      updateField('photoUri', result.assets[0].uri);
    }
  };

  const removePhoto = () => {
    updateField('photoUri', null);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      let photoUrl: string | undefined = undefined;

      if (formData.photoUri) {
        photoUrl = await animalService.uploadAnimalPhoto(formData.photoUri, formData.name);
      }

      // Arredonda para no máximo 2 casas decimais para respeitar o DECIMAL(5,2)
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

      Alert.alert('Sucesso', 'Animal cadastrado com sucesso!', [
        {
          text: 'OK',
          onPress: () => {
            resetForm(); // Limpa todos os campos para o próximo cadastro
            onSuccess?.();
          },
        },
      ]);
    } catch (err: any) {
      Alert.alert('Erro ao Salvar', err?.message || 'Falha ao guardar os dados do animal.');
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
    takePhoto,
    pickFromGallery,
    removePhoto,
    resetForm,
    handleSubmit,
  };
}