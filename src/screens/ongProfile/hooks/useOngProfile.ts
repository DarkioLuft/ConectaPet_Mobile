import { ongService } from '@/services/ongService';
import { GenericTabSection } from '@/types/tab.types';
import { handleError } from '@/utils/errorHandler';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';

const ongTabs: GenericTabSection[] = [
  { key: 'about', label: 'Sobre', icon: 'information-circle-outline' },
  { key: 'pets', label: 'Pets', icon: 'paw-outline' },
  { key: 'donate', label: 'Doar', icon: 'heart-outline' },
];

export function useOngProfile(ongId: string) {

  const [activeTab, setActiveTab] = useState<GenericTabSection>(ongTabs[0]);
  const [loading, setLoading] = useState(true);
  const [ongData, setOngData] = useState<any | null>(null);

  const loadOngData = useCallback(async () => {
    if (!ongId) return;
    try {
      setLoading(true);
      
      const data = await ongService.getOngById(ongId);

      if (!data){
        throw Error("Não foi possível obter os dados da ONG.")
      }

      if (data.logo_url == null){
        data.logo_url = `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name || "U")}&background=000&color=fff`
      }

      console.log("**********************************")
      console.log(data)
      console.log("**********************************")

      setOngData(data);
    } catch (err: any) {
      handleError(err.message, 'Erro ao carregar dados.');
    } finally {
      setLoading(false);
    }
  }, [ongId]);

  useFocusEffect(
    useCallback(() => {
      loadOngData();
    }, [loadOngData])
  );

  return {
    tabs: ongTabs,
    activeTab,
    setActiveTab,
    loading,
    ongData,
    loadOngData
  };
}