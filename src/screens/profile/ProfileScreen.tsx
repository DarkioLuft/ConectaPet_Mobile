import { colors } from '@/constants/colors';
import { ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ModernBottomBar } from '../../components/navigation/ModernBottomBar';
import { AddressSection } from './components/AddressSection';
import { AdopterMatchSection } from './components/AdopterMatchSection';
import { PersonalDataSection } from './components/PersonalDataSection';
import { ProfileHeader } from './components/ProfileHeader';
import { ProfileSectionTabs } from './components/ProfileSectionTabs';
import { useProfile } from './hooks/useProfile';

export function ProfileScreen() {
  const {
    activeTab,
    setActiveTab,
    loading,
    saving,
    isVolunteer,
    housingTypes,
    personalData,
    setPersonalData,
    addressData,
    setAddressData,
    preferencesData,
    setPreferencesData,
    progress,
    handleCepChange,
    savePersonalData,
    saveAddressData,
    savePreferencesData,
    handlePickAvatar,
    handleTabSelect,
  } = useProfile();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Cabeçalho Fixo com Informações e Progresso */}
      <ProfileHeader
        fullName={personalData.fullName}
        email={personalData.email}
        avatarUrl={personalData.avatarUrl}
        isVolunteer={isVolunteer}
        progress={progress}
        onPressChangeAvatar={handlePickAvatar}
      />

      {/* Seletor de Abas em Pílula */}
      <ProfileSectionTabs currentTab={activeTab} onSelectTab={setActiveTab} />

      {/* Conteúdo Dinâmico */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <ActivityIndicator color={colors.primary[500]} style={{ marginTop: 32 }} />
        ) : (
          <>
            {activeTab === 'personal' && (
              <PersonalDataSection
                data={personalData}
                onChange={(f, v) => setPersonalData((prev) => ({ ...prev, [f]: v }))}
                onSave={savePersonalData}
                saving={saving}
              />
            )}

            {activeTab === 'address' && (
              <AddressSection
                data={addressData}
                onChange={(f, v) => setAddressData((prev) => ({ ...prev, [f]: v }))}
                onChangeCep={handleCepChange}
                onSave={saveAddressData}
                saving={saving}
              />
            )}

            {activeTab === 'preferences' && (
              <AdopterMatchSection
                data={preferencesData}
                housingTypes={housingTypes}
                onChange={(f, v) => setPreferencesData((prev) => ({ ...prev, [f]: v }))}
                onSave={savePreferencesData}
                saving={saving}
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