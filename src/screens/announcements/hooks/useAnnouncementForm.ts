import { announcementService } from '@/services/announcementService';
import { photoUploadService } from '@/services/photoUploadService';
import { PhotoInterface } from '@/utils/photoUtils';
import { AppToast } from '@/utils/toast';
import { useEffect, useState } from 'react';

interface AnnouncementFormData {
  title: string;
  subtitle: string;
  photoUri: string | null;
  imageUrl: string | null;
}

const EMPTY_FORM: AnnouncementFormData = {
  title: '',
  subtitle: '',
  photoUri: null,
  imageUrl: null,
};

export function useAnnouncementForm(announcementId: string | undefined, onSuccess?: () => void) {
  const isEditing = Boolean(announcementId);
  const [formData, setFormData] = useState<AnnouncementFormData>(EMPTY_FORM);
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(isEditing);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!announcementId) return;

    let active = true;

    announcementService
      .getById(announcementId)
      .then((data) => {
        if (!active) return;
        setPhotoBase64(null);
        setFormData({
          title: data.title,
          subtitle: data.subtitle,
          photoUri: data.image_url,
          imageUrl: data.image_url,
        });
      })
      .catch((error: any) => {
        if (!active) return;
        AppToast.error('Erro', error?.message || 'Não foi possível carregar o anúncio.');
      })
      .finally(() => {
        if (active) setIsLoadingData(false);
      });

    return () => {
      active = false;
    };
  }, [announcementId]);

  const updateField = <K extends keyof AnnouncementFormData>(field: K, value: AnnouncementFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const setPhoto = (photo: PhotoInterface) => {
    setPhotoBase64(photo.photoBase64);
    setFormData((prev) => ({ ...prev, photoUri: photo.photoUri }));
  };

  const removePhoto = () => {
    setPhotoBase64(null);
    setFormData((prev) => ({ ...prev, photoUri: null, imageUrl: null }));
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      AppToast.info('Campo obrigatório', 'Informe o título do anúncio.');
      return;
    }
    if (!formData.subtitle.trim()) {
      AppToast.info('Campo obrigatório', 'Informe o texto de apoio do anúncio.');
      return;
    }
    if (!formData.photoUri) {
      AppToast.info('Campo obrigatório', 'Selecione uma imagem para o anúncio.');
      return;
    }

    try {
      setIsSubmitting(true);
      const imageUrl = photoBase64
        ? await photoUploadService.uploadAnnouncementPhoto(photoBase64, formData.title)
        : formData.imageUrl;

      if (!imageUrl) {
        throw new Error('Selecione uma imagem para o anúncio.');
      }

      const payload = {
        title: formData.title.trim(),
        subtitle: formData.subtitle.trim(),
        image_url: imageUrl,
      };

      if (announcementId) {
        await announcementService.update(announcementId, payload);
        AppToast.success('Sucesso', 'Anúncio atualizado com sucesso!');
      } else {
        await announcementService.create(payload);
        AppToast.success('Sucesso', 'Anúncio cadastrado com sucesso!');
      }

      onSuccess?.();
    } catch (error: any) {
      AppToast.error('Erro ao salvar', error?.message || 'Não foi possível salvar o anúncio.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isEditing,
    formData,
    isLoadingData,
    isSubmitting,
    updateField,
    setPhoto,
    removePhoto,
    handleSubmit,
  };
}
