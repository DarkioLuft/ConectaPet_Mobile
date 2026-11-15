// src/screens/ongProfile/components/OngDonateSection.tsx

import { colors } from '@/constants/colors';
import { styles } from '@/constants/styles';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useOngDonateSection } from '../hooks/useOngDonateSection';

interface OngDonateSectionProps {
  data: any;
  onWhatsAppFallback?: () => void;
}

export function OngDonateSection({ data, onWhatsAppFallback }: OngDonateSectionProps) {
  const { pixPayload, handlePayWithBankApp, handleCopyRawKey } = useOngDonateSection(data);

  if (!data) return null;

  return (
    <View style={localStyles.container}>
      {pixPayload ? (
        <View style={[styles.card, styles.shadow, localStyles.donateCard]}>
          <View style={localStyles.headerBadge}>
            <Ionicons name="qr-code-outline" size={16} color="#16a34a" />
            <Text style={localStyles.headerBadgeText}>Doação Direta via PIX</Text>
          </View>

          <Text style={localStyles.title}>Apoie a {data.name}</Text>
          <Text style={localStyles.subtitle}>
            Escaneie o QR Code com a câmera do seu banco ou use o botão abaixo para copiar o código PIX.
          </Text>

          {/* Moldura do QR Code */}
          <View style={localStyles.qrWrapper}>
            <QRCode
              value={pixPayload}
              size={190}
              color={colors.neutral[900]}
              backgroundColor={colors.white}
            />
          </View>

          {/* Exibição da Chave */}
          <TouchableOpacity
            style={localStyles.keyBox}
            onPress={handleCopyRawKey}
            activeOpacity={0.75}
          >
            <View style={localStyles.keyTextGroup}>
              <Text style={localStyles.keyType}>Chave PIX ({data.pixKeyType})</Text>
              <Text style={localStyles.keyValue} numberOfLines={1}>
                {data.pixKey}
              </Text>
            </View>
            <View style={localStyles.copyIconPill}>
              <Ionicons name="copy-outline" size={16} color="#16a34a" />
              <Text style={localStyles.copyIconText}>Copiar</Text>
            </View>
          </TouchableOpacity>

          {/* Botão Principal: PIX Copia e Cola + Redirecionar ao Banco */}
          <TouchableOpacity
            style={localStyles.primaryBankBtn}
            onPress={handlePayWithBankApp}
            activeOpacity={0.85}
          >
            <Ionicons name="phone-portrait-outline" size={20} color={colors.white} />
            <Text style={localStyles.primaryBankBtnText}>
              Copiar PIX e abrir app do banco
            </Text>
          </TouchableOpacity>

          {/* Nota de Transparência */}
          <View style={localStyles.infoNote}>
            <Ionicons name="shield-checkmark-outline" size={16} color={colors.neutral[600]} />
            <Text style={localStyles.infoNoteText}>
              100% do valor vai diretamente para a conta da instituição, sem taxas de intermediação.
            </Text>
          </View>
        </View>
      ) : (
        <View style={[styles.card, styles.shadow, localStyles.emptyCard]}>
          <View style={localStyles.emptyIconCircle}>
            <Ionicons name="heart-outline" size={32} color="#16a34a" />
          </View>
          <Text style={localStyles.emptyTitle}>Chave PIX não cadastrada</Text>
          <Text style={localStyles.emptySubtitle}>
            Esta ONG ainda não informou uma chave PIX automática. Você pode falar diretamente com a equipe para doar ração, medicamentos ou valores.
          </Text>

          {onWhatsAppFallback && (
            <TouchableOpacity
              style={localStyles.whatsappFallbackBtn}
              onPress={onWhatsAppFallback}
              activeOpacity={0.85}
            >
              <Ionicons name="logo-whatsapp" size={18} color={colors.white} />
              <Text style={localStyles.primaryBankBtnText}>Combinar doação no WhatsApp</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    padding: 20,
  },
  donateCard: {
    padding: 22,
    alignItems: 'center',
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#dcfce7',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 12,
  },
  headerBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#16a34a',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.neutral[900],
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: colors.neutral[600],
    textAlign: 'center',
    lineHeight: 19,
    marginTop: 6,
    marginBottom: 20,
  },
  qrWrapper: {
    padding: 16,
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.neutral[200],
    marginBottom: 20,
  },
  keyBox: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.neutral[50],
    borderWidth: 1,
    borderColor: colors.neutral[200],
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    gap: 10,
  },
  keyTextGroup: {
    flex: 1,
  },
  keyType: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.neutral[600],
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  keyValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.neutral[800],
  },
  copyIconPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#dcfce7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  copyIconText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#16a34a',
  },
  primaryBankBtn: {
    width: '100%',
    height: 48,
    backgroundColor: '#16a34a',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.22,
    shadowRadius: 6,
    elevation: 3,
  },
  primaryBankBtnText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  infoNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[100],
  },
  infoNoteText: {
    flex: 1,
    fontSize: 12,
    color: colors.neutral[600],
    lineHeight: 17,
  },
  emptyCard: {
    padding: 24,
    alignItems: 'center',
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#dcfce7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.neutral[900],
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: colors.neutral[600],
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 18,
  },
  whatsappFallbackBtn: {
    width: '100%',
    height: 46,
    backgroundColor: '#16a34a',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
});