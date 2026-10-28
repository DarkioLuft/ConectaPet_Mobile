import { LoadingIndicator } from '@/components/ui/LoadingIndicator';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SectionTabs } from '../../components/navigation/SectionTabs';

import { TitleHeader } from '@/components/navigation/TitleHeader';
import { styles } from '@/constants/styles';
import { useNavigation } from '@react-navigation/native';
import { OngAboutSection } from './components/OngAboutSection';
import { OngPetsSection } from './components/OngPetsSection';
import { OngProfileHeader } from './components/OngProfileHeader';
import { useOngPetsSection } from './hooks/useOngPetsSection';
import { useOngProfile } from './hooks/useOngProfile';

export function OngProfileScreen({ route }: any) {
    const { ongId } = route.params;

    const navigation = useNavigation();

    const {
        tabs,
        activeTab,
        setActiveTab,
        loading,
        ongData,
    } = useOngProfile(ongId);

    const { pets, loadingPets } = useOngPetsSection({ ongId });

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>

            {loading || !ongData ? (
                <LoadingIndicator message="Carregando perfil..." fullScreen={true} />
            ) : (
                <>
                    <TitleHeader
                        title={"Detalhes da ONG"}
                        onPressBackButton={() => navigation.goBack()}
                    />
                    <OngProfileHeader
                        data={ongData}
                    />

                    <SectionTabs
                        tabs={tabs}
                        currentTab={activeTab}
                        onSelectTab={setActiveTab}
                    />

                    <ScrollView
                        contentContainerStyle={localStyles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        {activeTab.key === 'about' && (
                            <OngAboutSection
                                data={ongData}
                            />
                        )}

                        {activeTab.key === 'pets' && (
                            <OngPetsSection
                                pets={pets}
                                loading={loadingPets}
                            />
                        )}

                        {activeTab.key === 'donate' && (
                            <Text>Ainda não implementado</Text>
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
    }
});