import { LocationCard } from '@/components/cards/LocationCard';
import { StyleSheet, View } from 'react-native';
import { AboutCard } from './AboutCard';
import { ContactsCard } from './ContactsCard';

export function OngAboutSection({ data }: any) {
  console.log(data)
  if (!data) return null;

  return (
    <View style={styles.container}>
      <AboutCard about={data?.description} />

      <LocationCard
        sectionTitle="Localização da ONG"
        title={data?.name}
        addressData={data?.address}
        fallbackCoordinates={data?.coordinates}

        // Customizações
        iconName="business"
        actionText="Mais detalhes da ONG"
        // onActionPress={() => onCardClick(pet?.ongs?.id)}
      />
      
      <ContactsCard
        instagram={data?.instagram}
        email={data?.email}
        website={data?.website}
        whatsapp={data?.whatsapp}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    gap: 24,
  },
});