import { animalService } from './animalService';
import { authService } from './authService';
import { supabase } from './supabase';

export interface AnnouncementDTO {
  id: string;
  ongs_id: string | null;
  created_by: string;
  title: string;
  subtitle: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}

interface SaveAnnouncementDTO {
  title: string;
  subtitle: string;
  image_url: string;
}

const ANNOUNCEMENTS_TABLE = 'announcements';
const PHOTO_BUCKET = 'announcement-photos';

export const announcementService = {
  async listByRegistrationOrder(): Promise<AnnouncementDTO[]> {
    const { data, error } = await supabase
      .from(ANNOUNCEMENTS_TABLE)
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      throw new Error(`Erro ao listar anúncios: ${error.message}`);
    }

    return (data as AnnouncementDTO[]) ?? [];
  },

  async getById(announcementId: string): Promise<AnnouncementDTO> {
    const { data, error } = await supabase
      .from(ANNOUNCEMENTS_TABLE)
      .select('*')
      .eq('id', announcementId)
      .single();

    if (error) {
      throw new Error(`Erro ao buscar anúncio: ${error.message}`);
    }

    return data as AnnouncementDTO;
  },

  async create(input: SaveAnnouncementDTO): Promise<AnnouncementDTO> {
    const user = await authService.getAuthenticatedUser();
    const ongsId = await animalService.getUserOngId(user.id);

    const { data, error } = await supabase
      .from(ANNOUNCEMENTS_TABLE)
      .insert({
        title: input.title,
        subtitle: input.subtitle,
        image_url: input.image_url,
        created_by: user.id,
        ongs_id: ongsId,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao cadastrar anúncio: ${error.message}`);
    }

    return data as AnnouncementDTO;
  },

  async update(announcementId: string, input: SaveAnnouncementDTO): Promise<AnnouncementDTO> {
    await authService.getAuthenticatedUser();

    const { data, error } = await supabase
      .from(ANNOUNCEMENTS_TABLE)
      .update({
        title: input.title,
        subtitle: input.subtitle,
        image_url: input.image_url,
        updated_at: new Date().toISOString(),
      })
      .eq('id', announcementId)
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao atualizar anúncio: ${error.message}`);
    }

    return data as AnnouncementDTO;
  },

  async delete(announcementId: string, imageUrl?: string | null): Promise<void> {
    await authService.getAuthenticatedUser();

    if (imageUrl) {
      const storagePath = extractAnnouncementPhotoPath(imageUrl);
      if (storagePath) {
        await supabase.storage.from(PHOTO_BUCKET).remove([storagePath]);
      }
    }

    const { error } = await supabase
      .from(ANNOUNCEMENTS_TABLE)
      .delete()
      .eq('id', announcementId);

    if (error) {
      throw new Error(`Erro ao remover anúncio: ${error.message}`);
    }
  },
};

function extractAnnouncementPhotoPath(imageUrl: string): string | null {
  const marker = `/${PHOTO_BUCKET}/`;
  const index = imageUrl.indexOf(marker);
  if (index < 0) return null;

  const path = imageUrl.slice(index + marker.length).split('?')[0];
  if (!path) return null;

  try {
    return decodeURIComponent(path);
  } catch {
    return path;
  }
}
