import { generatePixPayload } from '@/utils/pixUtils';
import { AppToast } from '@/utils/toast';
import * as Clipboard from 'expo-clipboard';
import { useCallback, useMemo } from 'react';
import { Share } from 'react-native';

export function useOngDonateSection(ongData: any) {
  const pixPayload = useMemo(() => {
    if (!ongData?.pixKey) return null;

    return generatePixPayload({
      pixKey: ongData.pixKey,
      merchantName: ongData.name,
      merchantCity: ongData.address?.city?.name || 'BRASIL',
    });
  }, [ongData]);

  // Copia o código PIX Copia e Cola e abre o compartilhamento para selecionar o app do banco
  const handlePayWithBankApp = useCallback(async () => {
    if (!pixPayload) return;

    await Clipboard.setStringAsync(pixPayload);
    AppToast.success(
      'PIX Copia e Cola copiado!',
      'Abra o app do seu banco ou selecione-o abaixo para concluir.'
    );

    try {
      await Share.share({
        message: pixPayload,
        title: `Doação PIX - ${ongData.name}`,
      });
    } catch {
      // Se o usuário fechar o sheet, o código já está copiado no clipboard
    }
  }, [pixPayload, ongData]);

  const handleCopyRawKey = useCallback(async () => {
    if (!ongData?.pixKey) return;
    await Clipboard.setStringAsync(ongData.pixKey);
    AppToast.success('Chave copiada!', `${ongData.pixKeyType}: ${ongData.pixKey}`);
  }, [ongData]);

  return {
    pixPayload,
    handlePayWithBankApp,
    handleCopyRawKey,
  };
}