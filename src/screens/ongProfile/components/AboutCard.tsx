// src/screens/ongProfile/components/AboutCard.tsx

import { colors } from '@/constants/colors';
import { styles } from '@/constants/styles';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export function AboutCard({ about }: { about: string }) {
  const [expanded, setExpanded] = useState(false);

  if (!about) return null;

  const isLargeText = about.length > 140;

  return (
    <View style={localStyles.section}>
      <Text style={localStyles.sectionTitle}>Quem Somos</Text>
      <View style={[styles.card, styles.shadow, localStyles.cardPadding]}>
        <View style={localStyles.missionBadge}>
          <Ionicons name="heart-circle" size={18} color="#16a34a" />
          <Text style={localStyles.missionText}>Nossa História e Missão</Text>
        </View>

        <Text style={localStyles.text} numberOfLines={expanded ? undefined : 4}>
          {about}
        </Text>

        {isLargeText && (
          <TouchableOpacity
            style={localStyles.readMoreButton}
            onPress={() => setExpanded(!expanded)}
            activeOpacity={0.7}
          >
            <Text style={localStyles.readMoreText}>
              {expanded ? 'Ver menos' : 'Ler mais'}
            </Text>
            <Ionicons
              name={expanded ? 'chevron-up' : 'chevron-down'}
              size={15}
              color="#16a34a"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  section: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.neutral[800],
  },
  cardPadding: {
    padding: 16,
  },
  missionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  missionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#16a34a',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  text: {
    fontSize: 14,
    color: colors.neutral[600],
    lineHeight: 22,
  },
  readMoreButton: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
  },
  readMoreText: {
    color: '#16a34a',
    fontWeight: '700',
    fontSize: 13,
  },
});