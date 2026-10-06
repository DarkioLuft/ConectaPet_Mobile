// Banner em carrossel no topo para campanhas e avisos (mock).
import { useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');
const BANNER_WIDTH = width - 36;

export interface BannerItem {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
}

const MOCK_BANNERS: BannerItem[] = [
  {
    id: '1',
    title: 'Mais que\num pet, um\nnovo começo!',
    subtitle: 'Adote, doe, faça\na diferença.',
    imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600',
  },
  {
    id: '2',
    title: 'Feira de Adoção\nAPAAM neste\nSábado!',
    subtitle: 'Venha encontrar o seu\nmelhor amigo.',
    imageUrl: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600',
  },
];

export function NewsBannerCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const currentBanner = MOCK_BANNERS[activeIndex];

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => setActiveIndex((prev) => (prev + 1) % MOCK_BANNERS.length)}
        style={styles.bannerCard}
      >
        <View style={styles.textContainer}>
          <Text style={styles.title}>{currentBanner.title}</Text>
          <Text style={styles.subtitle}>{currentBanner.subtitle}</Text>
        </View>

        <Image
          source={{ uri: currentBanner.imageUrl }}
          style={styles.bannerImage}
          resizeMode="cover"
        />

        <View style={styles.dotsContainer}>
          {MOCK_BANNERS.map((_, idx) => (
            <View
              key={idx}
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
    backgroundColor: '#3f6212',
    borderRadius: 20,
    flexDirection: 'row',
    overflow: 'hidden',
    position: 'relative',
    elevation: 3,
    shadowColor: '#000',
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
    color: '#ffffff',
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
    backgroundColor: '#ffffff',
  },
  inactiveDot: {
    width: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
});