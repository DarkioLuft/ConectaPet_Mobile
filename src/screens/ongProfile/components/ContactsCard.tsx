// src/screens/ongProfile/components/ContactsCard.tsx

import { colors } from '@/constants/colors';
import { styles } from '@/constants/styles';
import { Ionicons } from '@expo/vector-icons';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export function ContactsCard({ instagram, whatsapp, email, website }: any) {
  const items = [
    instagram && {
      key: 'instagram',
      icon: 'logo-instagram',
      color: '#e1306c',
      label: 'Instagram',
      value: instagram.startsWith('@') ? instagram : `@${instagram}`,
      onPress: () => Linking.openURL(`https://instagram.com/${instagram.replace('@', '')}`),
    },
    whatsapp && {
      key: 'whatsapp',
      icon: 'logo-whatsapp',
      color: '#16a34a',
      label: 'WhatsApp',
      value: whatsapp,
      onPress: () => {
        const digits = whatsapp.replace(/\D/g, '');
        const fullNumber = digits.startsWith('55') ? digits : `55${digits}`;
        Linking.openURL(`whatsapp://send?phone=${fullNumber}`);
      },
    },
    email && {
      key: 'email',
      icon: 'mail',
      color: colors.semantic.warning,
      label: 'E-mail',
      value: email,
      onPress: () => Linking.openURL(`mailto:${email}`),
    },
    website && {
      key: 'website',
      icon: 'globe',
      color: colors.primary[500],
      label: 'Site Oficial',
      value: website,
      onPress: () =>
        Linking.openURL(website.startsWith('http') ? website : `https://${website}`),
    },
  ].filter(Boolean) as any[];

  return (
    <View style={localStyles.section}>
      <Text style={localStyles.sectionTitle}>Contatos e Redes</Text>
      <View style={[styles.card, styles.shadow, localStyles.cardContainer]}>
        {items.length > 0 ? (
          items.map((item, index) => (
            <TouchableOpacity
              key={item.key}
              style={[
                localStyles.socialRow,
                index < items.length - 1 && localStyles.rowDivider,
              ]}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View style={[localStyles.socialIconBox, { backgroundColor: item.color + '15' }]}>
                <Ionicons name={item.icon} size={20} color={item.color} />
              </View>
              <View style={localStyles.socialTextContainer}>
                <Text style={localStyles.socialLabel}>{item.label}</Text>
                <Text style={localStyles.socialValue} numberOfLines={1}>
                  {item.value}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.neutral[400]} />
            </TouchableOpacity>
          ))
        ) : (
          <Text style={localStyles.emptyText}>Nenhum canal de contato cadastrado.</Text>
        )}
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  section: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.neutral[800],
  },
  cardContainer: {
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  socialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
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
    fontSize: 11,
    fontWeight: '700',
    color: colors.neutral[600],
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  socialValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.neutral[800],
  },
  emptyText: {
    fontSize: 14,
    color: colors.neutral[400],
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 16,
  },
});