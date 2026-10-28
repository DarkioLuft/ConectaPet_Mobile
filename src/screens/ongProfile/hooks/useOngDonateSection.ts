import { AppToast } from '@/utils/toast';
import { useEffect, useState } from 'react';
// import * as Clipboard from 'expo-clipboard';

export function useOngDonateSection({ initialData }: { initialData: any }) {
  const [donateData, setDonateData] = useState<any>(null);

  useEffect(() => {
    if (initialData) {
      setDonateData({
        pixKey: initialData.pixKey,
        needs: initialData.needs,
      });
    }
  }, [initialData]);

  const handleCopyPix = async () => {
    if (!donateData?.pixKey) return;
    // await Clipboard.setStringAsync(donateData.pixKey);
    AppToast.success('PIX Copiado!', 'Chave copiada para a área de transferência.');
  };

  return { donateData, handleCopyPix };
}