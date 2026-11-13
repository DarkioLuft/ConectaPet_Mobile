// Carrossel da tela inicial com os anúncios cadastrados, na ordem de cadastro.
import { colors } from '@/constants/colors';
import { useEffect, useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BannerItem } from '../types/home.types';

const { width } = Dimensions.get('window');
const BANNER_WIDTH = width - 36;

interface NewsBannerCarouselProps {
  banners?: BannerItem[];
}

export function NewsBannerCarousel({ banners = [] }: NewsBannerCarouselProps) {
  const items = banners ?? [];
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (activeIndex >= items.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, items.length]);

  if (items.length === 0) {
    return null;
  }

  const currentBanner = items[Math.min(activeIndex, items.length - 1)];

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => setActiveIndex((prev) => (prev + 1) % items.length)}
        style={styles.bannerCard}
      >
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={3}>
            {currentBanner.title}
          </Text>
          <Text style={styles.subtitle} numberOfLines={2}>
            {currentBanner.subtitle}
          </Text>
        </View>

        <Image
          source={{ uri: currentBanner.imageUrl }}
          style={styles.bannerImage}
          resizeMode="cover"
        />

        <View style={styles.dotsContainer}>
          {items.map((banner, idx) => (
            <View
              key={banner.id}
              style={[styles.dot, activeIndex === idx ? styles.activeDot : styles.inactiveDot]}
            />
          ))}
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 18,
    marginTop: -12,
    marginBottom: 16,
  },
  bannerCard: {
    width: BANNER_WIDTH,
    height: 155,
    backgroundColor: colors.primary[600],
    borderRadius: 20,
    flexDirection: 'row',
    overflow: 'hidden',
    position: 'relative',
    elevation: 3,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  textContainer: {
    flex: 1.2,
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 20,
    marginBottom: 6,
  },
  subtitle: {
    color: '#ecfccb',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },
  bannerImage: {
    flex: 1,
    height: '100%',
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 10,
    left: 18,
    flexDirection: 'row',
    gap: 4,
  },
  dot: {
    height: 5,
    borderRadius: 2.5,
  },
  activeDot: {
    width: 14,
    backgroundColor: colors.white,
  },
  inactiveDot: {
    width: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
});