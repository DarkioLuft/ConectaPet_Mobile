// Tela principal que junta e alterna a exibição das 4 etapas de cadastro.

import { useNavigation } from '@react-navigation/native';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Step1BasicInfo } from './components/Step1BasicInfo';
import { Step2HealthInfo } from './components/Step2HealthInfo';
import { Step3Preferences } from './components/Step3Preferences';
import { Step4PhotoUpload } from './components/Step4PhotoUpload';
import { StepProgressIndicator } from './components/StepProgressIndicator';
import { useCreateAnimal } from './hooks/useCreateAnimal';

export function CreateAnimalScreen() {
  const navigation = useNavigation();
  const {
    currentStep,
    formData,
    isSubmitting,
    updateField,
    nextStep,
    prevStep,
    takePhoto,
    pickFromGallery,
    removePhoto,
    handleSubmit,
  } = useCreateAnimal(() => navigation.goBack());

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <StepProgressIndicator currentStep={currentStep} />

        {currentStep === 1 && (
          <Step1BasicInfo data={formData} onUpdate={updateField} />
        )}
        {currentStep === 2 && (
          <Step2HealthInfo data={formData} onUpdate={updateField} />
        )}
        {currentStep === 3 && (
          <Step3Preferences data={formData} onUpdate={updateField} />
        )}
        {currentStep === 4 && (
          <Step4PhotoUpload
            data={formData}
            onTakePhoto={takePhoto}
            onPickGallery={pickFromGallery}
            onRemovePhoto={removePhoto}
          />
        )}

        {/* Barra de Navegação Inferior */}
        <View style={styles.footerRow}>
          {currentStep > 1 && (
            <TouchableOpacity
              onPress={prevStep}
              disabled={isSubmitting}
              activeOpacity={0.7}
              style={styles.backButton}
            >
              <Text style={styles.backButtonText}>Voltar</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={currentStep === 4 ? handleSubmit : nextStep}
            disabled={isSubmitting}
            activeOpacity={0.7}
            style={[
              styles.nextButton,
              currentStep === 1 ? { flex: 1 } : { flex: 1.5 },
            ]}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.nextButtonText}>
                {currentStep === 4 ? 'Finalizar Cadastro' : 'Próxima Etapa'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 130, // Garante que o final da tela role bem acima da barra de navegação
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    gap: 12,
  },
  backButton: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  nextButton: {
    height: 48,
    borderRadius: 8,
    backgroundColor: '#16a34a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
});