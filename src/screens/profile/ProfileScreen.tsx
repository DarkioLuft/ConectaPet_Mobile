import { LoadingIndicator } from '@/components/ui/LoadingIndicator';
import { colors } from '@/constants/colors';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ModernBottomBar } from '../../components/navigation/ModernBottomBar';
import { AddressSection } from './components/AddressSection';
import { AdopterMatchSection } from './components/AdopterMatchSection';
import { PersonalDataSection } from './components/PersonalDataSection';
import { ProfileHeader } from './components/ProfileHeader';
import { ProfileSectionTabs } from './components/ProfileSectionTabs';
import { useAddressSection } from './hooks/useAddressSection';
import { usePersonalSection } from './hooks/usePersonalSection';
import { usePreferencesSection } from './hooks/usePreferencesSection';
import { useProfile } from './hooks/useProfile';

export function ProfileScreen() {
  const {
    userId,
    activeTab,
    setActiveTab,
    loading,
    progress,
    isVolunteer,
    housingTypes,
    rawPersonal,
    rawAddress,
    rawPreferences,
    loadProfileData,
    handleTabSelect,
    updateAndSetProgress
  } = useProfile();

  // Instanciando os sub-hooks e passando a função de recarregar como callback
  const personal = usePersonalSection({ initialData: rawPersonal, userId, onSuccess: loadProfileData });
  const address = useAddressSection({ initialData: rawAddress, userId, onSuccess: loadProfileData });
  const preferences = usePreferencesSection({ initialData: rawPreferences, userId, onSuccess: loadProfileData });

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Cabeçalho Fixo com Informações e Progresso */}
      <ProfileHeader
        fullName={rawPersonal?.fullName || ""}
        email={rawPersonal?.email || ""}
        avatarUrl={rawPersonal?.avatarUrl || ""}
        isVolunteer={isVolunteer}
        progress={progress}
        onPressChangeAvatar={personal.handlePickAvatar}
      />

      {/* Seletor de Abas em Pílula */}
      <ProfileSectionTabs currentTab={activeTab} onSelectTab={setActiveTab} />

      {/* Conteúdo Dinâmico */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <LoadingIndicator message="Carregando..." fullScreen={true} />
        ) : (
          <>
            {activeTab === 'personal' && (
              <PersonalDataSection
                data={personal.personalData}
                onChange={(field, value) => personal.updateField(field, value)}
                onSave={personal.savePersonalData}
                saving={personal.saving}
              />
            )}

            {activeTab === 'address' && (
              <AddressSection
                data={address.addressData}
                onChange={(field, value) => address.updateField(field, value)}
                onChangeCep={address.handleCepChange}
                onSave={address.saveAddress}
                saving={address.savingAddress}
              />
            )}

            {activeTab === 'preferences' && (
              <AdopterMatchSection
                data={preferences.preferencesData}
                housingTypes={housingTypes}
                onChange={(field, value) => preferences.updateField(field, value)}
                onSave={preferences.savePreferences}
                saving={preferences.saving}
              />
            )}
          </>
        )}
      </ScrollView>

      {/* Barra de Navegação Inferior Ativa no Perfil */}
      <ModernBottomBar
        currentTab="profile"
        onSelectTab={handleTabSelect}
        isVolunteerOrAbove={isVolunteer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    paddingBottom: 95,
  },
});