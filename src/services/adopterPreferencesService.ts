import { AdopterPreferencesFormData } from "@/screens/profile/types/profile.types";
import { buildAdopterMatchVector } from "@/utils/matchUtils";
import { supabase } from "./supabase";

export const adopterPreferencesService = {
  updatePreferences: async (userId: string, preferencesData: AdopterPreferencesFormData) => {
    const matchVector = buildAdopterMatchVector(preferencesData);

    const { data, error } = await supabase
      .from('adopter_preferences')
      .upsert(
        {
          profiles_id: userId,
          housing_types_id: preferencesData.housingTypeId,
          has_children: Boolean(preferencesData.hasChildren),
          children_age_min: preferencesData.childrenAgeMin,
          has_other_dogs: Boolean(preferencesData.hasOtherDogs),
          has_other_cats: Boolean(preferencesData.hasOtherCats),
          hours_alone_per_day: preferencesData.hoursAlonePerDay ?? 4,
          first_time_owner: Boolean(preferencesData.firstTimeOwner),
          accepts_special_needs: Boolean(preferencesData.acceptsSpecialNeeds),
          preferred_species: preferencesData.preferredSpecies || 'all',
          preferred_sizes: preferencesData.preferredSizes || ['small', 'medium', 'large'],
          match_vector: matchVector,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'profiles_id' }
      )
      .select()
      .maybeSingle();

    if (error) throw new Error(`Erro ao salvar preferências: ${error.message}`);
    return data;
  },
};