// Tela principal que junta e alterna a exibição das 4 etapas de cadastro.
import { CustomPrimaryActionButton } from '@/components/buttons/CustomPrimaryActionButton';
import { TitleHeader } from '@/components/navigation/TitleHeader';
import { LoadingIndicator } from '@/components/ui/LoadingIndicator';
import { colors } from '@/constants/colors';
import { AnyAnimalForm } from '@/types/animal.types';
import { pickFromGallery, takePhoto } from '@/utils/photoUtils';
import { useNavigation } from '@react-navigation/native';
import { Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Step1BasicInfo } from './components/Step1BasicInfo';
import { Step2HealthInfo } from './components/Step2HealthInfo';
import { Step3Preferences } from './components/Step3Preferences';
import { Step4PhotoUpload } from './components/Step4PhotoUpload';
import { StepProgressIndicator } from './components/StepProgressIndicator';

export interface AnimalFormUIProps {
    mode: 'create' | 'update';
    currentStep: number;
    formData: AnyAnimalForm;
    isSubmitting: boolean;
    isLoadingData?: boolean;
    updateField: <K extends keyof AnyAnimalForm>(field: K, value: AnyAnimalForm[K]) => void;
    nextStep: () => void;
    prevStep: () => void;
    setPhoto: (photo: any) => void;
    removePhoto: () => void;
    handleSubmit: () => void;
}

export function AnimalFormUI(props: AnimalFormUIProps) {
    const navigation = useNavigation();
    const {
        mode, currentStep, formData, isSubmitting, isLoadingData,
        updateField, nextStep, prevStep, handleSubmit, setPhoto, removePhoto
    } = props;

    if (isLoadingData) {
        return (
            <LoadingIndicator message='Carregando dados do animal.' fullScreen={true} />
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <TitleHeader
                title={mode === 'create' ? 'Cadastrar Novo Pet' : 'Editar Pet'}
                onPressBackButton={() => navigation.goBack()}
            />
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
                        onUpdatePhoto={setPhoto}
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

                    <CustomPrimaryActionButton
                        text={currentStep === 4 ? mode === 'create' ? 'Finalizar Cadastro' : 'Salvar Alterações' : 'Próxima Etapa'}
                        onPress={currentStep === 4 ? handleSubmit : nextStep}
                        disabled={isSubmitting}
                        loading={isSubmitting}
                        style={{ flex: 1 }}
                    />
                </View>
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
        flexGrow: 1
    },
    footerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 24,
        gap: 12,
        flexGrow: 1
    },
    backButton: {
        flex: 1,
        marginTop: 50,
        height: 48,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
    },
    backButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.neutral[600],
    },
});