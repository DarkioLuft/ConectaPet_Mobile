import { colors } from '@/constants/colors';
import { GenericTabSection } from '@/types/tab.types';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SectionTabsProps {
  tabs: GenericTabSection[];
  currentTab: GenericTabSection;
  onSelectTab: (tab: GenericTabSection) => void;
}

export function SectionTabs({ tabs, currentTab, onSelectTab }: SectionTabsProps) {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = currentTab.key === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            activeOpacity={0.8}
            onPress={() => onSelectTab(tab)}
            style={[styles.tabButton, isActive && styles.activeTabButton]}
          >
            <Ionicons
              name={tab.icon}
              size={16}
              color={isActive ? colors.white : colors.neutral[400]}
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
    backgroundColor: colors.neutral[200],
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
    backgroundColor: colors.primary[500],
    elevation: 2,
    shadowColor: colors.primary[500],
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.neutral[400],
  },
  activeTabText: {
    color: colors.white,
    fontWeight: '700',
  },
});