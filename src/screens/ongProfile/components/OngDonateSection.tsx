import { colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export function OngDonateSection({ ongData, onCopyPix }: any) {
  return (
    <View style={styles.container}>
      <View style={styles.pixCard}>
        <View style={styles.pixHeader}>
          <Ionicons name="cash-outline" size={24} color={colors.primary[500]} />
          <Text style={styles.pixTitle}>Doação Rápida via PIX</Text>
        </View>
        <Text style={styles.pixSubtitle}>Sua contribuição ajuda a manter os potes cheios e as vacinas em dia.</Text>
        
        <View style={styles.keyContainer}>
          <Text style={styles.pixKey}>{ongData?.pixKey}</Text>
        </View>
        
        <TouchableOpacity style={styles.copyBtn} onPress={onCopyPix}>
          <Ionicons name="copy-outline" size={18} color="white" />
          <Text style={styles.copyBtnText}>Copiar Chave PIX (CNPJ)</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Precisamos de:</Text>
      <View style={styles.needsList}>
        <View style={styles.needItem}>
          <View style={[styles.iconBox, { backgroundColor: '#fee2e2' }]}><Ionicons name="medical" size={18} color="#ef4444" /></View>
          <View><Text style={styles.needTitle}>Remédios de Pulga</Text><Text style={styles.needUrgency}>Urgência Alta</Text></View>
        </View>
        <View style={styles.needItem}>
          <View style={[styles.iconBox, { backgroundColor: '#e0e7ff' }]}><Ionicons name="restaurant" size={18} color="#6366f1" /></View>
          <View><Text style={styles.needTitle}>Ração Úmida para Gatos</Text><Text style={styles.needUrgency}>Urgência Média</Text></View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  pixCard: { backgroundColor: colors.white, padding: 20, borderRadius: 20, borderWidth: 1, borderColor: colors.primary[100], elevation: 2 },
  pixHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  pixTitle: { fontSize: 16, fontWeight: '800', color: colors.neutral[800] },
  pixSubtitle: { fontSize: 13, color: colors.neutral[600], marginBottom: 16 },
  keyContainer: { backgroundColor: colors.neutral[100], padding: 12, borderRadius: 12, alignItems: 'center', marginBottom: 16, borderWidth: 1, borderColor: colors.neutral[200] },
  pixKey: { fontSize: 15, fontWeight: 'bold', letterSpacing: 1, color: colors.neutral[800] },
  copyBtn: { backgroundColor: colors.primary[500], flexDirection: 'row', padding: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center', gap: 8 },
  copyBtnText: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: colors.neutral[800], marginTop: 24, marginBottom: 12 },
  needsList: { gap: 12 },
  needItem: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.white, padding: 12, borderRadius: 16, borderWidth: 1, borderColor: colors.neutral[200] },
  iconBox: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  needTitle: { fontSize: 14, fontWeight: 'bold', color: colors.neutral[800] },
  needUrgency: { fontSize: 11, fontWeight: '600', color: colors.neutral[600], marginTop: 2 }
});