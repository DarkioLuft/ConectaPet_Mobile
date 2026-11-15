import { LocationCard } from '@/components/cards/LocationCard';
import { StyleSheet, View } from 'react-native';
import { AboutCard } from './AboutCard';
import { ContactsCard } from './ContactsCard';

export function OngAboutSection({ data }: any) {
  if (!data) return null;

  return (
    <View style={styles.container}>
      <AboutCard about={data.about} />

      <ContactsCard
        instagram={data.instagram}
        whatsapp={data.whatsapp || data.phone}
        email={data.email}
        website={data.website}
      />

      {data.address && (
        <LocationCard
          sectionTitle="Onde Estamos"
          title={data.name}
          addressData={data.address}
          fallbackCoordinates={data.location?.coordinates}
          iconName="business"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 22,
  },
});