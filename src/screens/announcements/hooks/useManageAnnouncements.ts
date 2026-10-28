import { AppConfirm } from '@/components/modals/CustomConfirmModal';
import { announcementService, AnnouncementDTO } from '@/services/announcementService';
import { AppToast } from '@/utils/toast';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback, useMemo, useState } from 'react';

export type ManagedAnnouncement = AnnouncementDTO & { displayOrder: number };

export function useManageAnnouncements() {
  const navigation = useNavigation<any>();
  const [announcements, setAnnouncements] = useState<ManagedAnnouncement[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchAnnouncements = useCallback(async () => {
    try {
      setLoading(true);
      const data = await announcementService.listByRegistrationOrder();

      setAnnouncements(data.map((item, index) => ({ ...item, displayOrder: index + 1 })));
    } catch (error: any) {
      AppToast.error('Erro', error?.message || 'Não foi possível carregar os anúncios.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchAnnouncements();
    }, [fetchAnnouncements])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  const filteredAnnouncements = useMemo(() => {
    if (!searchQuery.trim()) return announcements;
    const query = searchQuery.toLowerCase().trim();
    return announcements.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.subtitle.toLowerCase().includes(query)
    );
  }, [announcements, searchQuery]);

  const handleCreate = useCallback(() => {
    navigation.navigate('AnnouncementForm');
  }, [navigation]);

  const handleEdit = useCallback(
    (announcementId: string) => {
      navigation.navigate('AnnouncementForm', { announcementId });
    },
    [navigation]
  );

  const handleDelete = useCallback((item: ManagedAnnouncement) => {
    AppConfirm.show({
      title: 'Remover anúncio',
      message: `Tem certeza que deseja remover "${item.title.replace(/\n/g, ' ')}"?`,
      confirmText: 'Remover',
      cancelText: 'Cancelar',
      isDestructive: true,
      onConfirm: async () => {
        try {
          await announcementService.delete(item.id, item.image_url);
          setAnnouncements((prev) =>
            prev
              .filter((current) => current.id !== item.id)
              .map((current, index) => ({ ...current, displayOrder: index + 1 }))
          );
          AppToast.success('Sucesso', 'Anúncio removido com sucesso!');
        } catch (error: any) {
          AppToast.error('Erro ao remover', error?.message || 'Não foi possível excluir o anúncio.');
        }
      },
    });
  }, []);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return {
    announcements: filteredAnnouncements,
    totalCount: announcements.length,
    loading,
    refreshing,
    searchQuery,
    setSearchQuery,
    onRefresh,
    handleCreate,
    handleEdit,
    handleDelete,
    handleGoBack,
  };
}
