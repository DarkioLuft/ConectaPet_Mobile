import { OngProfileTabType } from "@/screens/ongProfile/types/ong.types";
import { ProfileTabType } from "@/screens/profile/types/profile.types";
import { Ionicons } from "@expo/vector-icons";

export interface GenericTabSection {
    key: ProfileTabType | OngProfileTabType; 
    label: string; 
    icon: keyof typeof Ionicons.glyphMap
}