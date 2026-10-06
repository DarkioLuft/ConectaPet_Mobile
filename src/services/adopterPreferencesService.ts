import { AdopterPreferencesFormData } from "@/screens/profile/types/profile.types";
import { supabase } from "./supabase";

export const adopterPreferencesService = {
    updatePreferences: async (userId: string, preferencesData: AdopterPreferencesFormData) => {
        const { data, error } = await supabase
            .from('adopter_preferences')
            .update({
                housing_types_id: preferencesData.housingTypeId,
                has_children: preferencesData.hasChildren,
                children_age_min: preferencesData.childrenAgeMin,
                has_other_dogs: preferencesData.hasOtherDogs,
                has_other_cats: preferencesData.hasOtherCats,
                hours_alone_per_day: preferencesData.hoursAlonePerDay,
                first_time_owner: preferencesData.firstTimeOwner,
                accepts_special_needs: preferencesData.acceptsSpecialNeeds,
                preferred_species: preferencesData.preferredSpecies,
                preferred_sizes: preferencesData.preferredSizes,
                updated_at: new Date().toISOString(),
            })
            .eq('profiles_id', userId)
            .select()
            .single()

        if (error) throw new Error(`Erro ao salvar preferências: ${error.message}`);
        return data;
    }
}