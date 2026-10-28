import { CustomPrimaryActionButton } from '@/components/buttons/CustomPrimaryActionButton';
import { CustomTextAreaField } from '@/components/forms/CustomTextAreaField';
import { TitleHeader } from '@/components/navigation/TitleHeader';
import { ImagePreviewContainer } from '@/components/ui/ImagePreviewContainer';
import { LoadingIndicator } from '@/components/ui/LoadingIndicator';
import { colors } from '@/constants/colors';
import { pickFromGallery, takePhoto } from '@/utils/photoUtils';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { useAnnouncementForm } from './hooks/useAnnouncementForm';

export function AnnouncementFormScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const announcementId = route.params?.announcementId as string | undefined;
  const {
    isEditing,
    formData,
    isLoadingData,
    isSubmitting,
    updateField,
    setPhoto,
    removePhoto,
    handleSubmit,
  } = useAnnouncementForm(announcementId, () => navigation.goBack());

  if (isLoadingData) {
    return <LoadingIndicator message="Carregando anúncio." fullScreen />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <TitleHeader
        title={isEditing ? 'Editar anúncio' : 'Cadastrar anúncio'}
        onPressBackButton={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Dados do anúncio</Text>
        <Text style={styles.helper}>
          A ordem no carrossel segue a data de cadastro, do mais antigo para o mais recente.
        </Text>

        <CustomTextAreaField
          label="Título *"
          placeholder="Ex: Feira de adoção neste sábado"
          value={formData.title}
          maxLength={120}
          onChangeText={(value) => updateField('title', value)}
        />

        <CustomTextAreaField
          label="Texto de apoio *"
          placeholder="Ex: Venha encontrar o seu melhor amigo."
          value={formData.subtitle}
          maxLength={240}
          onChangeText={(value) => updateField('subtitle', value)}
        />

        <Text style={styles.imageLabel}>Imagem *</Text>
        <ImagePreviewContainer
          photoUri={formData.photoUri}
          onTakePhoto={takePhoto}
          onPickGallery={pickFromGallery}
          onRemovePhoto={removePhoto}
          onUpdatePhoto={setPhoto}
        />

        <CustomPrimaryActionButton
          text={isEditing ? 'Salvar alterações' : 'Cadastrar anúncio'}
          onPress={handleSubmit}
          disabled={isSubmitting}
          loading={isSubmitting}
          style={styles.submitButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.neutral[800],
  },
  helper: {
    marginTop: 6,
    marginBottom: 8,
    fontSize: 13,
    lineHeight: 18,
    color: colors.neutral[600],
  },
  imageLabel: {
    marginTop: 8,
    marginBottom: 8,
    fontSize: 13,
    fontWeight: '700',
    color: colors.neutral[400],
  },
  submitButton: {
    marginTop: 12,
  },
});
