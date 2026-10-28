import { colors } from "@/constants/colors";
import { styles } from "@/constants/styles";
import { Ionicons } from "@expo/vector-icons";
import { Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export function ContactsCard({ instagram, whatsapp, email, website }: any) {
  const hasNoSocials = !instagram && !whatsapp && !email && !website;

  const SocialItem = ({ icon, color, label, value, onPress }: any) => (
    <TouchableOpacity style={localStyles.socialRow} onPress={onPress} activeOpacity={0.7}>
      <View style={[localStyles.socialIconBox, { backgroundColor: color + '1A' }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <View style={localStyles.socialTextContainer}>
        <Text style={localStyles.socialLabel}>{label}</Text>
        <Text style={localStyles.socialValue} numberOfLines={1}>{value}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.neutral[400]} />
    </TouchableOpacity>
  );

  return (
    <View style={localStyles.section}>
      <Text style={localStyles.sectionTitle}>Contatos e Redes</Text>
      <View style={[styles.card, styles.shadow]}>

        {instagram && (
          <SocialItem
            icon="logo-instagram"
            color="#e1306c"
            label="Instagram"
            value={`@${instagram}`}
            onPress={() => Linking.openURL(`https://instagram.com/${instagram}`)}
          />
        )}

        {whatsapp && (
          <SocialItem
            icon="logo-whatsapp"
            color={colors.primary[700]}
            label="Whatsapp"
            value={whatsapp}
            onPress={() => Linking.openURL(`whatsapp://send?phone=${whatsapp}`)}
          />
        )}

        {email && (
          <SocialItem
            icon="mail"
            color={colors.semantic.warning}
            label="E-mail"
            value={email}
            onPress={() => Linking.openURL(`mailto:${email}`)}
          />
        )}

        {website && (
          <SocialItem
            icon="globe"
            color={colors.primary[500]}
            label="Site"
            value={website}
            onPress={() => Linking.openURL(website)}
          />
        )}

        {hasNoSocials && (
          <Text style={localStyles.emptyText}>Nenhum canal de contato cadastrado.</Text>
        )}
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.neutral[800],
  },
  socialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 12,
  },
  socialIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  socialLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.neutral[600],
    marginBottom: 2,
  },
  socialValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.neutral[800]
  },
  emptyText: {
    fontSize: 14,
    color: colors.neutral[400],
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 10,
  },
});