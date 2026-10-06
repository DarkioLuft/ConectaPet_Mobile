import { Ionicons } from '@expo/vector-icons';
import { ComponentProps } from 'react';

export interface MaintenanceAction {
  id: string;
  title: string;
  description: string;
  iconName: ComponentProps<typeof Ionicons>['name'];
  badgeText?: string;
  onPress: () => void;
  accentColor?: string;
}