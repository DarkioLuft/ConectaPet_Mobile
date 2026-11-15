import { TitleHeader } from '@/components/navigation/TitleHeader';
import { LoadingIndicator } from '@/components/ui/LoadingIndicator';
import { colors } from '@/constants/colors';
import { styles } from '@/constants/styles';
import { useNavigation } from '@react-navigation/native';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SectionTabs } from '../../components/navigation/SectionTabs';
import { OngAboutSection } from './components/OngAboutSection';
import { OngDonateSection } from './components/OngDonateSection';
import { OngPetsSection } from './components/OngPetsSection';
import { OngProfileHeader } from './components/OngProfileHeader';
import { useOngPetsSection } from './hooks/useOngPetsSection';
import { useOngProfile } from './hooks/useOngProfile';

export function OngProfileScreen({ route }: any) {
  const { ongId } = route.params;
  const navigation = useNavigation<any>();

  const {
    tabs,
    activeTab,
    setActiveTab,
    loading,
    ongData,
    handleWhatsApp,
    handleOpenRoute,
    handleShare,
  } = useOngProfile(ongId);

  const { pets, loadingPets } = useOngPetsSection({ ongId });

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {loading || !ongData ? (
        <LoadingIndicator message="Carregando perfil..." fullScreen={true} />
      ) : (
        <>
          <TitleHeader
            title="Detalhes da ONG"
            onPressBackButton={() => navigation.goBack()}
          />

          <ScrollView
            contentContainerStyle={localStyles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <OngProfileHeader
              data={ongData}
              onWhatsApp={handleWhatsApp}
              onOpenRoute={handleOpenRoute}
              onShare={handleShare}
            />

            <View style={localStyles.tabsWrapper}>
              <SectionTabs
                tabs={tabs}
                currentTab={activeTab}
                onSelectTab={setActiveTab}
              />
            </View>

            {activeTab.key === 'about' && (
              <OngAboutSection data={ongData} />
            )}

            {activeTab.key === 'pets' && (
              <OngPetsSection
                pets={pets}
                loading={loadingPets}
              />
            )}

            {activeTab.key === 'donate' && (
              <OngDonateSection
                data={ongData}
                onWhatsAppFallback={handleWhatsApp}
              />
            )}
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
    backgroundColor: colors.neutral[50],
  },
  tabsWrapper: {
    backgroundColor: colors.white,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
});