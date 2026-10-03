import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ProfileTabType } from '../types/profile.types';

interface ProfileSectionTabsProps {
  currentTab: ProfileTabType;
  onSelectTab: (tab: ProfileTabType) => void;
}

export function ProfileSectionTabs({ currentTab, onSelectTab }: ProfileSectionTabsProps) {
  const tabs: { key: ProfileTabType; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { key: 'personal', label: 'Dados', icon: 'person-outline' },
    { key: 'address', label: 'Endereço', icon: 'location-outline' },
    { key: 'preferences', label: 'Match Pet', icon: 'heart-outline' },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = currentTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            activeOpacity={0.8}
            onPress={() => onSelectTab(tab.key)}
            style={[styles.tabButton, isActive && styles.activeTabButton]}
          >
            <Ionicons
              name={tab.icon}
              size={16}
              color={isActive ? '#ffffff' : '#64748b'}
              style={{ marginRight: 6 }}
            />
            <Text style={[styles.tabText, isActive && styles.activeTabText]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    padding: 4,
    marginHorizontal: 18,
    marginTop: 14,
    marginBottom: 8,
    borderRadius: 12,
    gap: 4,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 9,
  },
  activeTabButton: {
    backgroundColor: '#16a34a',
    elevation: 2,
    shadowColor: '#16a34a',
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  activeTabText: {
    color: '#ffffff',
    fontWeight: '700',
  },
});