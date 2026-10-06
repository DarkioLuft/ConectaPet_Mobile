// Barra de progresso visual do topo que mostra a etapa atual e o título correspondente.

import { StyleSheet, Text, View } from 'react-native';

const STEP_TITLES = [
  'Identificação Básica',
  'Características e Saúde',
  'Preferências de Convivência',
  'Imagem e Confirmação',
];

interface StepProgressIndicatorProps {
  currentStep: number;
}

export function StepProgressIndicator({ currentStep }: StepProgressIndicatorProps) {
  const progressWidth = `${(currentStep / 4) * 100}%`;

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Text style={styles.stepBadge}>ETAPA {currentStep} DE 4</Text>
        <Text style={styles.stepSubtitle}>{STEP_TITLES[currentStep - 1]}</Text>
      </View>
      <View style={styles.progressBarBackground}>
        <View style={[styles.progressBarFill, { width: progressWidth as any }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    width: '100%',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepBadge: {
    fontSize: 13,
    fontWeight: '800',
    color: '#16a34a',
  },
  stepSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4b5563',
  },
  progressBarBackground: {
    width: '100%',
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#16a34a',
  },
});